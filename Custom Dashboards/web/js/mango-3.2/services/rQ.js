/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
* @ngdoc service
* @name maServices.rQ
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
* @methodOf maServices.rQ
* @name REPLACE
*
* @description
* REPLACE
*
*/
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
