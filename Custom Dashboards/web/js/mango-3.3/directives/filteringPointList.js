/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maFilteringPointList
 * @restrict E
 * @description
 * `<ma-filtering-point-list ng-model="myPoint"></ma-filtering-point-list>`
 * - Creates a self-filtering point list that allows you to select a data point by filtering on device names or point names that contain the text.
     Search results will update as you type.
 * - <a ui-sref="dashboard.examples.basics.pointList">View Demo</a>
 *
 * @param {object} ng-model Variable to hold the selected data point.
 * @param {number=} limit Limits the results in the list to a specified number of data points (200 defualt)
 * @param {boolean=} auto-init If set, enables auto selecting of the first data point in the list.
 * @param {string=} point-xid Used with `auto-init` to pre-select the specified point by xid. 
 * @param {string=} point-id Used with `auto-init` to pre-select the specified point by data point id. 
 
 *
 * @usage
 * <ma-filtering-point-list ng-model="myPoint"></ma-filtering-point-list>
 */
function pointList(Point, $filter, $injector, $parse, $timeout) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngChange: '@',
            limit: '=?',
            autoInit: '=?',
            pointXid: '@',
            pointId: '@'
            
        },
        templateUrl: require.toUrl('./filteringPointList.html'),
        link: function ($scope, $element, attrs) {
            if ($scope.autoInit) {
                if (!$scope.pointXid && !$scope.pointId) {
                    Point.rql({query: 'limit(1)'}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                else if ($scope.pointXid) {
                    Point.rql({query: 'xid='+$scope.pointXid}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                else if ($scope.pointId) {
                    Point.rql({query: 'id='+$scope.pointId}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                
            }

            var change = $parse(attrs.ngChange);
            $scope.changed = function() {
                $timeout(function() {
                    change($scope.$parent);
                }, 0);
            };
            
            $scope.storeItem = function(selectedItem) {
                if (selectedItem && selectedItem!=null) {
                    $scope.ngModel = selectedItem;
                }
            };
            
            $scope.validateText = function(searchText) {
                // console.log(searchText);
            };

            $scope.querySearch = function(queryStr) {
                //queryStr = queryStr || '';
                var query = queryStr ? 'or(name=like=*' + queryStr +'*,deviceName=like=*' + queryStr + '*)&' : '';
                if (attrs.query) {
                    query += attrs.query;
                } else {
                    query += 'sort(deviceName,name)&limit(' + ($scope.limit || 150) +')';
                }
                return Point.rql({
                    query: query
                }).$promise.then(null, function() {
                    return [];
                });
            };

            $scope.pointLabel = function(point) {
                return point.deviceName + ' - ' + point.name;
            };
        }
    };
}

pointList.$inject = ['Point', '$filter', '$injector', '$parse', '$timeout'];
return pointList;

}); // define
