/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'rql/query'], function(angular, query) {
'use strict';

WatchListFactory.$inject = ['$resource', 'Util', '$http', 'Point', 'PointHierarchy', '$q', '$interpolate', '$sce', '$parse'];
function WatchListFactory($resource, Util, $http, Point, PointHierarchy, $q, $interpolate, $sce, $parse) {

    var WatchList = $resource('/rest/v1/watch-lists/:xid', {
        xid: '@xid',
        originalXid: '@originalXid'
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
        },
        updateWithRename: {
            method: 'PUT',
            url: '/rest/v1/watch-lists/:originalXid'
        }
    });
    
    WatchList.objQuery = Util.objQuery;
    
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

    WatchList.prototype.$getPoints = function(params) {
        if (!this.points) {
            this.points = [];
        }
        
        if (this.type === 'static') {
            this.pointsPromise = $http({
                method: 'GET',
                url: '/rest/v1/watch-lists/' + encodeURIComponent(this.xid) +'/data-points',
                withCredentials: true,
                cache: false,
                transformResponse: Util.transformArrayResponse
            }).then(function(response) {
                if (response.status < 400) {
                    this.setPoints(response.data);
                }
                return this;
            }.bind(this))
        } else if (this.type === 'query') {
            var ptQuery = this.interpolateQuery(params);
            this.pointsPromise = Point.query({rqlQuery: ptQuery}).$promise.then(function(items) {
                this.setPoints(items);
                return this;
            }.bind(this));
        } else if (this.type === 'hierarchy') {
            var folderIds = this.folderIds;
            
            if (this.hierarchyFolders) {
                folderIds = [];
                for (var i = 0; i < this.hierarchyFolders.length; i++) {
                    folderIds.push(this.hierarchyFolders[i].id);
                }
            }
            
            if (!folderIds || !folderIds.length) {
                this.setPoints([]);
                return $q.when(this);
            }
            
            this.pointsPromise = PointHierarchy.getPointsForFolderIds(folderIds).then(function(points) {
                this.setPoints(points);
                return this;
            }.bind(this));
        } else {
            this.pointsPromise = $q.reject('unknown watchlist type');
        }
        
        return this.pointsPromise;
    };
    
    WatchList.prototype.interpolateQuery = function interpolateQuery(params) {
        params = params || {};
        var parsed = new query.Query(this.query);
        parsed.walk(function(name, args) {
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (typeof arg !== 'string' || arg.indexOf('{{') < 0) continue;
                
                var matches = /{{(.*?)}}/.exec(arg);
                if (matches && matches[0] === matches.input) {
                    var evaluated = $parse(matches[1])(params);
                    args[i] = angular.isUndefined(evaluated) ? '' : evaluated;
                } else {
                    args[i] = $interpolate(arg)(params, false, $sce.URL, false);
                }
            }
            
            if (name === 'in' && args.length > 1) {
                if (angular.isArray(args[1])) {
                    Array.prototype.splice.apply(args, [1, 1].concat(args[1]));
                } else if (typeof args[1] === 'string') {
                    Array.prototype.splice.apply(args, [1, 1].concat(args[1].split(',')));
                }
            }
        }.bind(this));
        return parsed.toString();
    };

    return WatchList;
}

return WatchListFactory;

}); // define
