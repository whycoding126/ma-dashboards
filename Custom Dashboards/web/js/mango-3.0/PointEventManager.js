/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', './api'], function($, MangoAPI) {
"use strict";

function PointEventManager(options) {
	 // keys are xid, value is object where key is event type and value is the number of subscriptions
    this.subscriptions = {};
    // keys are xid, value is array of event types
    this.activeSubscriptions = {};
    
    $.extend(this, options);
    
    if (!this.mangoApi) {
        this.mangoApi = MangoAPI.defaultApi;
    }
}

PointEventManager.prototype.getSocketPromise = function() {
    var self = this;
    
    if (self.socketPromise)
        return self.socketPromise;
    
    var deferred = $.Deferred();
    
    var socket = this.mangoApi.openSocket('/rest/v1/websocket/point-value');
    
    socket.onopen = function() {
        deferred.resolve(socket);
    };
    socket.onclose = function() {
        deferred.reject();
        delete self.socketPromise;
    };
    socket.onmessage = function(event) {
        var message = JSON.parse(event.data);
        self.messageReceived(message);
    };
    
    var promise = deferred.promise();
    self.socketPromise = promise;
    return promise;
};

PointEventManager.prototype.messageReceived = function(message) {
    if (message.status === 'OK') {
        var payload = message.payload;
        var xidSubscriptions = this.subscriptions[payload.xid];
        if (!xidSubscriptions)
            return;
        $(xidSubscriptions.eventEmitter).trigger(payload.event, payload);
        $(this).trigger(payload.xid, payload);
    }
};

PointEventManager.prototype.subscribe = function(xid, eventTypes, eventHandler) {
    if (!this.subscriptions[xid])
        this.subscriptions[xid] = {eventEmitter: {}};
    var xidSubscriptions = this.subscriptions[xid];
    
    if (!$.isArray(eventTypes)) eventTypes = [eventTypes];
    
    for (var i = 0; i < eventTypes.length; i++) {
    	var eventType = eventTypes[i];
        if (typeof eventHandler === 'function') {
            $(xidSubscriptions.eventEmitter).on(eventType, eventHandler);
        }
        
        if (!xidSubscriptions[eventType]) {
            xidSubscriptions[eventType] = 1;
        }
        else {
            xidSubscriptions[eventType] = xidSubscriptions[eventType] + 1;
        }
    }
    
    this.updateSubscriptions(xid);
};
    
PointEventManager.prototype.unsubscribe = function(xid, eventTypes, eventHandler) {
    var xidSubscriptions = this.subscriptions[xid];
    if (!xidSubscriptions)
        return;

    if (!$.isArray(eventTypes)) eventTypes = [eventTypes];
    
    for (var i = 0; i < eventTypes.length; i++) {
    	var eventType = eventTypes[i];
    	if (typeof eventHandler === 'function') {
            $(xidSubscriptions.eventEmitter).off(eventType, eventHandler);
    	}
    	
        var count = xidSubscriptions[eventType];
        if (count >= 1) {
            xidSubscriptions[eventType] = count - 1;
        }
    }
    
    this.updateSubscriptions(xid);
};

PointEventManager.prototype.updateSubscriptions = function(xid) {
    var xidSubscriptions = this.subscriptions[xid];
    if (!xidSubscriptions)
        return;
    
    var eventTypes = [];
    for (var key in xidSubscriptions) {
        if (key === 'eventEmitter')
            continue;
        
        if (xidSubscriptions[key] === 0) {
        	delete xidSubscriptions[key];
        } else {
        	eventTypes.push(key);
        }
    }
    eventTypes.sort();

    var activeSubs = this.activeSubscriptions[xid];
    
    // there are no subscriptions for any event types for this xid
    if (eventTypes.length === 0) {
        delete this.subscriptions[xid];
        delete this.activeSubscriptions[xid];
    }

    if (!activeSubs || !arraysEqual(activeSubs, eventTypes)) {
    	if (eventTypes.length)
    		this.activeSubscriptions[xid] = eventTypes;
    	
        var message = {};
        message.xid = xid;
        message.eventTypes = eventTypes;
        
        this.getSocketPromise().done(function(socket) {
            socket.send(JSON.stringify(message));
        });
    }
};

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

return PointEventManager;

});
