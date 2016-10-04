/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

dataPointDetailsController.$inject = ['$scope','$stateParams', '$state', 'localStorageService', 'mdAdminSettings', 'PointHierarchy', 'DateBar'];
function dataPointDetailsController($scope, $stateParams, $state, localStorageService, mdAdminSettings, PointHierarchy, DateBar) {
    
    var $ctrl = this;
    $ctrl.dateBar = DateBar;
    var timezone = mdAdminSettings.user.getTimezone();
    var pointValueCell = angular.element('div.point-details').find('.point-value');
    var pointTimeCell = angular.element('div.point-details').find('.point-time');
    var timeoutID;
    var lastValue;
    
    $ctrl.pointValueChanged = function pointValueChanged(point) {
        // manually add and remove classes rather than using ng-class as point values can
        // change rapidly and result in huge slow downs / heaps of digest loops
        
        var now = (new Date()).valueOf();
        var format = now - point.time > 86400 ? 'l LTS' : 'LTS';
        $ctrl.pointTime = moment.tz(point.time, timezone).format(format);

        pointTimeCell.addClass('flash-on-change');
        if (point.value !== lastValue) {
            pointValueCell.addClass('flash-on-change');
        };
        lastValue = point.value;
        
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
        }

        timeoutID = setTimeout(function() {
            pointValueCell.removeClass('flash-on-change');
            pointTimeCell.removeClass('flash-on-change');
        }, 400);
    };
    
    $scope.$watch('myPoint.xid', function(newValue, oldValue) {
        if (newValue === undefined || newValue === oldValue) return;
        //console.log('New point selected:', newValue);
        $state.go('.', {pointXid: newValue}, {location: 'replace', notify: false});
        
        localStorageService.set('lastDataPointDetailsItem', {
            xid: newValue
        });
        
        PointHierarchy.pathByXid({xid: newValue}).$promise.then(function (data) {
            // console.log(data);
            $ctrl.path = data;
        },
        function(data) {
            console.log('PointHierarchy.pathByXid Error', data);
        });
        
        var pointType = $scope.myPoint.pointLocator.dataType;
        if (pointType==='BINARY' || pointType==='MULTISTATE' || pointType==='ALPHANUMERIC' ) {
            $ctrl.dateBar.rollupTypesFilter = {nonNumeric: true};
            $ctrl.dateBar.rollupType = 'NONE';
        }
        else {
            $ctrl.dateBar.rollupTypesFilter = {nonNumeric: false};
            $ctrl.dateBar.rollupType = 'AVERAGE';
        }
    });
    
    $ctrl.$onInit = function() {
        if ($stateParams.pointXid) {
            // console.log($stateParams.pointXid);
            $ctrl.pointXid = $stateParams.pointXid;
        }
        else {
            // Attempt load pointXid from local storage
            var storedPoint = localStorageService.get('lastDataPointDetailsItem');
            if (storedPoint) {
                $ctrl.pointXid = storedPoint.xid;
                //console.log('Loaded', storedPoint.xid, 'from LocalStorage');
            }
            
        }
    };
};

return {
    controller: dataPointDetailsController,
    templateUrl: require.toUrl('./dataPointDetails.html')
};

}); // define