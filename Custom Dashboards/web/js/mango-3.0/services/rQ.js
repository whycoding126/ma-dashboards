/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function rqFactory($q, require) {
    function rQ(deps) {
        var defer = $q.defer();
        require(deps, function() {
            defer.resolve(Array.prototype.slice.call(arguments));
        }, function() {
            defer.reject(Array.prototype.slice.call(arguments));
        });
        return defer.promise;
    }
    
	return rQ;
}

rqFactory.$inject = ['$q', 'require'];

return rqFactory;

}); // define
