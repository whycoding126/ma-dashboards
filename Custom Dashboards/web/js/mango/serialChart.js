/**
 * Javascript Objects for the Displaying Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Configuration for Serial Charts
 * @param divId
 * @param dataProviderIds
 * @param mixin
 * @param options
 * @returns
 */
SerialChartConfiguration = function(divId, dataProviderIds, amChartMixin, mangoChartMixin, options){
    this.divId = divId;
    this.amChartMixin = amChartMixin;
    this.mangoChartMixin = mangoChartMixin;
    this.dataProviderIds = dataProviderIds;
    
    for(var i in options) {
        this[i] = options[i];
    }

    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.amChartMixin);
    //Ensure we have a data provider
    if(typeof this.configuration.dataProvider == 'undefined')
        this.configuration.dataProvider = new Array();
    
};

/**
 * Serial Chart Config
 */
SerialChartConfiguration.prototype = {
        divId: null, //Div of chart
        
        amChartMixin: null, //Any AmChart JSON configuration to override
        
        mangoChartMixin: null, //Any Mango Serial Chart mixins
        
        configuration: null, //The full config with mixin
       
        dataProviderIds: null, //List of my data provider ids
        
        /**
         * Displaying Loading... on top of chart div
         */
        chartLoading: function(){
            $('#' + this.divId).html('<b>Loading Chart...</b>');
        },
        
        /**
         * Do the heavy lifting and create the item
         * @return AmChart created
         */
        createDisplay: function(){
            this.chartLoading();
            var serial = new MangoSerialChart(
                    AmCharts.makeChart(this.divId, this.configuration), 
                    this.dataProviderIds);
            
            return $.extend(true, {}, serial, this.mangoPieMixin);
        },
        
        
        /**
         * Return the base Serial Chart Configuration
         */
        getBaseConfiguration: function(){
            return  {                    
            type: "serial",
            //Note the path to images
            pathToImages: "/modules/dashboards/web/js/amcharts/images/",
            //Set to date field in result data
            categoryField: "timestamp",
            categoryAxis: {
                "minPeriod": "ss",
                "parseDates": true //TODO Fix this so we are sending in dates
            },
            chartCursor: {
                "categoryBalloonDateFormat": "JJ:NN:SS"
            },
            "chartScrollbar": {},
            "trendLines": [],
            "graphs": [],
            "guides": [],
            "valueAxes": [],
            "allLabels": [],
            "balloon": {},
            legend: {
                useGraphSettings: true,
                /**
                 * Method to render the Legend Values better
                 */
                valueFunction: function(graphDataItem){
                    if(typeof graphDataItem.values != 'undefined')
                        return graphDataItem.values.value.toFixed(2);
                    else
                        return "";
                }
            },
            "titles": [],
        };
     }
};


/**
 * Serial Chart Object
 * @param amChart
 * @param dataProviderIds
 * @param options
 * @returns
 */
MangoSerialChart = function(amChart, dataProviderIds, options){
    
    this.amChart = amChart;
    this.dataProviderIds = dataProviderIds;
    this.valueAttribute = 'value'; //Can override with options
    
    for(var i in options) {
        this[i] = options[i];
    }
};

MangoSerialChart.prototype = {
        
        /**
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, xid){
            
            if(this.amChart.dataProvider.length >0){
                //Assume the data is in order
                //Find starting point for chart's data provider
                var pos = this.amChart.dataProvider.length-1;
                for(var j=0; j<this.amChart.dataProvider.length; j++){
                    if(this.amChart.dataProvider[j].timestamp >= data[0].timestamp){
                        pos = j;
                        break;
                    }
                }
                
                var startPos = 0;
                if(this.amChart.dataProvider[pos].timestamp == data[0].timestamp){
                    //Merge
                    this.amChart.dataProvider[pos][xid] = data[0][this.valueAttribute];
                }else{
                    this.amChart.dataProvider.splice(pos,0,data[0]);
                }
                //Insert the data
                for(var i=1; i<data.length; i++){
                    //Find the next location to insert
                    var found = false;
                    for(var j = pos; j<this.amChart.dataProvider.length; j++){
                        if(this.amChart.dataProvider[j].timestamp >= data[i].timestamp){
                            pos = j;
                            found = true;
                            break;
                        }
                    }
                    
                    //Append or splice
                    if(!found){
                        //Insert at end
                        this.amChart.dataProvider.push(data[i]);
                    }else{
                        if(this.amChart.dataProvider[pos].timestamp == data[i].timestamp){
                            //Merge
                            this.amChart.dataProvider[pos][xid] = data[i][this.valueAttribute];
                        }else{
                            this.amChart.dataProvider.splice(pos,0,data[i]);
                        } 
                    }

                }
            }else{
                //Just insert as is, no data to merge
                for(var i=0; i<data.length; i++){
                    var entry = {timestamp: data[i].timestamp};
                    entry[xid] = data[i][this.valueAttribute];
                    this.amChart.dataProvider.push(entry);
                }
            }
            this.amChart.validateData();
            
        }
};
