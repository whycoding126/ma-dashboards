/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function rqFactory($q, require) {
    function rQ(deps, success, fail) {
        var defer = $q.defer();
        require(deps, function() {
            var result = typeof success === 'function' ? success.apply(null, arguments) : success;
            defer.resolve(result);
        }, function() {
            var result = typeof fail === 'function' ? fail.apply(null, arguments) : fail;
            defer.reject(result);
        });
        return defer.promise;
    }
    
	return rQ;
}

rqFactory.$inject = ['$q', 'require'];

return rqFactory;

}); // define
