/**
 * Data Provider for RealTime Updates Via Web Sockets
 * 
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @exports mango/RealtimeDataProvider
 * @module {RealtimeDataProvider} mango/RealtimeDataProvider
 * @augments DataProvider
 */
define(['jquery', './dataProvider', './PointEventManager'],
function($, DataProvider, PointEventManager) {
"use strict";

//use a static PointEventManager which is shared between all RealtimeDataProviders
var pointEventManager = new PointEventManager();


var RealtimeDataProvider = DataProvider.extend({
	
	/** @member {string} [type='RealtimeDataProvider'] - type of data provider*/
    type: 'RealtimeDataProvider',
    /** @member {string} [eventType='Update'] - What events do we register for*/
    eventType: 'UPDATE',
    /** @member {number} [numInitialValues='1'] - Number of initial values to request at start*/
    numInitialValues: 1,
    
    /**
     * @constructs RealtimeDataProvider
     * @augments DataProvider
     * @param {string|number} id - ID for provider
     * @param {Object} options - options for provider
     */
    constructor: function(id, options) {
        DataProvider.apply(this, arguments);
        this.eventHandler = this.eventHandler.bind(this);
    },

    /**
     * Clear out our pointConfigurations if required
     * 
     * Signal to all Listeners to clear ALL their data
     * 
     * @param {boolean} clearConfigurations - boolean to clear pointConfigurations too
     */
    clear: function(clearConfigurations) {
        var self = this;

        if (clearConfigurations) {
            $.each(this.pointConfigurations, function(key, pointConfig) {
                var point = self.toPoint(pointConfig);
                pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
            });
        }
        
        DataProvider.prototype.clear.apply(this, arguments);
    },

    /**
     * This provider never needs to reload as its continually updated
     * @param {?Object} changedOptions
     * @returns {boolean} 
     */
    needsToLoad: function(changedOptions) {
        // never need to reload as its continually updated
        if (this.previousOptions)
            return false;
        return true;
    },

    /**
     * @param {Object} point - point to load with xid member
     * @param {Object} options - options {from: from date, to: to date}
     * @returns {Object} Statistics Object
     */
    loadPoint: function(point, options) {
        return this.mangoApi.getLatestValues(point.xid, this.numInitialValues, this.apiOptions);
    },
    
    /**
     * Disable the data provider by unsubscribing for events
     * on the Web Socket
     */
    disable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.disable.apply(this, arguments);
    },

    /**
     * Enable the data provider by subscribing for events 
     * on the WebSocket
     */
    enable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            pointEventManager.subscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.enable.apply(this, arguments);
    },

    /**
     * Add a data point configuration to our list
     * @param {Object} dataPointConfiguration - configuration to add
     */
    addDataPoint: function(dataPointConfiguration) {
        var ret = DataProvider.prototype.addDataPoint.apply(this, arguments);
        if (!ret)
            return ret;
        
        if (this.enabled) {
            var point = this.toPoint(dataPointConfiguration);
            var xid = point.xid;
            try {
                pointEventManager.subscribe(xid, this.eventType, this.eventHandler);
            }
            catch (e) {
                // fail silently if WebSocket not supported
            }
        }
    },

    /**
     * Handle the Events
     * @param {Object} event
     * @param {Object} payload
     */
    eventHandler: function(event, payload) {
        if (payload.event !== this.eventType)
            return;
        
        var value = $.extend({}, payload.value);
        
        value.originalValue = value.value;
        value.renderedValue = payload.renderedValue;
        value.convertedValue = payload.convertedValue;
        
        if (this.apiOptions.rendered)
            value.value = value.renderedValue;
        else if (this.apiOptions.converted)
            value.value = value.convertedValue;
        
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            if (point.xid === payload.xid) {
                self.notifyListeners(value, point);
            }
        });
    }
});

DataProvider.registerProvider(RealtimeDataProvider);
return RealtimeDataProvider;

});