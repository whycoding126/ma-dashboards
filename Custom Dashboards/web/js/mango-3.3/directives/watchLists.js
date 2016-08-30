/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

function watchLists(WatchList, $stateParams, $injector, $state) {
    return {
        restrict: 'E',
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./watchLists-md.html');
            }
            return require.toUrl('./watchLists.html');
        },
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            points: '=?',
            watchList: '=?',
            watchListXid: '@',
            alwaysShowSelect: '=?',
            selectFirst: '=?'
        },
        controller: ['$scope', '$element', '$attrs', 'Point', function ($scope, $element, $attrs, Point, $q) {
            var xid = $stateParams.watchListXid || this.watchListXid;
            if (xid) {
                this.watchList = WatchList.get({xid: xid});
                this.watchList.$promise.then(function(watchList) {
                    this.setWatchList(watchList);
                }.bind(this));
            }
            if (!xid || this.alwaysShowSelect) {
                this.showSelect = true;
                this.queryPromise = WatchList.query().then(function(watchLists) {
                    this.watchLists = watchLists;
                    
                    if (!this.watchList && (angular.isUndefined(this.selectFirst) || this.selectFirst) && watchLists.length) {
                        this.setWatchList(watchLists[0]);
                    }
                    
                    return watchLists;
                }.bind(this));
            }
            
            this.onChange = function() {
                this.setWatchList(this.watchList);
            };
            
            this.onOpen = function() {
                return this.queryPromise;
            }
            
            this.setWatchList = function(watchList) {
                if (!watchList) return;
                this.watchList = watchList;
                
                this.points = [];
                if (watchList.type === 'static') {
                    var ptQuery = new query.Query({name: 'or', args: []});
                    for (var i = 0; i < watchList.points.length; i++) {
                        ptQuery.push(new query.Query({name: 'eq', args: ['xid', watchList.points[i].xid]}));
                    }
                    var rql = ptQuery.toString();
                    Point.objQuery({query: rql}).$promise.then(function(items) {
                        this.points = watchList.points = items;
                    }.bind(this));
                } else if (watchList.type === 'query') {
                    Point.objQuery({query: watchList.query.rql}).$promise.then(function(items) {
                        this.points = watchList.points = items;
                    }.bind(this));
                }
                
                $state.go('.', {watchListXid: this.watchList.xid}, {location: 'replace', notify: false});
            };
        }]
    };
}

watchLists.$inject = ['WatchList', '$stateParams', '$injector', '$state', 'Point', '$q'];

return watchLists;

}); // define
