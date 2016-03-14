/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function JsonStoreFactory($resource) {
    var JsonStore = $resource('/rest/v1/json-data/:key', {}, {
        save: {
            method: 'POST',
            transformResponse: function(data, fn, code) {
                if (code < 300) {
                    var obj = angular.fromJson(data);
                    return obj.jsonData;
                }
            }
        }
    });
    return JsonStore;
}

JsonStoreFactory.$inject = ['$resource'];
return JsonStoreFactory;

}); // define
