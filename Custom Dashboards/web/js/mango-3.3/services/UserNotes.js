/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';
/**
* @ngdoc service
* @name maServices.UserNotes
*
* @description
* Provides a service for retrieving and adding user notes
* - Used by <a ui-sref="dashboard.docs.maDashboards.maUserNotesTable">`<ma-user-notes-table>`</a> 
*
*
*
*/


/**
* @ngdoc method
* @methodOf maServices.UserNotes
* @name UserNotes#get
*
* @description
* A default action provided by $resource. Makes a http GET call to the rest endpoint `/rest/v1/comments`
* @returns {array} Returns an Array of User Note objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.UserNotes
* @name UserNotes#save
*
* @description
* A default action provided by $resource. Makes a http POST call to the rest endpoint `/rest/v1/comments`
* @returns {array} Returns an Array of User Note objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.UserNotes
* @name UserNotes#remove
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/v1/comments`
* @returns {array} Returns an Array of User Note objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.UserNotes
* @name UserNotes#delete
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/v1/comments`
* @param {object} query Object for the query, can have a `contains` property for querying User Notes that contain the given string.
* @returns {array} Returns an Array of User Note objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/


/**
* @ngdoc method
* @methodOf maServices.UserNotes
* @name UserNotes#query
*
* @description
* A default action provided by $resource. Makes a http GET call to the rest endpoint `/rest/v1/comments`
* @param {object} query Object for the query, can have a `contains` property for querying User Notes that contain the given string.
* @returns {array} Returns an Array of User Note objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/



function UserNotesFactory($resource, Util) {
    var UserNotes = $resource('/rest/v1/comments', {}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: Util.transformArrayResponse,
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: true
        }
    });

    return UserNotes;
}

UserNotesFactory.$inject = ['$resource', 'Util'];
return UserNotesFactory;

}); // define
