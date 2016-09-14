/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

watchListList.$inject = ['$injector'];
return watchListList;

function watchListList($injector) {
    var UPDATE_TYPES = ['update'];

    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            watchListXid: '@',
            selectFirst: '<?',
            showNewButton: '<?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./watchListList-md.html');
            }
            return require.toUrl('./watchListList.html');
        },
        require: {
            'ngModelCtrl': 'ngModel'
        },
        controller: ['$scope', 'WatchList', '$stateParams', '$state', 'WatchListEventManager',
                     watchListListController]
    };
    
    function watchListListController($scope, WatchList, $stateParams, $state, WatchListEventManager) {
        this.$onInit = function() {
            this.ngModelCtrl.$render = this.setWatchList;
            
            var xid = $stateParams.watchListXid || this.watchListXid;
            if (xid) {
                WatchList.get({xid: xid}).$promise.then(function(watchList) {
                    this.setViewValue(watchList);
                }.bind(this));
            }
            
            this.queryPromise = WatchList.query({rqlQuery: 'sort(name)'}).$promise.then(function(watchLists) {
                this.watchLists = watchLists;
                if (!xid && (angular.isUndefined(this.selectFirst) || this.selectFirst) && watchLists.length) {
                    this.setViewValue(watchLists[0]);
                }
                return watchLists;
            }.bind(this));
        };

        this.setViewValue = function(watchList) {
            this.setWatchList(watchList);
            this.ngModelCtrl.$setViewValue(watchList);
        };
        
        this.setWatchList = function(watchList) {
            if (this.watchList) {
                WatchListEventManager.unsubscribe(this.watchList.xid, UPDATE_TYPES, this.updateHandler);
            }
            
            this.watchList = watchList;
            
            if (!watchList) {
                $state.go('.', {watchListXid: null}, {location: 'replace', notify: false});
                return;
            }
            
            $state.go('.', {watchListXid: watchList.xid}, {location: 'replace', notify: false});
            
            watchList.$getPoints().then(function(watchList) {
                WatchListEventManager.smartSubscribe($scope, this.watchList.xid, UPDATE_TYPES, this.updateHandler);
            }.bind(this));
        }.bind(this);
        
        this.updateHandler = function updateHandler(event, update) {
            if (update.action === 'update') {
                var wl = angular.merge(new WatchList(), update.object);
                this.setViewValue(wl);
            }
        }.bind(this);
    }
}

}); // define
