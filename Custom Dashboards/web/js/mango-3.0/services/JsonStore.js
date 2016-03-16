/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function JsonStoreFactory($resource) {

    var JsonStore = $resource('/rest/v1/json-data/:xid', {
    	xid: '@xid',
        name: '@name'
    }, {
    	save: {
            method: 'POST',
            transformRequest: function(data, headersGetter) {
            	return angular.toJson(data.jsonData);
            }
        }
    });

    return JsonStore;
}

JsonStoreFactory.$inject = ['$resource'];
return JsonStoreFactory;

}); // define
