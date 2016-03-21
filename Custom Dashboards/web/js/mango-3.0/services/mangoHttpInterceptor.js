/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function isApiCall(config) {
	if (config.url.indexOf('/') === 0) {
		return true;
	}
}

function mangoHttpInterceptorFactory(mangoBaseUrl, mangoTimeout, mangoWatchdog, $q) {
    return {
    	request: function(config) {
    		if (isApiCall(config)) {
    			config.url = mangoBaseUrl + config.url;
    		}
    		if (!config.timeout) {
    			config.timeout = mangoTimeout;
    		}
    		return config;
    	},
    	response: function(response) {
    		if (isApiCall(response.config)) {
    			mangoWatchdog.reset();
    		}
    		return response;
    	}
    };
}

mangoHttpInterceptorFactory.$inject = ['mangoBaseUrl', 'mangoTimeout', 'mangoWatchdog', '$q'];

return mangoHttpInterceptorFactory;

}); // define
