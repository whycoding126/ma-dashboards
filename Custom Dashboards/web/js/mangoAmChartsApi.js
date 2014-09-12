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
        /**
         * Gather the data, manipulate it and place it on the chart
         */
        createChart: function(){
            var _this = this; //To reference inside methods
            this.fetchCounter = 0; //Counter to know when all of our data is ready
            this.chartData = new Array();
            
            //Loop Over all of the XIDs and collect the data
            for(var i=0; i<this.xids.length; i++){
                var currentXid = this.xids[i];
                //Load in the graph with the latest point values
                //TODO Bug here where we should make a call to get ALL the data in one request!
                mangoRest.pointValues.getLatest(currentXid, this.numberOfSamples, function(data, xid){
                      // Format data and re-order the values the way AM charts expects
                      var chartData = new Array();
                      for(var i=data.length-1; i>=0; i--){
                          var pvt = new Object();
                          pvt.date = data[i].time;
                          if(typeof _this.dataOperation != 'undefined')
                              pvt[xid] = _this.dataOperation(data[i], xid);
                          else
                              pvt[xid] = data[i].value;
                          chartData.push(pvt);
                      }
                      
                      //Notify we have data and increment our counter
                      _this.fetchCounter++;
                      _this.chartDataReady(chartData);

                      
                  }, function(jqXHR, textStatus, errorThrown, mangoMessage){
                      //alert user on fail
                      alert(errorThrown + " " + mangoMessage);
                  });
            }//end for all XIDs
        }, //end createChart()
        
        /**
         * Method to load data in and determine when we are ready
         */
        chartDataReady: function(data){
            //Add the data to our existing chart data
            for(var i=0; i<data.length; i++){
                this.chartData.push(data[i]);
            }
            
            if(this.fetchCounter == this.xids.length){
                var chartJson = this.chartJson;
                chartJson.dataProvider = this.chartData;
                
                this.amChart = AmCharts.makeChart(this.chartDivId,chartJson);
            }
            
        },
        
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
        realtimeError: function(error){alert(error);},
        
        
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
                
            }, function(jqXHR, textStatus, errorThrown, mangoMessage){
                var msg = "";
                
                if(textStatus != null)
                    msg += (textStatus + " ");
                if(errorThrown != null)
                    msg += (errorThrown + " ");
                if(mangoMessage != null)
                    msg += (mangoMessage + " ");
                
                msg += "\n";
           
                
                $("#errors").text(msg);
                //alert user on fail
                //alert(errorThrown + " " + mangoMessage);
            });
            
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

