/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var dataPointDetailsController = function dataPointDetailsController($scope, $stateParams, $state, localStorageService, MD_ADMIN_SETTINGS, PointHierarchy) {
    
    var $ctrl = this;
    this.dateBar = MD_ADMIN_SETTINGS.dateBar;
    
    this.$onInit = function() {
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
        // console.log('Point Type:', pointType);
        if (pointType==='BINARY' || pointType==='MULTISTATE' || pointType==='ALPHANUMERIC' ) {
            $ctrl.dateBar.rollupType = 'NONE';
        }
    });
    
    
};

dataPointDetailsController.$inject = ['$scope','$stateParams', '$state', 'localStorageService', 'MD_ADMIN_SETTINGS', 'PointHierarchy'];

return {
    controller: dataPointDetailsController,
    templateUrl: require.toUrl('./dataPointDetails.html')
};

}); // define