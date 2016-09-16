/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var dataPointDetailsController = function dataPointDetailsController($scope, $stateParams, $state, localStorageService, MD_ADMIN_SETTINGS) {
    
    var $this = this;
    this.dateBar = MD_ADMIN_SETTINGS.dateBar;
    
    this.$onInit = function() {
        if ($stateParams.pointXid) {
            // console.log($stateParams.pointXid);
            $this.pointXid = $stateParams.pointXid;
        }
        else {
            // Attempt load pointXid from local storage
            var storedPoint = localStorageService.get('lastDataPointDetailsItem');
            if (storedPoint) {
                $this.pointXid = storedPoint.xid;
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
    });
    
    
};

dataPointDetailsController.$inject = ['$scope','$stateParams', '$state', 'localStorageService', 'MD_ADMIN_SETTINGS'];

return {
    controller: dataPointDetailsController,
    templateUrl: require.toUrl('./dataPointDetails.html')
};

}); // define