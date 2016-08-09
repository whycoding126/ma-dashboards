/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
* @ngdoc service
* @name maServices.PointEventManager
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
* @methodOf maServices.PointEventManager
* @name REPLACE
*
* @description
* REPLACE
*
*/
function PointEventManagerFactory(EventManager) {
    return new EventManager({
    	url: '/rest/v1/websocket/point-value'
    });
}

PointEventManagerFactory.$inject = ['EventManager'];
return PointEventManagerFactory;

}); // define
