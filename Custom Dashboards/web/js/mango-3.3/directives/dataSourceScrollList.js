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
                DataSource.get({xid: xid}).$promise.then(function(item) {
                    this.setViewValue(item);
                }.bind(this));
            }
            
            this.queryPromise = DataSource.query({rqlQuery: 'sort(name)'}).$promise.then(function(items) {
                this.items = items;
                if (!xid && (angular.isUndefined(this.selectFirst) || this.selectFirst) && items.length) {
                    this.setViewValue(items[0]);
                }
                return items;
            }.bind(this));
        };
        
        this.setViewValue = function(item) {
            this.render(item);
            this.ngModelCtrl.$setViewValue(item);
        };
        
        this.render = function(item) {
            this.selected = item;
            $state.go('.', {dataSourceXid: item ? item.xid : null},
                    {location: 'replace', notify: false});
        }.bind(this);
    }
}

}); // define
