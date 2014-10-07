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
RealtimePointValueDataProvider = function(id, options){
    
    this.id = id;
    this.listeners = new Array();
    this.pointConfigurations = new Array();
    this.socketMap = new Object();
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    var self = this;
    for(var x=0; x<this.pointConfigurations.length; x++){
        this.registerPoint(this.pointConfigurations[x].point.xid);
    }
    
    
};

RealtimePointValueDataProvider.prototype = {

        type: 'RealtimePointValueDataProvider',
        
        id: null, //Unique ID for reference (use Alphanumerics as auto generated ones are numbers)
        pointConfigurations: null, //List of Points + configurations to use
        
        listeners: null, //Listeners to send new data when load() completes

        socketMap: null, //Map of sockets to xids
        
        loadMostRecent: true, //Load most recent 1 sample
        
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
         * 
         * This is a special case that return the most recent point value
         * to kick start the data provider since 
         * a point may not be updating often and data may be desired
         * 
         * @param error - method to call on error
         */
        load: function(options, error){
            this.error = error;
            
            if(this.loadMostRecent == false)
                return;
            
            //To make life easier we will allow access to the most current point value
            // on a load
            //We will keep the requests in order by using a Deferred Chain
            var link = $.Deferred();
            var promise = link.promise();

            var self = this;
            $.each(this.pointConfigurations, function(i, configuration){
                //Form Chain
                 promise = promise.then(function(){
                    return mangoRest.pointValues.getLatest(configuration.point.xid,
                            1,
                            function(data, xid, options){
    
                        //Optionally manipulate the data
                        if(self.manipulateData != null)
                            data = self.manipulateData(data, options.configuration.point);
                        
                        //Inform our listeners of this new data
                        for(var i=0; i<self.listeners.length; i++){
                            self.listeners[i].onLoad(data, options.configuration.point);
                        }
                    },error, {configuration: configuration});
                    
                    //TODO Form Chain with da - to ensure order of processing point configurations... 
                });
            });
            //Resolve the Deferred and start the Chain
            link.resolve();
            //Return the final promise that will be resolved when done
            return promise;
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
            this.registerPoint(dataPointConfiguration.point.xid); //Register for events
        },
        
        /**
         * Register a point with XID to a WebSocket
         * @param xid - String xid of point
         * @return socket
         */
        registerPoint: function(xid){
            
            //Don't allow registering for a data point More than once
            var socket = this.socketMap[xid];
            
            if(socket == null){
                var self = this;
                var socket = mangoRest.pointValues.registerForEvents(xid,
                        ['UPDATE'],
                        function(message){ //On Message Received Method
                           if(message.status == 'OK'){
                               self.pushData(message.payload.value, self);
                           }else{
                               self.error(message.payload.type + " - " + message.payload.message);
                           }
                        },function(error){ //On Error Method
                            self.error(error);
                        },function(){ //On Open Method
                            //document.getElementById('errors').innerHTML = '';
                        },function(){ //On Close Method
                            //document.getElementById('errors').innerHTML = '';
                        });
                this.socketMap[xid] = socket;
            }
            
            return socket; 
        },
        
        /**
         * Push Data to listeners
         * @param pvt - PointValueTime Model
         * @param realtimeDataProvider - provider who's listeners to use
         */
        pushData: function(pvt, realtimeDataProvider){
            var data = new Array();
            data.push(pvt); //Create an array of 1
            //Inform our listeners of this new data
            for(var x=0; x<this.pointConfigurations.length; x++){
                for(var i=0; i<realtimeDataProvider.listeners.length; i++){
                    realtimeDataProvider.listeners[i].onLoad(data, realtimeDataProvider.pointConfigurations[x].point);
                }
            }
        },
        
        /**
         * Put Point Value 
         * @param options {
         *                  refresh: boolean to refresh displays,
         *                  value: PointValueTime Model
         *                 }
         * 
         * @param error - function(jqXHR, textStatus, errorThrown, mangoMessage)
         * @return promise
         */
        put: function(options, error){
            
            //We will keep the requests in order by using a Deferred Chain
            var link = $.Deferred();
            var promise = link.promise();
            
            var self = this;
            $.each(this.pointConfigurations, function(i, configuration){
                //Form Chain
                promise = promise.then(function(){
                  //Define the options to use within the done callback
                var callbackOptions = {
                        refresh: options.refresh, //Refresh?
                        configuration: configuration, //Configuration to use
                        listeners: self.listeners //Listeners to fire
                }; 
                return mangoRest.pointValues.put(configuration.point.xid,
                            options.value,
                            function(pvt, xid, options){
    
                        if(options.refresh == true){
                            var data = new Array();
                            data.push(pvt);
                          //Inform our listeners of this new data
                            for(var i=0; i<options.listeners.length; i++){
                                options.listeners[i].onLoad(data, options.configuration.point);
                            }
                        }
                    },error, callbackOptions);                    
                });
            });
            //Resolve the Deferred and start the Chain
            link.resolve();
            //Return the final promise that will be resolved when done
            return promise;
        },
        
};

/**
 * Data Provider Listener
 * @param options
 * @returns
 */
DataProviderListener = function(options){
    for(var i in options) {
        this[i] = options[i];
    }
};

DataProviderListener.prototype = {
        
        /**
         * Called on load of data from provider
         */
        onLoad: function(data, dataPoint){
            
        },
        
        /**
         * Called when data provider asks to clear data
         */
        onClear: function(){
            
        }
};