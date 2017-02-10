/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */ 

define(['angular', 'require'], function(angular, require) {
    'use strict';

  
    markerStoreController.$inject = [];
    function markerStoreController() {
        var $ctrl = this;

        $ctrl.$onChanges = function(changes) {
            // console.log(changes);
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
