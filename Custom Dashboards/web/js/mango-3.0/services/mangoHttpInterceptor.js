/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function mangoHttpInterceptorFactory(mangoBaseUrl) {
    return {
    	request: function(config) {
    		if (config.url.indexOf('/') === 0) {
    			config.url = mangoBaseUrl + config.url;
    		}
    		return config;
    	}
    };
}

mangoHttpInterceptorFactory.$inject = ['mangoBaseUrl'];

return mangoHttpInterceptorFactory;

}); // define
