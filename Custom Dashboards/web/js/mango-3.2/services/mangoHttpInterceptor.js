/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
* @ngdoc service
* @name maServices.mangoHttpInterceptor
*
* @description
* REPLACE
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    REPLACE
* </pre>
*/

/**
* @ngdoc method
* @methodOf maServices.mangoHttpInterceptor
* @name REPLACE
*
* @description
* REPLACE
*
*/
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
