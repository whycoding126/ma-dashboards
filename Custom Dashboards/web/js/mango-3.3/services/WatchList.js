/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function WatchListFactory($resource, Util, $http, Point) {

    var WatchList = $resource('/rest/v1/watch-lists/:xid', {
        xid: '@xid'
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
        save: {
            method: 'PUT'
        }
    });

    WatchList.prototype.$getPoints = function() {
        return $http({
            method: 'GET',
            url: '/rest/v1/watch-lists/' + encodeURIComponent(this.xid) +'/data-points',
            withCredentials: true,
            cache: false
        }).then(function(response) {
            if (response.status < 400) {
                var points = response.data;
                for (var i = 0; i < points.length; i++) {
                    points[i] = angular.merge(new Point(), points[i]);
                }
                this.points = points;
            }
            return this;
        }.bind(this))
    };

    return WatchList;
}

WatchListFactory.$inject = ['$resource', 'Util', '$http', 'Point'];
return WatchListFactory;

}); // define
