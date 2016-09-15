/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

dataSourceScrollList.$inject = ['$injector'];
return dataSourceScrollList;

function dataSourceScrollList($injector) {
    var DEFAULT_SORT = ['name'];

    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            selectXid: '@',
            selectFirst: '<?',
            query: '<?',
            start: '<?',
            limit: '<?',
            sort: '<?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./dataSourceScrollList-md.html');
            }
            return require.toUrl('./dataSourceScrollList.html');
        },
        require: {
            'ngModelCtrl': 'ngModel'
        },
        controller: ['DataSource', '$state', '$stateParams', dataSourceScrollListController]
    };
    
    function dataSourceScrollListController(DataSource, $state, $stateParams) {
        this.$onInit = function() {
            this.ngModelCtrl.$render = this.render;
            
            var xid = $stateParams.dataSourceXid || this.selectXid;
            if (xid) {
                this.fetchingInitial = true;
                DataSource.get({xid: xid}).$promise.then(null, angular.noop).then(function(item) {
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
            return this.queryPromise = DataSource.objQuery({
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
            this.selected = item;
            this.setStateParam(item);
        }.bind(this);
        
        this.setStateParam = function(item) {
            if (this.fetchingInitial) return;
            $stateParams.dataSourceXid = item ? item.xid : null;
            $state.go('.', $stateParams, {location: 'replace', notify: false});
        };
    }
}

}); // define
