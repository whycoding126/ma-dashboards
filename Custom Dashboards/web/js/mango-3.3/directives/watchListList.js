/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

watchListList.$inject = ['$injector'];
return watchListList;

function watchListList($injector) {
    var DEFAULT_SORT = ['name'];
    var UPDATE_TYPES = ['update'];

    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            selectXid: '@',
            selectFirst: '<?',
            showNewButton: '<?',
            query: '<?',
            start: '<?',
            limit: '<?',
            sort: '<?',
            user: '<?',
            newButtonClicked: '&',
            editButtonClicked: '&'
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
            this.ngModelCtrl.$render = this.render;
            
            var xid = $stateParams.watchListXid || this.selectXid;
            if (xid) {
                this.fetchingInitial = true;
                WatchList.get({xid: xid}).$promise.then(null, angular.noop).then(function(item) {
                    this.fetchingInitial = false;
                    this.setViewValue(item);
                }.bind(this));
            }
            
            this.doQuery().then(function(items) {
                this.items = items;
                if (!xid && (angular.isUndefined(this.selectFirst) || this.selectFirst) && items.length) {
                    this.setViewValue(items[0]);
                }
            }.bind(this));
        };
        
        this.$onChanges = function(changes) {
            if ((changes.query && !changes.query.isFirstChange()) ||
                    (changes.start && !changes.start.isFirstChange()) ||
                    (changes.limit && !changes.limit.isFirstChange()) ||
                    (changes.sort && !changes.sort.isFirstChange())) {
                this.doQuery();
            }
        };
        
        this.doQuery = function() {
            return this.queryPromise = WatchList.objQuery({
                query: this.query,
                start: this.start,
                limit: this.limit,
                sort: this.sort || DEFAULT_SORT
            }).$promise.then(function(items) {
                return this.items = items;
            }.bind(this));
        };
        
        this.setViewValue = function(item) {
            this.render(item);
            this.ngModelCtrl.$setViewValue(item);
        };
        
        this.render = function(item) {
            var sameXid = this.selected && item && this.selected.xid === item.xid;
            if (this.selected && !sameXid) {
                WatchListEventManager.unsubscribe(this.selected.xid, UPDATE_TYPES, this.updateHandler);
            }
            
            this.selected = item;
            this.setStateParam(item);
            
            if (this.selected) {
                this.selected.$getPoints();
                if (!sameXid) {
                    WatchListEventManager.smartSubscribe($scope, this.selected.xid, UPDATE_TYPES, this.updateHandler);
                }
            }
        }.bind(this);

        this.updateHandler = function updateHandler(event, update) {
            if (update.action === 'update') {
                var item = angular.merge(new WatchList(), update.object);
                this.setViewValue(item);
            }
        }.bind(this);
        
        this.setStateParam = function(item) {
            if (this.fetchingInitial) return;
            $stateParams.watchListXid = item ? item.xid : null;
            $state.go('.', $stateParams, {location: 'replace', notify: false});
        };
    }
}

}); // define
