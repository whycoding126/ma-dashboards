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
                    done(data);
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
                    url : "/rest/v1/realtime/" + xid + ".json",
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
    
        
        

};