/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', 'extend'], function($, extend) {
"use strict";

var PointEventManager = extend({
    socketPromise: null,
    subscriptions: null,
    
    constructor: function() {
        this.subscriptions = {};
    },
    
    getSocketPromise: function() {
        var self = this;
        
        if (self.socketPromise)
            return self.socketPromise;
        
        var deferred = $.Deferred();
        var socket = new WebSocket('ws://' + document.location.host + '/rest/v1/websocket/pointValue');
        
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
    },
    
    messageReceived: function(message) {
        if (message.status === 'OK') {
            var payload = message.payload;
            var xidSubscriptions = this.subscriptions[payload.xid];
            if (!xidSubscriptions)
                return;
            $(xidSubscriptions.eventEmitter).trigger(payload.event, [payload.xid, payload.event, payload.value]);
            $(this).trigger(payload.xid, [payload.xid, payload.event, payload.value]);
        }
    },
    
    subscribe: function(xid, eventType, eventHandler) {
        if (!this.subscriptions[xid])
            this.subscriptions[xid] = {eventEmitter: {}};
        var xidSubscriptions = this.subscriptions[xid];
        
        if (typeof eventHandler === 'function')
            $(xidSubscriptions.eventEmitter).on(eventType, eventHandler);
        
        if (!xidSubscriptions[eventType]) {
            xidSubscriptions[eventType] = 1;
            this.updateSubscriptions(xid);
        }
        else {
            xidSubscriptions[eventType] = xidSubscriptions[eventType] + 1;
        }
    },
    
    unsubscribe: function(xid, eventType, eventHandler) {
        var xidSubscriptions = this.subscriptions[xid];
        if (!xidSubscriptions)
            return;
        
        if (typeof eventHandler === 'function')
            $(xidSubscriptions.eventEmitter).off(eventType, eventHandler);
        
        var count = xidSubscriptions[eventType];
        if (!count)
            return;
        
        if (count > 1) {
            xidSubscriptions[eventType] = count - 1;
            return;
        }
        
        // count is 1, i.e. we are removing the last subscription for this event type
        delete xidSubscriptions[eventType];
        this.updateSubscriptions(xid);
    },
    
    updateSubscriptions: function(xid) {
        var xidSubscriptions = this.subscriptions[xid];
        if (!xidSubscriptions)
            return;
        
        var eventTypes = [];
        for (var key in xidSubscriptions) {
            if (key === 'eventEmitter')
                continue;
            eventTypes.push(key);
        }
        
        // there are no subscriptions for any event types for this xid
        if (eventTypes.length === 0)
            delete this.subscriptions[xid];
        
        var message = {};
        message.xid = xid;
        message.eventTypes = eventTypes;
        
        this.getSocketPromise().done(function(socket) {
            socket.send(JSON.stringify(message));
        });
    }
});

return PointEventManager;

});
