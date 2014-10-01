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
         * 
         * @param error - method to call on error
         */
        load: function(error){
            this.error = error;
            return; //We don't have load logic as we push data
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
            

        },
        
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