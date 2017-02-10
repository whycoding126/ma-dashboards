/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */ 

define(['angular', 'require'], function(angular, require) {
    'use strict';

  
    // markerStoreController.$inject = [];

    function markerStoreController() {
        var $ctrl = this;

        $ctrl.deleteMarker = function() {
            $ctrl.markerList.markers = $ctrl.markerList.markers.filter(function(marker) {
                return marker.name !== $ctrl.selectedMarker.name;
            });

            $ctrl.selectedMarker = $ctrl.markerList.markers[0];
        };

        $ctrl.addMarker = function() {
            $ctrl.markerList.markers.push({});
            $ctrl.selectedMarker = $ctrl.markerList.markers[$ctrl.markerList.markers.length-1];
        };
    }

    return {
        bindings: {
            dashboardId: '@',
            markerList: '=?'
        },
        controller: markerStoreController,
        templateUrl: require.toUrl('./markerStore.html')
    };
}); // define
