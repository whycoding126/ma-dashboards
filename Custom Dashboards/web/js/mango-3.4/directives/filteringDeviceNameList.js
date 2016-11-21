/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maDeviceNameList
 * @restrict E
 * @description
 * `<ma-device-name-list ng-model="myDeviceName" data-source-xid="myDataSource.xid"></ma-device-name-list>`
 * - Displays a list of Mango device names in a drop down selector. The selected device name will be outputed to the variable specified by the `ng-model` attribute.
 * - In the example below a list a points is generated that have the specified device name.
 * - <a ui-sref="dashboard.examples.basics.dataSourceAndDeviceList">View Demo</a>
 *
 * @param {object} ng-model Variable to hold the selected device name.
 * @param {boolean=} auto-init Enables auto selecting of the first device name in the list. (Defaults to `true`)
 * @param {string=} data-source-xid If provided will filter device names to a specific data source by xid.
 * @param {string=} data-source-id If provided will filter device names to a specific data source by id.
 * @param {string=} contains If provided will filter device names to those containing the specified string. Capitalization sensitive. (eg: `'Meta'`)
 *
 * @usage
 * <md-input-container>
        <label>Device names for selected data source</label>
        <ma-device-name-list ng-model="myDeviceName" data-source-xid="myDataSource.xid"></ma-device-name-list>
    </md-input-container>

    <md-input-container>
        <label>Points for selected device name</label>
        <ma-point-list query="{deviceName: myDeviceName}" limit="100" ng-model="myPoint"></ma-point-list>
    </md-input-container>
 *
 */
filteringDeviceNameList.$inject = ['$injector', '$timeout', 'DeviceName'];
function filteringDeviceNameList($injector, $timeout, DeviceName) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngModelOptions: '<?',
            ngChange: '&?',
            // attributes that start with data- have the prefix stripped
            dataSourceId: '<?sourceId',
            dataSourceXid: '<?sourceXid',
            autoInit: '<?',
            labelText: '<'
        },
        templateUrl: require.toUrl('./filteringDeviceNameList.html'),
        replace: false,
        link: function($scope, $element, $attrs) {
            $scope.onChange = function() {
                $timeout($scope.ngChange, 0);
            };
            
            $scope.queryDeviceNames = function() {
                var queryResult;
                if (!angular.isUndefined($scope.dataSourceId)) {
                    queryResult = DeviceName.byDataSourceId({id: $scope.dataSourceId, contains: $scope.contains});
                } else if (!angular.isUndefined($scope.dataSourceXid)) {
                    queryResult = DeviceName.byDataSourceXid({xid: $scope.dataSourceXid, contains: $scope.contains});
                } else {
                    queryResult = DeviceName.query({contains: $scope.contains});
                }

                return queryResult.$promise.then(function(deviceNames) {
                    if (!$scope.ngModel && $scope.autoInit && deviceNames.length) {
                        $scope.ngModel = deviceNames[0];
                    }
                    return deviceNames;
                });
            };
            
            if ($scope.autoInit)
                $scope.queryDeviceNames();
        }
    };
}
return filteringDeviceNameList;

}); // define
