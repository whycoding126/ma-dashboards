/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

/* Mango AM Chart Helper */


NumericDataProvider = function(options){
    this.rollup = 'AVERAGE';
    this.timePeriodType = "HOURS";
    this.timePeriods = 1;

    for(var i in options) {
        this[i] = options[i];
    }
    this.data = new Array();
       
};

NumericDataProvider.prototype = {
        
        xid: null,
        from: null,
        to: null,
        rollup: null,
        timePeriodType: null,
        timePeriods: null,
        
        serialCharts: null, //List of serial charts
        onLoadListeners: new Array(), //Array of objects with onLoad methods. TBD

        errorDivId: 'errors',
        //member of object in data array to use as x axis value in chart
        timeDataAttribute: 'time',
        //member of object in data array to use as y axis value in chart
        valueDataAttribute: 'value',
        
        //Promise Setup
        deferred: $.Deferred(),
        promise: function(){
            return this.deferred.promise();
        },

        data: null,
        
        /**
         * Load the Point Values
         * @return promise
         */
        load: function(){
            var deferred = $.Deferred();
            while(this.data.length >0)
                this.data.pop(); //Empty out array
            var self = this;
            mangoRest.pointValues.get(this.xid, 
                    mangoRest.formatLocalDate(this.from),
                    mangoRest.formatLocalDate(this.to),
                    this.rollup, this.timePeriodType, this.timePeriods,
                    function(data){
                for(var i in data){
                    var entry = new Object();
                    entry[self.valueDataAttribute] = self.valueOperation(self.data,
                            data[i], self.xid);
                    entry[self.timeDataAttribute] = self.timeOperation(self.data,
                            data[i], self.xid);
                    entry.timestamp = data[i].timestamp;
                    self.data.push(entry);
                }
                //Update all of our charts
                for(var i=0; i<self.serialCharts.length; i++){
                    self.addToLineChart(self.serialCharts[i]);
                }
                deferred.resolve(); //Resolve our promise
            },this.error);
            
            return deferred;
        },
        

        /**
         * Add my point values to the amChart
         */
        addToLineChart: function(amChart){
            if(amChart.dataProvider.length >0){
                //Assume the data is in order
                //Find starting point for chart's data provider
                var pos = amChart.dataProvider.length-1;
                for(var j=0; j<amChart.dataProvider.length; j++){
                    if(amChart.dataProvider[j].timestamp >= this.data[0].timestamp){
                        pos = j;
                        break;
                    }
                }
                
                var startPos = 0;
                if(amChart.dataProvider[pos].timestamp == this.data[0].timestamp){
                    //Merge
                    amChart.dataProvider[pos][this.valueDataAttribute] = this.data[0][this.valueDataAttribute];
                }else{
                    amChart.dataProvider.splice(pos,0,this.data[0]);
                }
                //Insert the data
                for(var i=1; i<this.data.length; i++){
                    //Find the next location to insert
                    var found = false;
                    for(var j = pos; j<amChart.dataProvider.length; j++){
                        if(amChart.dataProvider[j].timestamp >= this.data[i].timestamp){
                            pos = j;
                            found = true;
                            break;
                        }
                    }
                    
                    //Append or splice
                    if(!found){
                        //Insert at end
                        amChart.dataProvider.push(this.data[i]);
                    }else{
                        if(amChart.dataProvider[pos].timestamp == this.data[i].timestamp){
                            //Merge
                            amChart.dataProvider[pos][this.valueDataAttribute] = this.data[i][this.valueDataAttribute];
                        }else{
                            amChart.dataProvider.splice(pos,0,this.data[i]);
                        } 
                    }

                }
            }else{
                //Just insert as is, no data to merge
                for(var i=0; i<this.data.length; i++){
                    amChart.dataProvider.push(this.data[i]);
                }
            }
            amChart.validateData();
        },
        
        /**
         * Perform an operation and add all values to the amChart
         */
        addToPieChart: function(amChart, operation){
            var entry = operation(this.data, this.valueDataAttribute, this.timeDataAttribute);
            amChart.dataProvider.push(entry);
            amChart.validateData();
        },
        
        /**
         * Add my point values to the amChart
         */
        addToStockChart: function(amChart, dataSetTitle){
            var dataProvider;
            for(var j in amChart.dataSets){
                if(amChart.dataSets[j].title == dataSetTitle){
                    dataProvider = amChart.dataSets[j].dataProvider;
                    break;
                }
            }
            for(var i in this.data){
                dataProvider.push(this.data[i]);
            }
            amChart.validateData();
        },

        
        valueOperation: function(processedData, pvt, xid){
            return pvt.value.toFixed(2);
        },
        timeOperation: function(processedData, pvt, xid){
            return pvt.time;
        },
                
        /**
         * Helper to display error messages in the error div.
         * Override as needed
         * 
         * @param jqXHR - xhr response
         * @param textStatus - status from response
         * @param errorThrown - exception
         * @mangoMessaage - string response from Mango
         */
        showError: function(jqXHR, textStatus, errorThrown, mangoMessage){
        
            var msg = "";
            if(textStatus != null)
                msg += (textStatus + " ");
            if(errorThrown != null)
                msg += (errorThrown + " ");
            if(mangoMessage != null)
                msg += (mangoMessage + " ");
            msg += "\n";
            $("#" + this.errorDivId).text(msg);
        }
        
};