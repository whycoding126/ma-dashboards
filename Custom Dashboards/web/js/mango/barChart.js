/**
 * Javascript Objects for the Displaying Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Configuration for Bar Charts
 * @param divId
 * @param dataProviderIds
 * @param mixin
 * @param options
 * @returns
 */
BarChartConfiguration = function(divId, dataProviderIds, amChartMixin, mangoChartMixin, options){
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
 * Bar Chart Config
 */
BarChartConfiguration.prototype = {
        divId: null, //Div of chart
        
        amChartMixin: null, //Any AmChart JSON configuration to override
        
        mangoChartMixin: null, //Any Mango Serial Chart mixins
        
        configuration: null, //The full config with mixin
       
        dataProviderIds: null, //List of my data provider ids
        
        dataPointMappings: null, //List of Data Point Matching Items (not required)
        
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
            var serial = new MangoBarChart(
                    AmCharts.makeChart(this.divId, this.configuration), 
                    this.dataProviderIds, this.dataPointMappings);
            
            return $.extend(true, {}, serial, this.mangoChartMixin);
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
            categoryField: "xid",
            rotate: true,
            startDuration: 1,
            categoryAxis: {
                gridPosition: "start",
                position: "left"
            },
            trendLines: [],
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
                        if(typeof graphDataItem.values.value != 'undefined')
                            return graphDataItem.values.value.toFixed(2);
                    
                    return ""; //Otherwise nada
                }
            },
            "titles": [],
        };
     }
};


/**
 * Bar Chart Object
 * @param amChart
 * @param dataProviderIds
 * @param options
 * @returns
 */
MangoBarChart = function(amChart, dataProviderIds, dataPointMappings, options){
    
    this.amChart = amChart;
    this.dataProviderIds = dataProviderIds;
    this.categoryField = 'xid'; //How to separate Categories
    this.dataPointMappings = dataPointMappings;
    
    for(var i in options) {
        this[i] = options[i];
    }
};

MangoBarChart.prototype = {
        
        seriesValueMapping: null, //Set to 'xid' or 'name' if using multiple series on a chart, otherwise default of 'value' is used
        /**
         * Using our map get the series value attribute
         * 
         * @param dataPoint 
         */
        getSeriesValueAttribute: function(dataPoint){
            
            if(this.dataPointMappings != null){
                for(var i=0; i<this.dataPointMappings.length; i++){
                    if(this.matchPoint(this.dataPointMappings[i], dataPoint) == true){
                        return this.dataPointMappings[i].valueField;
                    }
                }
            }else{
                if(this.seriesValueMapping == null)
                    return 'value';
                else{
                    return dataPoint[this.seriesValueMapping];
                }                
            }

        },
        
        /**
         * Check to see if our data point matches this mapping
         */
        matchPoint: function(configuration, point){
            var match = true;
            //Does this point match this template
            if(configuration.nameStartsWith != null){
                if(point.name.indexOf(configuration.nameStartsWith) == 0)
                    match = true;
                else
                    match = false;
            }
            if(configuration.nameEndsWith != null){
                if(point.name.indexOf(configuration.nameEndsWith, point.name.length - configuration.nameEndsWith.length) !== -1)
                    match = true;
                else
                    match = false;
            }
            if(configuration.xidStartsWith != null){
                if(point.xid.indexOf(configuration.xidStartsWith) == 0)
                    match = true;
                else
                    match = false;
            }
            if(configuration.xidEndsWith != null){
                if(point.xid.indexOf(configuration.xidEndsWith, point.xid.length - configuration.xidEndsWith.length) !== -1)
                    match = true;
                else
                    match = false;
            }
            return match;
        },
        
        /**
         * Data Provider listener to clear data
         */
        onClear: function(){
            while(this.amChart.dataProvider.length >0){
                this.amChart.dataProvider.pop();
            }
        },
        
        /**
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, dataPoint){
            
            //Get the member name to put the value against in the Series
            var seriesValueAttribute = this.getSeriesValueAttribute(dataPoint);
            var total = 0;
            //Simply total up the values
            for(var i=0; i<data.length; i++){
               
                total = total + data[i].value;
                
            }
            total = total / i;
            //Create one entry per Data Point
            var entry = {};
            entry[seriesValueAttribute] = total;
            entry[this.categoryField] = dataPoint[this.categoryField];
            this.amChart.dataProvider.push(entry);
            
            
            this.amChart.validateData();
            
        }
};
