/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

(function(factory) { // anonymous function
    // Support multiple module loading scenarios
    if (typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define(['jquery', 'extend', 'moment-timezone'], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        this.MangoAPI = factory(jQuery, extend, moment);
    }
}(function($, extend, moment) { // factory function

/**
 * 
 * Mango Rest API Object
 */
var MangoAPI = extend({
        constructor: function(options) {
            this.baseUrl = '';
            $.extend(this, options);
        },
        
        /**
         * Login via GET
         * 
         * @param username
         * @param password
         * @param logout - optional, logout existing user
         * @return promise that will be resolved when done
         */
        login: function(username, password, logout) {
            if (logout === undefined)
                logout = true;
            logout = logout ? true : false; // coerce to actual boolean
            
            return this.ajax({
                url : "/rest/v1/login/" + encodeURIComponent(username) + ".json",
                headers: {
                    password: password,
                    logout: logout
                }
            });
        },
        
        /**
         * Logout via GET
         * 
         * @return promise that will be resolved when done
         */
        logout: function() {
            return this.ajax({
                url : "/rest/v1/logout/"
            });
        },
        
        /**
         * Make a request for any JSON data
         * 
         * @param url
         * @return promise that will be resolved when done
         */
        getJson: function(url) {
            return this.ajax({
                url : url
            });
        },
            
        /**
         * Get All Data Points 
         * 
         * @return promise that will be resolved when done
         */
        getAllPoints: function() {
            return this.ajax({
                url: "/rest/v1/dataPoints.json"
            });
        },
        
        /**
         * Get One Data Point
         * 
         * @param xid
         * @return promise that will be resolved when done
         */
        getPoint: function(xid) {
            return this.ajax({
                url: "/rest/v1/dataPoints/" + encodeURIComponent(xid) + ".json"
            });
        },

        /**
         * Save Data Point
         * 
         * @param dataPoint - point to save
         * @return promise that will be resolved when done
         */
        putPoint: function(dataPoint) {
            return this.ajax({
                type: "PUT",
                url : "/rest/v1/dataPoints/" + encodeURIComponent(dataPoint.xid) + ".json",
                contentType: "application/json",
                data: JSON.stringify(dataPoint)
            });
        },
        
        /**
         * Save Data Point
         * 
         * @param xid - xid of point to save
         * @param csvData - point CSV data to save
         * @return promise that will be resolved when done
         */
        putCSVPoint: function(xid, csvData) {
            return this.ajax({
                type: "PUT",
                url : "/rest/v1/dataPoints/" + encodeURIComponent(xid) + ".csv",
                contentType: "text/csv",
                data: csvData
            });
        },

        /**
         * Get values based on date ranges with optional rollup
         * 
         * @param xid - for point desired
         * @param from - date from
         * @param to - date to
         * @param rollup - null or ['AVERAGE', 'MAXIMUM', 'MINIMUM', 'SUM', 'FIRST', 'LAST', 'COUNT']
         * @param timePeriodType - null or ['MILLISECONS', 'SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS']
         * @param timePeriods - null or integer number of periods to use
         * @param done - function(jsonData, xid, options) callback with data in time order, oldest first
         * @param fail - function(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
         * @param options - object to pass into done method along with data
         * @return promise that will be resolved when done
         */
        getValues: function(xid, from, to, rollup, timePeriodType, timePeriods) {
            //Create the parameter list
            var params = "";
            if(rollup)
                params += "&rollup=" + encodeURIComponent(rollup);
            if(timePeriodType)
                params += "&timePeriodType=" + encodeURIComponent(timePeriodType);
            if(timePeriods)
                params += "&timePeriods=" + encodeURIComponent(timePeriods);
            var url = "/rest/v1/pointValues/" + encodeURIComponent(xid) + ".json?from=" + toISOString(from) + "&to=" +
                toISOString(to) + params;
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get first and last point values for a date range
         * 
         * @param xid - for point desired
         * @param from - date from
         * @param to - date to
         */
        getFirstLastValues: function(xid, from, to) {
            var url = "/rest/v1/pointValues/" + encodeURIComponent(xid) + "/firstLast.json?from=" +
                toISOString(from) + "&to=" + toISOString(to);
            
            return this.ajax({
                url: url
            });
        },

        /**
         * Get the latest limit number of values
         * 
         * @param xid - for point desired
         * @param limit - number of results
         * @return promise after if (typeof done == 'function') done()
         */
        getLatestValues: function(xid, limit) {
            var url = "/rest/v1/pointValues/" + encodeURIComponent(xid) + "/latest.json?limit=" +
                encodeURIComponent(limit);
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get the point statistics
         * 
         * @param xid - for point desired
         * @param from - date from formatted using this.toISOString
         * @param to - date to formatted using this.toISOString
         * @return promise that will be resolved when done
         */
        getStatistics: function(xid, from, to) {
            var url = "/rest/v1/pointValues/" + encodeURIComponent(xid) + "/statistics.json?from=" +
                from + "&to=" + to;
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * 
         * Save Point Value
         * @param xid - for data point to save to
         * @param value - PointValueTimeModel Number, boolean or String
         * @return promise when done
         */
        putValue: function(xid, pointValue) {
            var url = "/rest/v1/pointValues/" + encodeURIComponent(xid) + ".json";
            var data = JSON.stringify(pointValue);
            
            return this.ajax({
                type: "PUT",
                url: url,
                contentType: "application/json",
                data: data
            });
        },
        
        /**
         * Register for point value events
         * @param xid - xid of data point
         * @param events - ['INITIALIZE', 'UPDATE', 'CHANGE', 'SET', 'BACKDATE', 'TERMINATE']
         * @param onMessage(message) - method to call on message received evt.data
         * @param onError(message) - method to call on error
         * @param onOpen - method to call on Socket 
         * @param onClose - method to call on Close
         * @returns webSocket
         */
        registerForEvents: function(xid, events, onMessage, onError, onOpen, onClose) {
            if ('WebSocket' in window) {
                var socket = new WebSocket('ws://' + document.location.host + '/rest/v1/websocket/pointValue');
                socket.onopen = function() {
                    //Register for recieving point values
                    // using a PointValueRegistrationModel
                    socket.send(JSON.stringify({
                        xid: xid,
                        eventTypes: events
                    }));
                    onOpen();
                };
                socket.onclose = onClose;
                socket.onmessage = function(event) {
                    onMessage(JSON.parse(event.data));
                };
                return socket;
            } else {
                alert('Websockets not supported!');
            }
        },
        
        /**
         * Modify the existing events for a point on a socket
         * @param xid - xid of data point
         * @param events - ['INITIALIZE', 'UPDATE', 'CHANGE', 'SET', 'BACKDATE', 'TERMINATE']
         * @returns
         */
        modifyRegisteredEvents: function(socket, xid, events) {
            socket.send(JSON.stringify({
                xid: xid,
                eventTypes: events
            }));
        },
        
        openSocket: function() {
            return new WebSocket('ws://' + document.location.host + '/rest/v1/websocket/pointValue');
        },

        /**
         * Get Current Value
         * 
         * @param xid - for point desired
         * @return promise that will be resolved when done
         */
        getCurrentValue: function(xid) {
            var url = "/rest/v1/realtime/byXid/" + encodeURIComponent(xid) + ".json";
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get All Current Values for running points
         * 
         * @param limit results too this
         * @return promise that will be resolved when done
         */
        getAllCurrentValues: function(limit) {
            var url = "/rest/v1/realtime.json?limit=" + encodeURIComponent(limit);
            
            return this.ajax({
                url: url
            });
        },
    
        /**
         * Returns the point hierarchy root folder
         * @return promise when done
         */
        getHierarchy: function() {
            var url = "/rest/v1/hierarchy.json";
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get Contents of a given folder
         * 
         * @param name of folder
         * @return promise that will be resolved when done
         */
        getFolderByName: function(name) {
            var url = "/rest/v1/hierarchy/byName/" + encodeURIComponent(name) + ".json";
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get Contents of a given folder
         * 
         * @param id of folder
         * @return promise that will be resolved when done
         */
        getFolderById: function(id) {
            var url = "/rest/v1/hierarchy/byId/" + encodeURIComponent(id) + ".json";
            
            return this.ajax({
                url: url
            });
        },
        
        /**
         * Get the current user
         * 
         * @return promise that will be resolved when done
         */
        getCurrentUser: function() {
            var url = "/rest/v1/users/current.json";
            
            return this.ajax({
                url: url
            });
        },
        
        ajax: function(ajaxOptions) {
            ajaxOptions.url = this.baseUrl + ajaxOptions.url;
            var deferred = $.Deferred();
            var ajax = $.ajax(ajaxOptions).done(function() {
                deferred.resolve.apply(deferred, arguments);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                jqXHR.url = this.url;
                var mangoMessage = jqXHR.getResponseHeader("errors");
                deferred.reject(jqXHR, textStatus, errorThrown, mangoMessage);
            });
            
            var promise = deferred.promise();
            MangoAPI.cancellable(promise, ajax.abort.bind(ajax));
            
            return promise;
        }
});

function toISOString(now) {
    return encodeURIComponent(moment(now).toISOString());
}

/**
 * Make a promise cancellable.
 * 
 * The cancel function should stop the action which the promise represents then
 * reject the deferred
 * 
 * @param promise
 * @param cancel - function to call to cancel the promise
 */
MangoAPI.cancellable = function(promise, cancel) {
    // assume promise.then has been replaced if cancel exists
    if (!promise.cancel) {
        promise.cancel = cancel;
        MangoAPI.replaceThen(promise);
    }
    
    return promise;
};

MangoAPI.replaceThen = function(promise) {
    var originalThen = promise.then;
    promise.then = function() {
        var newPromise = originalThen.apply(this, arguments);
        newPromise.cancel = this.cancel;
        MangoAPI.replaceThen(newPromise);
        return newPromise;
    };
};

/**
 * An extension of $.when that preserves the cancel method and cancels all the promises
 * when any individual promise fails
 * 
 * @param promises - array of promises
 */
MangoAPI.when = function(promises) {
    var cancelling = false;
    var promise = $.when.apply($, promises);
    
    // assume promise.then has been replaced
    if (!promise.cancel) {
        promise.cancel = function() {
            cancelling = true;
            for (var i in promises) {
                promises[i].cancel();
            }
        };
        
        // triggered when at least one promise has failed, ensure all other promises are cancelled
        promise.fail(function() {
            // prevents cancel from running twice as fail will be triggered when
            // the first promise is cancelled
            if (!cancelling) {
                this.cancel();
            }
        });
        
        MangoAPI.replaceThen(promise);
    }
    return promise;
};

MangoAPI.resolvedPromise = function() {
    var deferred = $.Deferred();
    return deferred.resolve.apply(deferred, arguments).promise();
};

return MangoAPI;

})); // close factory function and execute anonymous function
