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
         * @return promise when done
         */
        load: function(options, error){
            
            
            //We will keep the requests in order by using a Deferred Chain
            var link = $.Deferred();
            var promise = link.promise();

            var self = this;
            $.each(this.pointConfigurations, function(i, configuration){
                //Form Chain
                 promise = promise.then(function(){
                     return mangoRest.pointValues.getStatistics(configuration.point.xid, 
                            mangoRest.formatLocalDate(options.from),
                            mangoRest.formatLocalDate(options.to),
                            function(data, xid, options){
    
                        //Optionally manipulate the data
                        if(options.owner.manipulateData != null)
                            data = options.owner.manipulateData(data, options.configuration.point);
                        
                        //Inform our listeners of this new data
                        for(var i=0; i<options.owner.listeners.length; i++){
                            options.owner.listeners[i].onLoad(data, options.configuration.point);
                        }
                    },error, {configuration: configuration, owner: self});
                 });
                //Form Chain
            });
            //Resolve the Deferred and start the Chain
            link.resolve();
            //Return the final promise that will be resolved when done
            return promise;
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
