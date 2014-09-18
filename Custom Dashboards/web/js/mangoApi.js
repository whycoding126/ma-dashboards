/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * 
 * Mango Rest API Object
 */
var mangoRest = {

        /**
         * 
         * Login via PUT
         * done(jsonData, defaultUrl) callback with logged In UserModel
         * 
         * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
         * 
         */
        loginPut: function(username, password, done, fail) {
            $.ajax({
                type: "PUT",
                url : "/rest/v1/login/" + username + ".json?password=" + password,
                contentType: "application/json"
            }).done(function(data, status, jqXHR) {
                var defaultUrl = jqXHR.getResponseHeader("user-home-uri");
                done(data, defaultUrl);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var mangoMessage = jqXHR.getResponseHeader("errors");
                fail(jqXHR, textStatus, errorThrown, mangoMessage);
            });
        },
        
        /**
         * 
         * Login via POST
         * done(jsonData, defaultUrl) callback with logged In UserModel
         * 
         * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
         * 
         */
        loginPost: function(username, password, done, fail) {
            $.ajax({
                type: "POST",
                url : "/rest/v1/login/" + username + ".json?password=" + password,
                contentType: "application/json"
            }).done(function(data, status, jqXHR) {
                var defaultUrl = jqXHR.getResponseHeader("user-home-uri");
                done(data, defaultUrl);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var mangoMessage = jqXHR.getResponseHeader("errors");
                fail(jqXHR, textStatus, errorThrown, mangoMessage);
            });
        },
        
        /**
         * 
         * Logout via POST
         * done(jsonData) callback with logged Out UserModel
         * 
         * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
         * 
         */
        logoutPost: function(username, done, fail) {
            $.ajax({
                type: "POST",
                url : "/rest/v1/logout/" + username + ".json",
                contentType: "application/json"
            }).done(function(data, status, jqXHR) {
                done(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var mangoMessage = jqXHR.getResponseHeader("errors");
                fail(jqXHR, textStatus, errorThrown, mangoMessage);
            });
        },
        
        /**
         * Make a request for any JSON data
         */
        getJson: function(url, done, fail){
            $.ajax({
                type: "GET",
                url : url,
                contentType: "application/json"
            }).done(function(data, status, jqXHR) {
                done(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var mangoMessage = jqXHR.getResponseHeader("errors");
                fail(jqXHR, textStatus, errorThrown, mangoMessage);
            });
        },
        
        
        /**
         * Data Point access
         */
        dataPoints: {
            
            /**
             * 
             * Get All Data Points 
             * done(jsonData) callback with array of points as data
             * 
             * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            getAll: function(done, fail) {
                $.ajax({
                    url : "/rest/v1/dataPoints.json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * 
             * Get One Data Point
             * done(jsonData) callback one point as data
             * 
             * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            get: function(xid, done, fail) {
                $.ajax({
                    url : "/rest/v1/dataPoints/" + xid + ".json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    fail(jqXHR, textStatus, errorThrown);
                });
            },

            /**
             * 
             * Save Data Point
             * done(jsonData) callback with saved point as data
             * 
             * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            put: function(dataPoint, done, fail) {
                $.ajax({
                    type: "PUT",
                    url : "/rest/v1/dataPoints/" + dataPoint.xid + ".json",
                    contentType: "application/json",
                    data: JSON.stringify(dataPoint)
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
        },
    
        /**
         * Historical Point Values Access
         */
        pointValues: {
            
            /**
             * Create a new point value object
             */
            createNew: function(){
                //TODO setup new API Controller to create New objects
                
                return {
                    annotation: null,
                    dataType: null, //Fill from dataPoint.pointLocator.dataType,
                    value: null,
                    time: null};
                
            },
        
            /**
             * Get values based on date ranges with optional rollup
             * 
             * @param xid - for point desired
             * @param from - date from formatted using this.formatLocalDate
             * @param to - date to formatted using this.formatLocalDate
             * @param rollup - null or ['AVERAGE', 'MAXIMUM', 'MINIMUM', 'SUM', 'FIRST', 'LAST', 'COUNT']
             * @param timePeriodType - null or ['MILLISECONS', 'SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS']
             * @param timePeriods - null or integer number of periods to use
             * 
             * @param done(jsonData) callback with data in time order, oldest first
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            get: function(xid, from, to, rollup, timePeriodType, timePeriods, done, fail){
                //Create the parameter list
                var params = "";
                if(rollup != null)
                    params += "&rollup=" + rollup;
                if(timePeriodType != null)
                    params += "&timePeriodType=" + timePeriodType;
                if(timePeriods != null)
                    params += "&timePeriods=" + timePeriods;
                
                $.ajax({
                    url : "/rest/v1/pointValues/" + xid + ".json?from=" + from + "&to=" + to + params,
                }).done(function(data) {
                    done(data, xid);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * Get the latest limit number of values
             * 
             * @param xid - for point desired
             * @param limit - number of results
             * 
             * @param done(jsonData) callback with data in reverse order, most recent first the going backwards
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            getLatest: function(xid, limit, done, fail){
                $.ajax({
                    url : "/rest/v1/pointValues/" + xid + "/latest.json?limit=" + limit,
                    
                }).done(function(data) {
                    done(data, xid);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * Get the point statistics
             * 
             * @param xid - for point desired
             * @param from - date from formatted using this.formatLocalDate
             * @param to - date to formatted using this.formatLocalDate
             * @param done(jsonData) callback with statistics object as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            getStatistics: function(xid, from, to, done, fail){
                $.ajax({
                    url : "/rest/v1/pointValues/" + xid + "/statistics.json?from=" 
                    + from
                    + "&to=" + to,
                }).done(function(data) {
                    done(data, xid);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * 
             * Save Point Value
             * @param xid - for data point to save to
             * @param value - Number, boolean or String
             * @done(jsonData) callback with saved point as data
             * 
             * @fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             * 
             */
            put: function(xid, pointValue, done, fail){

                $.ajax({
                    type: "PUT",
                    url : "/rest/v1/pointValues/" + xid + ".json",
                    contentType: "application/json",
                    data: JSON.stringify(pointValue)
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
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
            registerForEvents: function(xid, events, onMessage, onError, onOpen, onClose){
                if ('WebSocket' in window){
                    var socket = new WebSocket('ws://localhost:8080/rest/v1/websocket/pointValue');
                    socket.onopen = function(){
                        //Register for recieving point values
                        // using a PointValueRegistrationModel
                        socket.send(JSON.stringify(
                                {'xid': xid,
                                 'eventTypes': events
                                }));
                        onOpen();
                     }
                     socket.onclose = onClose;
                     socket.onmessage = function(event){
                         onMessage(JSON.parse(event.data));
                     };
                    return socket;
                }else{
                    alert('Websockets not supported!');
                }
            },
            
            /**
             * Modify the existing events for a point on a socket
             * @param xid - xid of data point
             * @param events - ['INITIALIZE', 'UPDATE', 'CHANGE', 'SET', 'BACKDATE', 'TERMINATE']
             * @returns
             */
            modifyRegisteredEvents: function(socket, xid, events){
                socket.send(JSON.stringify(
                        {'xid': xid,
                         'eventTypes': events
                        }));
            }   
        },

     
        /**
         * Realtime Values Access
         */
        realtime: {
            /**
             * Get Current Value
             * 
             * @param xid - for point desired
             * 
             * @param done(jsonData) callback with current point value as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             */
            getCurrentValue: function(xid, done, fail){
                $.ajax({
                    url : "/rest/v1/realtime/byXid/" + xid + ".json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * Get All Current Values for running points
             * 
             * @param limit results too this
             * 
             * @param done(jsonData) callback with current point values as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             */
            getAll: function(limit, done, fail){
                $.ajax({
                    url : "/rest/v1/realtime.json?limit=" + limit,
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },

        },
        
        
        /**
         * Realtime Values Access
         */
        hierarchy: {
            /**
             * List Root 
             * 
             * 
             * @param done(jsonData) callback with root contents as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             */
            getRoot: function(done, fail){
                $.ajax({
                    url : "/rest/v1/hierarchy.json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * Get Contents of a given folder
             * 
             * @param name of folder
             * 
             * @param done(jsonData) callback with folder contents as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             */
            getFolderByName: function(name, done, fail){
                $.ajax({
                    url : "/rest/v1/hierarchy/byName/" + name + ".json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
            
            /**
             * Get Contents of a given folder
             * 
             * @param id of folder
             * 
             * @param done(jsonData) callback with folder contents as data
             * 
             * @param fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
             */
            getFolderById: function(id, done, fail){
                $.ajax({
                    url : "/rest/v1/hierarchy/byId/" + id + ".json",
                }).done(function(data) {
                    done(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    var mangoMessage = jqXHR.getResponseHeader("errors");
                    fail(jqXHR, textStatus, errorThrown, mangoMessage);
                });
            },
        }, 
        
        /**
         * 
         * Format the date for use as a REST API URL parameter
         * Jan 1 2014 at midnight
         * ie. 2014-01-01T00:00:00.000+10:00
         * 
         * @param now
         * @returns {String}
         */
        formatLocalDate: function(now) {
                tzo = -now.getTimezoneOffset(),
                dif = tzo >= 0 ? '+' : '-',
                pad = function(num) {
                    norm = Math.abs(Math.floor(num));
                    return (norm < 10 ? '0' : '') + norm;
                };
            return now.getFullYear() 
                + '-' + pad(now.getMonth()+1)
                + '-' + pad(now.getDate())
                + 'T' + pad(now.getHours())
                + ':' + pad(now.getMinutes()) 
                + ':' + pad(now.getSeconds())
                + '.' + "000"
                + dif + pad(tzo / 60) 
                + ':' + pad(tzo % 60);
        },
};
