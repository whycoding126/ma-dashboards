/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function WatchListFactory($resource, Util, $http, Point, PointHierarchy, $q) {

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
            cache: false
        },
        save: {
            method: 'POST',
            url: '/rest/v1/watch-lists/'
        },
        update: {
            method: 'PUT'
        }
    });
    
    WatchList.objQuery = function(options) {
        if (!options) return this.query();

        var params = [];
        if (typeof options.query === 'string' && options.query) {
            params.push(options.query);
        } else if (options.query) {
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

        return params.length ? this.query({rqlQuery: params.join('&')}) : this.query();
    };
    
    WatchList.prototype.setPoints = function(points) {
        this.points.length = points.length;
        this.points.$limit = points.$limit;
        this.points.$page = points.$page;
        this.points.$pages = points.$pages;
        this.points.$start = points.$start;
        this.points.$total = points.$total;
        
        for (var i = 0; i < points.length; i++) {
            var pt = points[i];
            if (!(pt instanceof Point)) {
                pt = angular.merge(new Point(), pt);
            }
            this.points[i] = pt;
        }
    };

    WatchList.prototype.$getPoints = function() {
        if (!this.points) {
            this.points = [];
        }
        
        if (this.type === 'static') {
            return $http({
                method: 'GET',
                url: '/rest/v1/watch-lists/' + encodeURIComponent(this.xid) +'/data-points',
                withCredentials: true,
                cache: false
            }).then(function(response) {
                if (response.status < 400) {
                    this.setPoints(response.data);
                }
                return this;
            }.bind(this))
        } else if (this.type === 'query') {
            return Point.query({rqlQuery: this.query}).$promise.then(function(items) {
                this.setPoints(items);
                return this;
            }.bind(this));
        } else if (this.type === 'hierarchy') {
            var foldersPromise;
            
            if (this.hierarchyFolders) {
                foldersPromise = $q.when(this.hierarchyFolders);
            } else {
                var folderIds = this.query ? this.query.split(',') : [];
                if (!folderIds.length) {
                    this.points = [];
                    return $q.when(this);
                }
                
                var requests = [];
                for (var i = 0; i < folderIds.length; i++) {
                    var request = PointHierarchy.get({id: parseInt(folderIds[i], 10), subfolders: false}).$promise;
                    requests.push(request);
                }
                foldersPromise = $q.all(requests);
            }
            
            return foldersPromise.then(function(folders) {
                var points = [];
                for (var i = 0; i < folders.length; i++) {
                    Array.prototype.splice.apply(points, [0,0].concat(folders[i].points));
                }
                var pointXids = [];
                for (i = 0; i < points.length; i++) {
                    pointXids.push(points[i].xid);
                }
                return Point.objQuery({query: 'in(xid,' + pointXids.join(',') + ')'}).$promise.then(function(points) {
                    this.setPoints(points);
                    return this;
                }.bind(this));
            }.bind(this));
        }
    };

    return WatchList;
}

WatchListFactory.$inject = ['$resource', 'Util', '$http', 'Point', 'PointHierarchy', '$q'];
return WatchListFactory;

}); // define
