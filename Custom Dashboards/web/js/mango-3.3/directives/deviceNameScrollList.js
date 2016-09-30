/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

deviceNameScrollList.$inject = ['$injector'];
return deviceNameScrollList;

function deviceNameScrollList($injector) {
    var DEFAULT_SORT = ['name'];

    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        bindToController: true,
        scope: {
            selectFirst: '<?',
            // attributes that start with data- have the prefix stripped
            dataSourceId: '<?sourceId',
            dataSourceXid: '<?sourceXid',
            contains: '<?',
            start: '<?',
            limit: '<?',
            sort: '<?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./deviceNameScrollList-md.html');
            }
            return require.toUrl('./deviceNameScrollList.html');
        },
        require: {
            'ngModelCtrl': 'ngModel'
        },
        controller: ['DeviceName', '$state', '$stateParams', '$timeout', 'localStorageService', deviceNameScrollListController]
    };
    
    function deviceNameScrollListController(DeviceName, $state, $stateParams, $timeout, localStorageService) {
        this.$onInit = function() {
            this.ngModelCtrl.$render = this.render;
            
            var localStorageDeviceName = localStorageService.get('watchListPage') ? localStorageService.get('watchListPage').deviceName : null;
            
            var deviceName = $stateParams.deviceName || localStorageDeviceName;
            if (deviceName) {
                $timeout(function() {
                    this.setViewValue(deviceName);
                }.bind(this), 0);
            }
            
            this.doQuery().then(function(items) {
                if (deviceName) {
                    if (items.indexOf(deviceName) < 0) {
                        this.setViewValue(null);
                    }
                } else if ((angular.isUndefined(this.selectFirst) || this.selectFirst) && items.length) {
                    this.setViewValue(items[0]);
                }
            }.bind(this));
        };
        
        this.$onChanges = function(changes) {
            if ((changes.dataSourceId && !changes.dataSourceId.isFirstChange()) ||
                    (changes.dataSourceXid && !changes.dataSourceXid.isFirstChange()) ||
                    (changes.contains && !changes.contains.isFirstChange()) ||
                    (changes.start && !changes.start.isFirstChange()) ||
                    (changes.limit && !changes.limit.isFirstChange()) ||
                    (changes.sort && !changes.sort.isFirstChange())) {
                this.doQuery();
            }
        };
        
        this.doQuery = function() {
            var query;
            if (!angular.isUndefined(this.dataSourceId)) {
                query = DeviceName.byDataSourceId({id: this.dataSourceId, contains: this.contains});
            } else if (this.dataSourceXid) {
                query = DeviceName.byDataSourceXid({xid: this.dataSourceXid, contains: this.contains});
            } else {
                query = DeviceName.query({contains: this.contains});
            }
            
            return this.queryPromise = query.$promise.then(function(items) {
                items = items.sort();
                if (this.sort && this.sort.indexOf('-') === 0) {
                    items.reverse();
                }
                if (this.start || this.limit) {
                    var start = this.start || 0;
                    var end = this.limit ? start + this.limit : items.length - start + 1;
                    items = items.slice(start, end);
                }
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
            this.setLocalStorageParam(item);
        }.bind(this);
        
        this.setStateParam = function(item) {
            $stateParams.deviceName = item;
            $state.go('.', $stateParams, {location: 'replace', notify: false});
        };
        
        this.setLocalStorageParam = function(item) {
            var deviceName = item;
            
            if (deviceName != null) {
                localStorageService.set('watchListPage', {
                    deviceName: deviceName
                });
            }
        };
    }
}

}); // define
