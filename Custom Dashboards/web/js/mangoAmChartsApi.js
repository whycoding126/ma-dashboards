/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

/* Mango AM Chart Helper */
MangoAmChartHelper = function(options){
    for(var i in options) {
        this[i] = options[i];
    }
    
};

MangoAmChartHelper.prototype = {
        
        amChart: null,
        chartData: null,
        fetchCounter: 0,
        numberOfSamples: null,
        fromDate: null,
        toDate: null,
        rollup: null, //['AVERAGE', 'MAXIMUM', 'MINIMUM', 'SUM', 'FIRST', 'LAST', 'COUNT']
        timePeriodType: null, //['MILLISECONDS', 'SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS']
        timePeriods: null, //Number of periods to use
        chartDivId: null, //Div ID for chart
        
        /**
         * Displaying Loading... on top of chart div
         */
        chartLoading: function(){
            $('#' + this.chartDivId).html('<b>Loading Chart...</b>');
        },
        
        /**
         * Gather the data, manipulate it and place it on the chart
         */
        createChart: function(){
            this.chartLoading(); //Signal we are loading a chart
            
            var _this = this; //To reference inside methods
            this.fetchCounter = 0; //Counter to know when all of our data is ready
            this.chartData = new Array();
            
            //Loop Over all of the XIDs and collect the data
            for(var i=0; i<this.xids.length; i++){
                var currentXid = this.xids[i];
                //Load in the graph with the latest point values
                //TODO Bug here where we should make a call to get ALL the data in one request!
                
                if(this.numberOfSamples == null){
                    mangoRest.pointValues.get(currentXid, 
                            mangoRest.formatLocalDate(this.fromDate),
                            mangoRest.formatLocalDate(this.toDate),
                            this.rollup, this.timePeriodType, this.timePeriods,
                            function(data, xid){
                        //Notify we have data and increment our counter
                        _this.fetchCounter++;
                        _this.chartDataReady(data, xid, false);

                        
                     },this.showError); 
                }else{
                    mangoRest.pointValues.getLatest(currentXid, this.numberOfSamples, function(data, xid){
                        //Notify we have data and increment our counter
                        _this.fetchCounter++;
                        _this.chartDataReady(data, xid, true);

                        
                     }, this.showError);                    
                }
            }//end for all XIDs
        }, //end createChart()
        
        /**
         * Method to get the value for the chart,
         * override as necessary.
         */
        dataOperation: function(allData, pvt, xid){
            return pvt.value;
        },
        
        /**
         * Get the time value for the chart,
         * override as necessary
         */
        timeOperation: function(allData, pvt, xid){
            return pvt.time;
        },
        
        /**
         * Method to load data in and determine when we are ready
         */
        chartDataReady: function(data, xid, reverse){
            //Add the data to our existing chart data
            if(reverse){
                // Format data and re-order the values the way AM charts expects
                for(var i=data.length-1; i>=0; i--){
                    var pvt = new Object();
                    pvt[xid] = this.dataOperation(this.chartData, data[i], xid);
                    pvt["date"] = this.timeOperation(this.chartData, data[i], xid);
                    this.chartData.push(pvt);
                };
            }else{
                // Format data the way AM charts expects
                for(var i=0; i<data.length; i++){
                    var pvt = new Object();
                    pvt[xid] = this.dataOperation(this.chartData, data[i], xid);
                    pvt["date"] = this.timeOperation(this.chartData, data[i], xid);
                    this.chartData.push(pvt);
                }
            }
            
            
            if(this.fetchCounter == this.xids.length){
                var chartJson = this.chartJson;
                chartJson.dataProvider = this.chartData;
                
                this.amChart = AmCharts.makeChart(this.chartDivId,chartJson);
                this.chartReady();
            }
            
        },
        
        /**
         * Notification method that the chart is rendered.
         * 
         * Useful when displaying a loading graphic
         */
        chartReady: function(){
            
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
            alert(msg); 
        }
        
};

/* Gauge Helper */
MangoAmGaugeHelper = function(options){
    for(var i in options) {
        this[i] = options[i];
    }
    
};

MangoAmGaugeHelper.prototype = {
        
        xid: null,
        realtime: false,
        gauge: null,
        gaugeDivId: null,
        units: " ", //Units label for bottom center of gauge
        decimalPlaces: 2,
        jsonConfig: null,
        /**
         * Function for realtime errors, override as needed
         */
        realtimeError: function(error){alert(error);},

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
            alert(msg); 
        },
        
        //Internals
        chartData: null,
        fetchCounter: 0,
        socket: null,
        
        /**
         * Start the gauge running
         */
        startGauge: function(){
            
            this.gauge = AmCharts.makeChart(this.gaugeDivId, this.jsonConfig);
            
            //Collect the data for the first time
            var _this = this;
            mangoRest.pointValues.getLatest(_this.xid, 1, function(data, xid){
                
                if(data.length > 0){
                    var value = data[0].value;
                    _this.gauge.arrows[0].setValue(value);
                    _this.gauge.axes[0].setBottomText(_this.renderValue(data[0]));
                }
                
            },  this.showError);
            
            //Create realtime updates if necessary
            if(this.realtime){
                var _this = this;
                this.socket = mangoRest.pointValues.registerForEvents(this.xid,
                        ['UPDATE'],
                        function(message){ //On Message Received Method
                           if(message.status == 'OK'){
                                _this.gauge.arrows[0].setValue(message.payload.value.value);
                                _this.gauge.axes[0].setBottomText(_this.renderValue(message.payload.value));
                                
                           }else{
                               _this.realtimeError(message.payload.type + " - " + message.payload.message);
                           }
                        },function(error){ //On Error Method
                            _this.realtimeError(error);
                        },function(){ //On Open Method
                            //document.getElementById('errors').innerHTML = '';
                        },function(){ //On Close Method
                            //document.getElementById('errors').innerHTML = '';
                        });
                
                
            }

        },
        /**
         * Render the value for the gauge
         * @param value
         * @returns
         */
        renderValue: function(pvt){
            return pvt.value.toFixed(this.decimalPlaces) + " " +  this.units;
        }
};

