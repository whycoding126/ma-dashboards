/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function WatchListFactory($resource, Util, $q) {
    
    function watchListInterceptor(data) {
        angular.merge(data.resource, data.resource.jsonData);
        delete data.resource.jsonData;
        return data.resource;
    }

    var WatchList = $resource('/rest/v1/json-data/:xid', {
        xid: '@xid',
        name: '@name',
        readPermission: '@readPermission',
        editPermission: '@editPermission'
    }, {
        get: {
            interceptor: {
                response: watchListInterceptor
            }
        },
        save: {
            method: 'POST',
            interceptor: {
                response: watchListInterceptor
            },
            transformRequest: function(data, headersGetter) {
                return angular.toJson({
                    points: data.points,
                    params: data.params,
                    query: data.query,
                    type: data.type,
                    username: data.username
                });
            }
        },
        'delete': {
            method: 'DELETE',
            interceptor: {
                response: watchListInterceptor
            },
            transformResponse: function(data, headersGetter, status) {
                if (data && status < 400) {
                    var item = angular.fromJson(data);
                    item.jsonData = null;
                    return item;
                }
            }
        }
    });
    
    var queryFn = WatchList.query;
    WatchList.query = function() {
        return queryFn.apply(this, arguments).$promise.then(function(xids) {
            var requests = [];
            for (var i = 0; i < xids.length; i++) {
                if (xids[i].indexOf('wl_') === 0)
                    requests.push(this.get({xid: xids[i]}).$promise);
            }
            return $q.all(requests);
        }.bind(this));
    };

    return WatchList;
}

WatchListFactory.$inject = ['$resource', 'Util', '$q'];
return WatchListFactory;

}); // define
