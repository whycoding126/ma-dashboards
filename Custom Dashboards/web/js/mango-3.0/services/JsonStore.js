/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function JsonStoreFactory($resource, Util) {

    function setDataPathInterceptor(data) {
        var urlParts = data.config.url.split('/');
        data.resource.dataPath = urlParts.length >= 6 ? urlParts[5] : null;
        return data.resource;
    }
    
    var JsonStore = $resource('/rest/v1/json-data/:xid/:dataPath', {
    	xid: '@xid',
    	dataPath: '@dataPath',
        name: '@name',
        readPermission: '@readPermission',
        editPermission: '@editPermission'
    }, {
    	get: {
    	    interceptor: {
                response: setDataPathInterceptor
            },
    	},
        save: {
            method: 'POST',
            interceptor: {
                response: setDataPathInterceptor
            },
            transformRequest: function(data, headersGetter) {
            	return angular.toJson(data.jsonData);
            }
        },
        'delete': {
        	method: 'DELETE',
            interceptor: {
                response: setDataPathInterceptor
            },
        	transformResponse: function(data, headersGetter) {
            	var item = angular.fromJson(data);
            	item.jsonData = null;
            	return item;
            }
        }
    });

    return JsonStore;
}

JsonStoreFactory.$inject = ['$resource', 'Util'];
return JsonStoreFactory;

}); // define
