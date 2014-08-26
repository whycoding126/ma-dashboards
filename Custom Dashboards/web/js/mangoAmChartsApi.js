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
                
                AmCharts.makeChart(this.chartDivId,chartJson);
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
        pollPeriodMs: 500,
        gauge: null,
        gaugeDivId: null,
        units: " ", //Units label for bottom center of gauge
        jsonConfig: null,
        
        
        //Internals
        chartData: null,
        fetchCounter: 0,
        
        /**
         * Start the gauge running
         */
        startGauge: function(){
            
            this.gauge = AmCharts.makeChart(this.gaugeDivId, this.jsonConfig);
            
            setInterval(this.updateGauge, this.pollPeriodMs);
        },
        
        /**
         * Update gauge Value
         */
        updateGauge: function(){
            
        }
};

