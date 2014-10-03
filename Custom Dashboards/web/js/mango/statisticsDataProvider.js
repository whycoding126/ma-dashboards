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
StatisticsDataProvider = function(id, options){
    
    this.id = id;
    this.listeners = new Array();
    this.pointConfigurations = new Array();
    
    for(var i in options) {
        this[i] = options[i];
    }
};

StatisticsDataProvider.prototype = {

        type: 'StatisticsDataProvider',
        
        id: null, //Unique ID for reference (use Alphanumerics as auto generated ones are numbers)
        pointConfigurations: null, //List of Points + configurations to use
        
        listeners: null, //Listeners to send new data when load() completes
        
        /**
         * Optionally manipulate data.
         * 
         *  Send in this method in the options during object creation.
         * 
         * @param data - list of point value times
         * @param xid - xid corresponding to pvts
         * @return Array of manipulated data
         */
        manipulateData: null,
        
        /**
         * Clear out our pointConfigurations if required
         * 
         * Signal to all Listeners to clear ALL their data
         * 
         * @param clearConfigurations - boolean to clear pointConfigurations too
         */
        clear: function(clearConfigurations){
            if(clearConfigurations == true)
               while(this.pointConfigurations.length > 0){
                   this.pointConfigurations.pop();
               } 
           for(var i=0; i<this.listeners.length; i++){
               this.listeners[i].onClear();
           }
        },
        
        /**
         * Load our data and publish to listeners
         * @param options - {from: date, to: date}
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
                var pos = x;
                var da = mangoRest.pointValues.getStatistics(this.pointConfigurations[x].point.xid, 
                        mangoRest.formatLocalDate(options.from),
                        mangoRest.formatLocalDate(options.to),
                        function(data){

                    //Optionally manipulate the data
                    if(self.manipulateData != null)
                        data = self.manipulateData(data, self.pointConfigurations[pos].point);
                    
                    //Inform our listeners of this new data
                    for(var i=0; i<self.listeners.length; i++){
                        self.listeners[i].onLoad(data, self.pointConfigurations[pos].point);
                    }
                },error);
                
                //Form Chain
            }
           
            return deferred;
        },
        
        /**
         * Put Point Value - No Op For this class
         * 
         * @param options {
         *                  refresh: boolean to refresh displays,
         *                  value: PointValueTime Model
         *                 }
         * 
         * @param error - function(jqXHR, textStatus, errorThrown, mangoMessage)
         * 
         */
        put: function(options, error){},
        
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
