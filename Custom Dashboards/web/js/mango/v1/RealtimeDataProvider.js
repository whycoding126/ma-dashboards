/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', './dataProvider', './mangoApi', './PointEventManager'],
function($, DataProvider, mangoRest, PointEventManager) {
"use strict";

//use a static PointEventManager which is shared between all RealtimeDataProviders
var pointEventManager = new PointEventManager();

var RealtimeDataProvider = DataProvider.extend({
    type: 'RealtimeDataProvider',
    eventType: 'CHANGE',
    
    init: function(id, options) {
        DataProvider.prototype.init.apply(this, arguments);
        this.eventHandler = this.eventHandler.bind(this);
    },

    /**
     * Clear out our pointConfigurations if required
     * 
     * Signal to all Listeners to clear ALL their data
     * 
     * @param clearConfigurations - boolean to clear pointConfigurations too
     */
    clear: function(clearConfigurations) {
        var self = this;

        if (clearConfigurations) {
            $.each(this.pointConfigurations, function(key, pointConfig) {
                var point = pointConfig.point;
                pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
            });
        }
        
        DataProvider.prototype.clear.apply(this, arguments);
    },

    needsToLoad: function(changedOptions) {
        // never need to reload as its continually updated
        if (this.previousOptions)
            return false;
        return true;
    },

    loadPoint: function(point, options) {
        return mangoRest.pointValues.getLatest(point.xid, 1);
    },

    disable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = pointConfig.point;
            pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.disable.apply(this, arguments);
    },

    enable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = pointConfig.point;
            pointEventManager.subscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.enable.apply(this, arguments);
    },

    /**
     * Add a data point configuration to our list
     */
    addDataPoint: function(dataPointConfiguration) {
        var ret = DataProvider.prototype.addDataPoint.apply(this, arguments);
        if (!ret)
            return ret;
        
        if (this.enabled) {
            var xid = dataPointConfiguration.point.xid;
            pointEventManager.subscribe(xid, this.eventType, this.eventHandler);
        }
    },

    eventHandler: function(event, xid, eventType, value) {
        if (eventType !== this.eventType)
            return;
        
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = pointConfig.point;
            if (point.xid === xid) {
                self.notifyListeners(value, point);
            }
        });
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

                    if(options.refresh){
                        var data = [];
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
    }
});

DataProvider.registerProvider(RealtimeDataProvider);
return RealtimeDataProvider;

});