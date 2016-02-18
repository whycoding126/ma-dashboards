/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'globalize', '../api', 'jquery'], function(angular, Globalize, MangoAPI, $) {
'use strict';

function translateFactory() {
	var api = MangoAPI.defaultApi;
    var translate = function(key, args) {
        if (!angular.isArray(args)) {
            args = Array.prototype.slice.call(arguments, 1);
        }
        
        var namespace = key.split('.')[0];
        return api.setupGlobalize(namespace).then(function() {
        	try {
        		return Globalize.messageFormatter(key).apply(Globalize, args);
        	} catch (e) {
        		return $.Deferred().reject(e);
        	}
        });
    };
    
    return translate;
}

return translateFactory;

}); // define
