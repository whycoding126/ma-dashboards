/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function errorInterceptorFactory($q, $rootScope) {
	
	$rootScope.errors = [];
	$rootScope.clearErrors = function() {
		$rootScope.errors = [];
	};
	
	return {
		responseError: function(rejection) {
    		var errorObj = {
				msg: rejection.status < 0 ? 'Connection Refused' : rejection.statusText,
				time: new Date(),
				url: rejection.config.url,
				error: rejection
    		};
    		
    		if ($rootScope.errors.length >= 10)
    			$rootScope.errors.pop();
    		$rootScope.errors.unshift(errorObj);
    		
    		return $q.reject(rejection);
    	}
    };
}

errorInterceptorFactory.$inject = ['$q', '$rootScope'];

return errorInterceptorFactory;

}); // define
