/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

function watchLists($injector) {
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
            noSelect: '=?',
            selectFirst: '=?'
        },
        controller: ['$scope', '$element', '$attrs', 'WatchList', '$stateParams', '$state', 'Point',
                     function ($scope, $element, $attrs, WatchList, $stateParams, $state, Point) {
            var xid = $stateParams.watchListXid || this.watchListXid;

            this.showSelect = !this.noSelect;
            if (this.showSelect) {
                this.queryPromise = WatchList.query().then(function(watchLists) {
                    if (xid) {
                        var found = false;
                        for (var i = 0; i < watchLists.length; i++) {
                            if (watchLists[i].xid === xid) {
                                found = true;
                                this.setWatchList(watchLists[i]);
                                break;
                            }
                        }
                        if (!found) {
                            WatchList.get({xid: xid}).$promise.then(function(watchList) {
                                this.setWatchList(watchList);
                            }.bind(this));
                        }
                    }
                    
                    this.watchLists = watchLists;
                    
                    if (!this.watchList && (angular.isUndefined(this.selectFirst) || this.selectFirst) && watchLists.length) {
                        this.setWatchList(watchLists[0]);
                    }
                    
                    return watchLists;
                }.bind(this));
            } else if (xid) {
                WatchList.get({xid: xid}).$promise.then(function(watchList) {
                    this.setWatchList(watchList);
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
                    var ptQuery = new query.Query({name: 'in', args: ['xid']});
                    for (var i = 0; i < watchList.points.length; i++) {
                        ptQuery.push(watchList.points[i].xid);
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

watchLists.$inject = ['$injector'];

return watchLists;

}); // define