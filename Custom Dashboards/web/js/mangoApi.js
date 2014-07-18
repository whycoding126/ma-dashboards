/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */


/**
 * 
 * Mango Rest API Object
 */
var mangoRest = {
        
        dataPoints: {
            
            /**
             * 
             * Get All Data Points 
             * done(jsonData) callback with data
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
             * Get One Data Points
             * done(jsonData) callback with data
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
             * Get One Data Points
             * done(jsonData) callback with data
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
            
            /**
             * Get Current Value
             * 
             * done(jsonData) callback with data
             * 
             * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
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
             * Get the latest limit number of values
             * done(jsonData) callback with data
             * 
             * fail(jqXHR, textStatus, errorThrown, mangoMessage) on failure callback
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


        },

    

    

};