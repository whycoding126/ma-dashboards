/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
* @ngdoc service
* @name maServices.JsonStoreEventManager
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
* @methodOf maServices.JsonStoreEventManager
* @name REPLACE
*
* @description
* REPLACE
*
*/
function JsonStoreEventManagerFactory(EventManager) {
    return new EventManager({
    	url: '/rest/v1/websocket/json-data'
    });
}

JsonStoreEventManagerFactory.$inject = ['EventManager'];
return JsonStoreEventManagerFactory;

}); // define
