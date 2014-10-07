/**
 * Javascript Object for the templating HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

/**
 * Data Display Manager
 * @param options
 * @returns
 */
DataDisplayManager = function(displayConfigurations, options){
    
    this.displayConfigurations = displayConfigurations;
    this.dataProviderConfigurations = new Array();
    
    this.dataProviders = new Array();
    this.displays = new Array();
    
    this.errorDivId = "errors";
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    if(this.displayConfigurations == null)
        this.displayConfigurations = new Array();
    else{
        for(var i=0; i<this.displayConfigurations.length; i++){
            this.displays.push(this.displayConfigurations[i].createDisplay());
        }
    }
        
};

DataDisplayManager.prototype = {
        displayConfigurations: null, //List of all display widget configuration
        dataProviderConfigurations: null, //List of data provider configurations
        
        displays: null, //List of our displays
        dataProviders: null, //List of all our data providers
        errorDivId: null, //Div to place error messages

        /**
         *  @param displayConfiguration - config to use
         *  @param createDisplay - optional boolean to create the object
         */
        addDisplayConfiguration: function(displayConfiguration){
            //Add a display configuration 
            this.displays.push(displayConfiguration.createDisplay());
            this.displayConfigurations.push(displayConfiguration);
        },
        
        addProvider: function(dataProvider){
            this.dataProviders.push(dataProvider);
            //Search our displays to find who wants to listen
            this.registerWithDisplays(dataProvider);
        },
        
        clearProviders: function(){
            while(this.dataProviders.length >0)
                this.dataProviders.pop(); //Empty out array
        },
        
        /**
         * Using a point and a configuration create or find an existing data provider
         * @param dataPointConfiguration - data point configuration
         */
        addDataPointConfiguration: function(dataPointConfiguration){
            var dataProvider; 
            if(dataPointConfiguration.providerId != null){
                //Find it in the list
                for(var i=0; i<this.dataProviders.length; i++){
                    if(this.dataProviders[i].id == dataPointConfiguration.providerId){
                        this.dataProviders[i].addDataPoint(dataPointConfiguration);
                        return;
                    }
                }
                
            }else{
                //Assign an id
                dataPointConfiguration.providerId = this.dataProviders.length;
            }
            
            //None found, provider Id is set
            if(dataPointConfiguration.providerType == 'PointValue'){
                dataProvider = new PointValueDataProvider(dataPointConfiguration.providerId);
            }else if(dataPointConfiguration.providerType == 'Statistics'){
                dataProvider = new StatisticsDataProvider(dataPointConfiguration.providerId);
            }else if(dataPointConfiguration.providerType == 'RealtimePointValue'){
                dataProvider = new RealtimePointValueDataProvider(dataPointConfiguration.providerId);
            }else if(dataPointConfiguration.providerType == 'HistoricalPointValue'){
                dataProvider = new HistoricalPointValueDataProvider(dataPointConfiguration.providerId);
            }
            //Add the point configuration
            dataProvider.addDataPoint(dataPointConfiguration);
            //Search our displays to find who wants to listen
            this.addProvider(dataProvider);
        },
        
        /**
         * Register a data provider with any displays that have it as one of
         * its dataProviderIds
         * @param dataProvider
         * @returns
         */
        registerWithDisplays: function(dataProvider){
            //Search our displays and add them as listeners to the data provider
            for(var i=0; i<this.displays.length; i++){
                if($.inArray(dataProvider.id, this.displays[i].dataProviderIds) >= 0){
                    dataProvider.addListener(this.displays[i]);
                }
            }
        },
        
        /**
         * 
         * 
         * @param dataProviderListener
         * @param optional id for provider to register with, if none then register with all
         */
        regsiterWithDataProviders: function(dataProviderListener, providerId){
            if(typeof providerId == 'undefined'){
                for(var i=0; i<this.dataProviders.length; i++){
                    this.dataProviders[i].addListener(dataProviderListener);
                }
            }else{
                for(var i=0; i<this.dataProviders.length; i++){
                    if(this.dataProviders[i].id == providerId){
                        this.dataProviders[i].addListener(dataProviderListener);
                    }
                }                
            }

        },
        
        /**
         * Signal to data providers to clear data
         * 
         * @param clearConfigurations - boolean to indicate we need to drop point configurations too
         * @param ids - array of integers indicating which data providerIDs to signal to clear 
         */
        clear: function(clearConfigurations, ids){
            if((typeof ids == 'undefined')||(ids == null)){
                for(var i=0; i<this.dataProviders.length; i++){
                     this.dataProviders[i].clear(clearConfigurations);
                }
            }else{
                //We have Args
                for(var i=0; i<this.dataProviders.length; i++){
                    if($.inArray(this.dataProviders[i].id, ids) >= 0){
                         this.dataProviders[i].clear(clearConfigurations);
                    }
                }
            }
        },
        
        /**
         * Refresh data providers with IDs (or if not defined then all)
         */
        refresh: function(ids, options){
            if((typeof ids == 'undefined')||(ids == null)){
                for(var i=0; i<this.dataProviders.length; i++){
                    this.dataProviders[i].load(options, this.error);
                }
            }else{
                //We have Args
                for(var i=0; i<this.dataProviders.length; i++){
                    if($.inArray(this.dataProviders[i].id, ids) >= 0){
                        this.dataProviders[i].load(options, this.error);
                    }
                }
            }
        },
        
        /**
         * Force an AmCharts Re-size
         * @param divIds - Array of String div ids
         * @param displayManager - manager for displays
         */
        invalidateChartSize: function(divIds, displayManager){
            //Refresh the am chart for all divIds
            for(var i=0; i<displayManager.displays.length; i++){
                var display = displayManager.displays[i];
                if($.inArray(display.divId, divIds) >= 0){
                   //Invlidate the chart size
                   display.amChart.invalidateSize();
               }
            }

        },
        
        
        /**
         * Helper Function to show error messages
         */
        error: function(jqXHR, textStatus, errorThrown, mangoMessage){
            
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