/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';
/**
* @ngdoc service
* @name maServices.Events
*
* @description
* Provides a service for retrieving and adding events
* - Used by <a ui-sref="dashboard.docs.maDashboards.maEventsTable">`<ma-events-table>`</a> 
*
*
*
*/


/**
* @ngdoc method
* @methodOf maServices.Events
* @name Events#get
*
* @description
* A default action provided by $resource. Makes a http GET call to the rest endpoint `/rest/v1/events`
* @returns {array} Returns an Array of event objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.Events
* @name Events#save
*
* @description
* A default action provided by $resource. Makes a http POST call to the rest endpoint `/rest/v1/events`
* @returns {array} Returns an Array of event objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.Events
* @name Events#remove
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/v1/events`
* @returns {array} Returns an Array of event objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/

/**
* @ngdoc method
* @methodOf maServices.Events
* @name Events#delete
*
* @description
* A default action provided by $resource. Makes a http DELETE call to the rest endpoint `/rest/v1/events`
* @param {object} query Object for the query, can have a `contains` property for querying events that contain the given string.
* @returns {array} Returns an Array of event objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/


/**
* @ngdoc method
* @methodOf maServices.Events
* @name Events#query
*
* @description
* A default action provided by $resource. Makes a http GET call to the rest endpoint `/rest/v1/events`
* @param {object} query Object for the query, can have a `contains` property for querying events that contain the given string.
* @returns {array} Returns an Array of event objects matching the query. Objects will be of the resource class and have resource actions available to them.
*
*/



function eventsFactory($resource, Util) {
    var events = $resource('/rest/v1/events', {
        id: '@id',
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: Util.transformArrayResponse,
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: true
        },
        rql: {
        	url: '/rest/v1/events?:query',
            method: 'GET',
            isArray: true,
            transformResponse: Util.transformArrayResponse,
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: true
        },
        acknowledge: {
            method: 'PUT',
            url: '/rest/v1/events/acknowledge/:id',
            withCredentials: true,
            cache: true
        },
        getActiveSummary: {
        	url: '/rest/v1/events/active-summary',
            method: 'GET',
            isArray: true,
            withCredentials: true,
            cache: true
        }
    });
    
    events.objQuery = function(options) {
        if (!options) return this.query();
        if (typeof options.query === 'string') {
            return this.rql({query: options.query});
        }

        var params = [];
        if (options.query) {
            var and = !!options.query.$and;
            var exact = !!options.query.$exact;
            delete options.query.$exact;
            delete options.query.$and;

            var parts = [];
            for (var key in options.query) {
                var val = options.query[key] || '';
                var comparison = '=';
                var autoLike = false;
                if (val.indexOf('=') < 0 && !exact) {
                    comparison += 'like=*';
                    autoLike = true;
                }
                parts.push(key + comparison + val + (autoLike ? '*': ''));
            }

            var queryPart;
            if (and || parts.length === 1) {
                queryPart = parts.join('&');
            } else {
                queryPart = 'or(' + parts.join(',') + ')';
            }
            params.push(queryPart);
        }

        if (options.sort) {
            var sort = options.sort;
            if (angular.isArray(sort)) {
                sort = sort.join(',');
            }
            params.push('sort(' + sort + ')');
        }

        if (options.limit) {
            var start = options.start || 0;
            params.push('limit(' + options.limit + ',' + start + ')');
        }
        
        if (options.alarmLevel && options.alarmLevel != '*') {
            params.push('alarmLevel=' + options.alarmLevel);
        }
        
        if (options.eventType && options.eventType != '*') {
            params.push('eventType=' + options.eventType);
        }
        
        if (options.pointId) {
            params.push('dataPointId=' + options.pointId);
        }
        
        if (options.eventId) {
            params.push('id=' + options.eventId);
        }
        
        if (options.activeStatus && options.activeStatus != '*') {
            if (options.activeStatus==='active') {
                params.push('active=true');
            }
            else if (options.activeStatus==='noRtn') {
                params.push('rtnApplicable=false');
            }
            else if (options.activeStatus==='normal') {
                params.push('active=false');
            }
        }
        
        if (options.acknowledged && options.acknowledged != '*') {
            if (options.acknowledged==='true') {
                params.push('acknowledged=true');
            }
            else if (options.acknowledged==='false') {
                params.push('acknowledged=false');
            }
        }
        
        if (options.from) {
            params.push('activeTimestamp=ge=' + options.from.valueOf());
        }
        if (options.to) {
            params.push('activeTimestamp=lt=' + options.to.valueOf());
        }

        return params.length ? this.rql({query: params.join('&')}) : this.query();
    }

    return events;
}

eventsFactory.$inject = ['$resource', 'Util'];
return eventsFactory;

}); // define
