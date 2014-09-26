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
StatisticsDataProvider = function(id, dataPointConfiguration, options){
    
    this.id = id;
    this.listeners = new Array();
    this.pointConfigurations = new Array();
    this.pointConfigurations.push(dataPointConfiguration);
    
    for(var i in options) {
        this[i] = options[i];
    }
};

StatisticsDataProvider.prototype = {

        type: 'StatisticsDataProvider',
        
        id: null, //Unique ID for reference (use Alphanumerics as auto generated ones are numbers)
        pointConfigurations: null, //List of Points + configurations to use
        from: null, //From date
        to: null, //To Date
        
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
         * Load our data and publish to listeners
         * 
         * @param error - method to call on error
         */
        load: function(error){
            
            //TODO Fix up for promise using deferred and da
            //Load in the data into time order and perform data operations
            var deferred = $.Deferred();
            //Start resolving the chain
            deferred.resolve();

            var self = this;
            for(var x=0; x<this.pointConfigurations.length; x++){
                var pos = x;
                var da = mangoRest.pointValues.getStatistics(this.pointConfigurations[x].point.xid, 
                        mangoRest.formatLocalDate(this.from),
                        mangoRest.formatLocalDate(this.to),
                        function(data){

                    //Optionally manipulate the data
                    if(this.manipulateData != null)
                        data = this.manipulateData(data, self.pointConfigurations[pos].point.xid);
                    
                    //Inform our listeners of this new data
                    for(var i=0; i<self.listeners.length; i++){
                        self.listeners[i].onLoad(data, self.pointConfigurations[pos].point.xid);
                    }
                },error);
                
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
            this.pointConfigurations.push(dataPointConfiguration);
        },
};
