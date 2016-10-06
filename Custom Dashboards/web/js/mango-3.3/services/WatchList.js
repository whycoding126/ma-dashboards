/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'rql/query'], function(angular, query) {
'use strict';

WatchListFactory.$inject = ['$resource', 'Util', '$http', 'Point', 'PointHierarchy', '$q', '$interpolate', '$sce', '$parse'];
function WatchListFactory($resource, Util, $http, Point, PointHierarchy, $q, $interpolate, $sce, $parse) {
    
    function jsonDataToProperties(data, headersGetter, status) {
        if (!angular.isObject(data)) return data;
        
        var isArray = angular.isArray(data);
        if (!isArray)
            data = [data];
        
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.type === 'query') {
                item.query = item.jsonData ? item.jsonData.query : '';
                item.params = item.jsonData && item.jsonData.params || [];
            }
            if (item.type === 'hierarchy') {
                item.folderIds = item.jsonData ? item.jsonData.folderIds : [];
            }
            delete item.jsonData;
        }
        
        return isArray ? data : data[0];
    }
    
    function propertiesToJsonData(data, headersGetter) {
        data.jsonData = {};
        if (data.type === 'query') {
            data.jsonData.query = data.query;
            data.jsonData.params = data.params;
            delete data.query;
            delete data.params;
        }
        if (data.type === 'hierarchy') {
            data.jsonData.folderIds = data.folderIds;
            delete data.folderIds;
        }
        return angular.toJson(data);
    }
    
    var transformWatchListResponse = $http.defaults.transformResponse.concat(jsonDataToProperties);

    var WatchList = $resource('/rest/v1/watch-lists/:xid', {
        xid: '@xid'
    }, {
        get: {
            method: 'GET',
            transformResponse: transformWatchListResponse
        },
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: [Util.transformArrayResponse, jsonDataToProperties],
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: false
        },
        save: {
            method: 'POST',
            url: '/rest/v1/watch-lists/',
            transformRequest: propertiesToJsonData,
            transformResponse: transformWatchListResponse
        },
        update: {
            method: 'PUT',
            transformRequest: propertiesToJsonData,
            transformResponse: transformWatchListResponse
        },
        'delete': {
            method: 'DELETE',
            transformResponse: transformWatchListResponse
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
            return $http({
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
            var query = this.interpolateQuery(params);
            return Point.query({rqlQuery: query}).$promise.then(function(items) {
                this.setPoints(items);
                return this;
            }.bind(this));
        } else if (this.type === 'hierarchy') {
            var foldersPromise;
            
            if (this.hierarchyFolders) {
                foldersPromise = $q.when(this.hierarchyFolders);
            } else {
                if (!this.folderIds || !this.folderIds.length) {
                    this.points = [];
                    return $q.when(this);
                }
                
                var requests = [];
                for (var i = 0; i < this.folderIds.length; i++) {
                    var request = PointHierarchy.get({id: this.folderIds[i], subfolders: false}).$promise;
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
            
            if (name === 'in' && args.length > 1 && angular.isArray(args[1])) {
                Array.prototype.splice.apply(args, [1, 1].concat(args[1]));
            }
        }.bind(this));
        return parsed.toString();
    };
    
    WatchList.toWatchList = function toWatchList(item) {
        return jsonDataToProperties(angular.merge(new WatchList(), item));
    };

    return WatchList;
}

return WatchListFactory;

}); // define
