/**
 * Javascript Objects for the Providing Data on HTML pages.  
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * Data Provider
 * @param id
 * @param point
 * @param configuration
 * @param options
 * @returns
 */
HistoricalPointValueDataProvider = function(id, options){
    
    this.id = id;
    this.listeners = new Array();
    this.pointConfigurations = new Array();
    
    for(var i in options) {
        this[i] = options[i];
    }
};

HistoricalPointValueDataProvider.prototype = {

        type: 'HistoricalPointValueDataProvider',
        
        id: null, //Unique ID for reference (use Alphanumerics as auto generated ones are numbers)
        pointConfigurations: null, //List of Points + configurations to use
        
        listeners: null, //Listeners to send new data when load() completes
        
        /**
         * Optionally manipulate data.
         * 
         *  Send in this method in the options during object creation.
         * 
         * @param data - list of point value times
         * @param point - dataPoint corresponding to pvts
         * @return Array of manipulated data
         */
        manipulateData: null,
        
        /**
         * Signal to all Listeners to clear ALL their data
         */
        clear: function(){
            for(var i=0; i<this.listeners.length; i++){
                this.listeners[i].onClear();
            }

        },
        /**
         * Load our data and publish to listeners
         * @param options {limit}
         * @param error - method to call on error
         */
        load: function(options, error){
            
            //TODO Fix up for promise using deferred and da
            //Load in the data into time order and perform data operations
            var deferred = $.Deferred();
            //Start resolving the chain
            deferred.resolve();

            var self = this;
            for(var x=0; x<this.pointConfigurations.length; x++){
                var configuration = this.pointConfigurations[x];
                var da = mangoRest.pointValues.getLatest(this.pointConfigurations[x].point.xid,
                        options.latest,
                        function(data, xid, options){

                    //Optionally manipulate the data
                    if(self.manipulateData != null)
                        data = self.manipulateData(data, options.configuration.point);
                    
                    //Inform our listeners of this new data
                    for(var i=0; i<self.listeners.length; i++){
                        self.listeners[i].onLoad(data, options.configuration.point);
                    }
                },error, {configuration: configuration});
                
                //Form Chain
            }
           
            return deferred;
        },
        
        /**
         * Add a listener who registers to know of our updates
         */
        addListener: function(dataProviderListener){
            this.listeners.push(dataProviderListener);
        },
        
        /**
         * Add a data point configuration to our list
         */
        addDataPoint: function(dataPointConfiguration){
            //We only allow adding a Data Point Configuration once
            for(var i=0; i<this.pointConfigurations.length; i++){
                if(this.pointConfigurations[i].point.xid == dataPointConfiguration.point.xid)
                    return;
            }
            this.pointConfigurations.push(dataPointConfiguration);
        },
};
