/**
 * Javascript Object for the Configuring a Pie Chart
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Pie Chart Configuration
 * @param divId
 * @param dataProviderIds
 * @param amChartMixin
 * @param mangoPieMixin
 * @param options
 * @returns
 */
PieChartConfiguration = function(divId, dataProviderIds, 
        amChartMixin, mangoPieMixin, options){
    this.divId = divId;
    this.amChartMixin = amChartMixin;
    this.mangoPieMixin = mangoPieMixin;
    this.dataProviderIds = dataProviderIds;
    
    for(var i in options) {
        this[i] = options[i];
    }

    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.amChartMixin);
    //Ensure we have a data provider
    if(typeof this.configuration.dataProvider == 'undefined')
        this.configuration.dataProvider = new Array();
    
};

PieChartConfiguration.prototype = {
        divId: null, //Div of chart
        
        mangoPieMixin: null, //Any mixins for the MangoPie chart
        
        amChartMixin: null, //Any AmChart JSON configuration to override
        
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
            var pie = new MangoPieChart(
                    AmCharts.makeChart(this.divId, this.configuration), 
                    this.dataProviderIds);
            
            return $.extend(true, {}, pie, this.mangoPieMixin);
        },
        
        
        /**
         * Return the base Serial Chart Configuration
         */
        getBaseConfiguration: function(){
            return  {                    
            type: "pie",
            theme: "none",
            valueField: "total",
            titleField: "xid",
            exportConfig:{    
                menuItems: [{
                icon: "/modules/dashboards/web/js/amcharts/images/export.png",
                format: "png"   
                }]
            }
        };
     }
};

/**
 * Mango Pie Chart
 */
MangoPieChart = function(amChart, dataProviderIds, options){
    
    this.amChart = amChart;
    this.dataProviderIds = dataProviderIds;
    this.valueAttribute = 'value'; //Can override with options
    
    for(var i in options) {
        this[i] = options[i];
    }
};

MangoPieChart.prototype = {
        
        /**
         * Default action is to total per XID
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, xid){

            var total = 0;
            for(var i=0; i<data.length; i++){
                total += data[i][this.valueAttribute];
            }
            
            //Check to see if it already exists in the chart
            for(var i=0; i<this.amChart.dataProvider.length; i++){
                if(this.amChart.dataProvider[i].xid == xid){
                    this.amChart.dataProvider[i].total = total;
                    this.amChart.validateData();
                    return; //Done
                }
            }
            //We didn't find our set, so add a brand new one
            this.amChart.dataProvider.push({total: total, xid: xid});
            this.amChart.validateData();        
      }
};