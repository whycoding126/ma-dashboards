/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
* @ngdoc service
* @name maServices.WatchListEventManager
*
* @description
* Provides an <a ui-sref="dashboard.docs.maServices.EventManager">EventManager</a> factory pointing to the point-value websocket endpoint at `'/rest/v1/websocket/watch-list'`
* - All methods available to <a ui-sref="dashboard.docs.maServices.EventManager">EventManager</a> are available.
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    watchListEventManager.subscribe(xid, SUBSCRIPTION_TYPES, websocketHandler);
* </pre>
*/
function WatchListEventManagerFactory(EventManager) {
    return new EventManager({
    	url: '/rest/v1/websocket/watch-lists'
    });
}

WatchListEventManagerFactory.$inject = ['EventManager'];
return WatchListEventManagerFactory;

}); // define
