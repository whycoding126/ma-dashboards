/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

define(['jquery', 'extend', 'moment-timezone'], function($, extend, moment) {
"use strict";

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
                toISOString(from) + "&to=" + toISOString(to);
            
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
        
        /**
         * Query the Events Table
         * 
         * @param query - Query Model:
         * { 
         *	offset: start position (can  be null)
         *	limit: limit results to this Number (can be null)
         *	query: {
         * 		attribute: String name
         * 		condition: See below
         *		}
         *  sort: {
         *  	attribute: String name
         *  	desc: true or false to order by descending
         *  }
         *  useOr: true or false to apply query conditions with OR or AND
         *  
         *  conditions:
         *  Conditions are all Strings.
         *  
         *  Javascript Regex: RegExp:^.*$
         *  Integer Compare: Int:=1, Int:>1, Int:>=1, Int:<1, Int:<=1
         *  Long Compare: Long:=1, Long:>1, Long:<1
         *  Long Range: LongRange:>startValue:<endValue
         *  Duration: Duration:>1:00:00, Duration:<1:00:00
         *  Boolean Compare: BooleanIs:true, BooleanIs:false
         *  Null Check: NullCheck:true, NullCheck:false
         * 
         * @return promise that will be resolved when done
         */
        queryEvents: function(query){
        	var url = "/rest/v1/events/query.json";
            var data = JSON.stringify(query);
            
            return this.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: data
            });
        },
        
        /**
         * Get Mango translations for use with the Globalize JS library
         * 
         * @param namespace - (optional) limits results to the given namespace, i.e. the part of the key
         * before the first period
         * @param language - (optional) returns translations for the given language, otherwise returns
         * the language specified by the browser or otherwise specified by the user
         * @returns object:
         *     { locale: "languageCode-countryCode",
         *       translations: {
         *         root: {
         *           "namespace.key": "translation"
         *         },
         *         "languageCode-countryCode": {
         *           "namespace.key": "translation"
         *         }
         *       }
         *     }
         */
        getTranslations: function(namespace, language) {
            var url = '/rest/v1/translations';
            
            if (typeof namespace !== 'undefined')
                url += '/' + encodeURIComponent(namespace);
            if (typeof language !== 'undefined')
                url += '?language=' + encodeURIComponent(language);
            
            return this.ajax({
                url: url
            });
        },
        
        defaultAjaxOptions: {
            dataType: 'json'
        },
        
        ajax: function(ajaxOptions) {
            ajaxOptions = $.extend({}, this.defaultAjaxOptions, ajaxOptions);
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
        },
        
        loadJson: function() {
            var promiseArray = [];
            for (var i = 0; i < arguments.length; i++) {
                promiseArray.push(this.ajax({
                    url: arguments[i],
                    dataType: 'json'
                }));
            }
            return MangoAPI.when(promiseArray);
        },
        
        /**
         * Sets up Globalize by retrieving translations from Mango
         * 
         * @param namespace... - zero or more namespace strings
         * @returns promise, resolved when Globalize is ready
         */
        setupGlobalize: function() {
            var promiseArray = [
                MangoAPI.requirePromise(['globalize', 'globalize/message', 'cldr/unresolved']),
                this.loadJson('/resources/cldr-data/supplemental/likelySubtags.json')
            ];
            
            for (var i = 0; i < arguments.length; i++) {
                promiseArray.push(this.getTranslations(arguments[i]));
            }
            
            return MangoAPI.when(promiseArray).then(MangoAPI.firstArrayArg)
                .then(function(Globalize, likelySubtags) {
                Globalize.load(likelySubtags);
                var locale = null;
                for (var i = 2; i < arguments.length; i++) {
                    Globalize.loadMessages(arguments[i].translations);
                    if (!locale)
                        locale = arguments[i].locale;
                }
                if (locale)
                    Globalize.locale(locale);
                
                return Globalize;
            });
        }
});

function toISOString(now) {
    return encodeURIComponent(moment(now).toISOString());
}

/**
 * The default MangoAPI instance - i.e. no baseUrl, but can be replaced
 */
MangoAPI.defaultApi = new MangoAPI();

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

MangoAPI.rejectedPromise = function() {
    var deferred = $.Deferred();
    return deferred.reject.apply(deferred, arguments).promise();
};

MangoAPI.resolvedPromise = function() {
    var deferred = $.Deferred();
    return deferred.resolve.apply(deferred, arguments).promise();
};

MangoAPI.requirePromise = function(dependencyArray) {
    var deferred = $.Deferred();
    
    require(dependencyArray, function() {
        deferred.resolve.apply(deferred, arguments);
    }, function() {
        deferred.reject.apply(deferred, arguments);
    });
    
    return deferred.promise();
};

MangoAPI.userLanguage = function() {
    return navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
};

MangoAPI.firstArrayArg = function() {
    var firstArgs = [];
    for (var i = 0; i < arguments.length; i++) {
        var argsI = arguments[i];
        if ($.isArray(argsI) && argsI.length > 0)
            firstArgs.push(argsI[0]);
        else
            firstArgs.push(argsI);
    }
    
    var deferred = $.Deferred();
    return deferred.resolve.apply(deferred, firstArgs).promise();
};

/**
 * Returns an array of all points contained in a folder and its subfolders.
 * Only the folder parameter is necessary
 */
MangoAPI.pointsInFolder = function(folder, path, points) {
    if (typeof path == 'undefined') {
        path = '';
    }
    
    if (path === '') {
        if (folder.name != 'root') {
            path = folder.name;
        }
    }
    else {
        path += '/' + folder.name;
    }
    
    if (typeof points == 'undefined') {
        points = [];
    }
    
    $.each(folder.points, function(id, point) {
        point.path = path;
        points.push(point);
    });
    
    $.each(folder.subfolders, function(id, subfolder) {
        MangoAPI.pointsInFolder(subfolder, path, points);
    });
    
    return points;
};

MangoAPI.folderPaths = function(folder, path, result) {
    if (typeof path === 'undefined')
        path = [];
    if (typeof result === 'undefined')
        result = {};

    if (folder.name != 'Root')
        path.push(folder.name);
    result[folder.id] = path.slice();
    
    for (var i in folder.subfolders) {
        MangoAPI.folderPaths(folder.subfolders[i], path, result);
        path.pop();
    }

    return result;
};

/**
 * Logs an error to the console
 */
MangoAPI.logError = function(jqXHR, textStatus, error, mangoMessage) {
    if (!console)
        return;
    
    var logLevel, message;
    switch(textStatus) {
    case 'notNeeded':
        // request cancelled as it wasn't needed
        return;
    case 'abort':
        message = "Mango API request was cancelled";
        logLevel = console.warn ? 'warn' : 'log';
        break;
    default:
        message = "Mango API request failed";
        if (textStatus)
            message += ", status=" + textStatus;
        if (error)
            message += ", error=" + error;
        logLevel = console.error ? 'error' : 'log';
        break;
    }

    if (jqXHR && jqXHR.url)
        message += ", url=" + jqXHR.url;
    if (mangoMessage)
        message += ", message=" + mangoMessage;
    console[logLevel](message);
};

/**
 * Retrieves a url parameter
 */
MangoAPI.urlParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[undefined,""])[1].replace(/\+/g, '%20'))||null;
};

return MangoAPI;

}); // close define