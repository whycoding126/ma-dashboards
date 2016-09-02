/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

function watchLists($injector) {
    var UPDATE_TYPES = ['update'];
    
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
        controller: ['$scope', '$element', '$attrs', 'WatchList', '$stateParams', '$state', 'Point', 'WatchListEventManager',
                     function ($scope, $element, $attrs, WatchList, $stateParams, $state, Point, WatchListEventManager) {
            var xid = $stateParams.watchListXid || this.watchListXid;

            this.showSelect = !this.noSelect;
            if (this.showSelect) {
                this.queryPromise = WatchList.query({rqlQuery: 'sort(name)'}).$promise.then(function(watchLists) {
                    this.watchLists = watchLists;
                    
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
                    } else if ((angular.isUndefined(this.selectFirst) || this.selectFirst) && watchLists.length) {
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
                if (this.watchList) {
                    WatchListEventManager.unsubscribe(this.watchList.xid, UPDATE_TYPES, this.updateHandler);
                }
                
                if (!watchList) return;
                
                $state.go('.', {watchListXid: watchList.xid}, {location: 'replace', notify: false});
                
                this.watchList = null;
                this.points = [];
                
                watchList.$getPoints().then(function(watchList) {
                    this.watchList = watchList;
                    this.points = watchList.points;
                    WatchListEventManager.smartSubscribe($scope, this.watchList.xid, UPDATE_TYPES, this.updateHandler);
                }.bind(this));
            };
            
            this.updateHandler = function updateHandler(event, update) {
                if (update.action === 'update') {
                    var wl = angular.merge(new WatchList(), update.object);
                    wl.$getPoints().then(function(watchList) {
                        this.watchList = watchList;
                        this.points = watchList.points;
                    }.bind(this));
                }
            }.bind(this);
        }]
    };
}

watchLists.$inject = ['$injector'];

return watchLists;

}); // define
