/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
    'use strict';

    maMapController.$inject = ['$scope', 'NgMap', 'MD_ADMIN_SETTINGS'];
    function maMapController($scope, NgMap, MD_ADMIN_SETTINGS) {
        var $ctrl = this;
        $ctrl.render = false;
        $ctrl.apiKeySet = false;
        $ctrl.infoWindowCache = {};

        if (MD_ADMIN_SETTINGS.googleMapsApiKey) {
            $ctrl.apiKeySet = true;
            require(['https://maps.google.com/maps/api/js?key=' + MD_ADMIN_SETTINGS.googleMapsApiKey], function() {
                $scope.$applyAsync(function() {
                    $ctrl.render = true;
                });
            });
        }
        

        $ctrl.toggleInfoWindow = function(e, windowId, markerId) {
            // console.log(e, windowId, markerId);
            if (!$ctrl.infoWindowCache[windowId]) {
                $ctrl.map.showInfoWindow(windowId, markerId);
                $ctrl.infoWindowCache[windowId] = true;
            }
            else {
                $ctrl.map.hideInfoWindow(windowId);
                $ctrl.infoWindowCache[windowId] = false;
            }
        };

        $ctrl.onMapLoaded = function() {
            NgMap.getMap().then(function(map) {
                $ctrl.map = map;
                google.maps.event.trigger($ctrl.map, 'resize');
            });
        };


        $ctrl.$onChanges = function(changes) {
            // console.log(changes);
            if (!$ctrl.height) {
                $ctrl.height = "400px";
            }
        };
    }

    return {
        bindings: {
            zoom: '<',
            center: '@',
            mapType: '@',
            infoWindowTheme: '@',
            height: '@'
        },
        controller: maMapController,
        templateUrl: require.toUrl('./maMap.html'),
        transclude: true
    };
}); // define
