/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery'], function($) {
"use strict";

var util = {};

/*
 * Returns an array of all points contained in a folder and its subfolders.
 * Only the folder parameter is necessary
 */
util.pointsInFolder = function(folder, path, points) {
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
        util.pointsInFolder(subfolder, path, points);
    });
    
    return points;
};

util.folderPaths = function(folder, path, result) {
    if (typeof path === 'undefined')
        path = [];
    if (typeof result === 'undefined')
        result = {};

    if (folder.name != 'Root')
        path.push(folder.name);
    result[folder.id] = path.slice();
    
    for (var i in folder.subfolders) {
        util.folderPaths(folder.subfolders[i], path, result);
        path.pop();
    }

    return result;
};

/*
 * Logs an error to the console
 */
util.logError = function(jqXHR, textStatus, error, mangoMessage) {
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

/*
 * Retrieves a url parameter
 */
util.getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[undefined,""])[1].replace(/\+/g, '%20'))||null;
};

return util;

}); // define
