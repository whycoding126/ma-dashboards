/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function mangoHttpInterceptorFactory(mangoBaseUrl, mangoDefaultTimeout, $q) {
    return {
    	request: function(config) {
    		if (config.url.indexOf('/') === 0) {
    			config.url = mangoBaseUrl + config.url;
    		}
    		if (!config.timeout) {
    			config.timeout = mangoDefaultTimeout;
    		}
    		return config;
    	}
    };
}

mangoHttpInterceptorFactory.$inject = ['mangoBaseUrl', 'mangoDefaultTimeout', '$q'];

return mangoHttpInterceptorFactory;

}); // define
