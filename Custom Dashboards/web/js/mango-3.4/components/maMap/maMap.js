/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */ 

define(['angular', 'require'], function(angular, require) {
    'use strict';
 /**
  * @ngdoc directive
  * @name maDashboards.maMap
  * @restrict E
  * @description
  * `<ma-map zoom="10" map-type="roadmap" center="-12.95, -38.45" desktop-height="950px" mobile-height="450px"></ma-map>`
  * - This component will display a google map that can be used within your custom dashboard pages.
  * - Note, you will need to set a your google map api key on the <a ui-sref="dashboard.settings.dashboardSettings">Dashboard Settings</a> page.
  * - A google map api key can be aquired <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">here</a>.
  * - `<ma-map>` utilizes the <a href="https://ngmap.github.io/#/!infowindow_ng_click.html" target="_blank">ng-map</a> library and therefore can use `<marker>` and `<info window>` components.
  * - <a ui-sref="dashboard.examples.basics.mapsAndTimezones">View Demo</a>
  *
  * @param {number} zoom Sets the zoom level of the map.
  * @param {numbers=} center Sets the lat/long coordinates of the center of the map. Set as two comma seperated values. Eg. `-12.95, -38.45`. <br> Not necessary if `<ma-map>` contains a `<marker>` component with a `position` property set and `centered="true"`.
  * @param {string=} map-type Sets the map type. Possible options are:
<ul>
    <li>`roadmap` displays the default road map view</li>
    <li>`satellite` displays Google Earth satellite images</li>
    <li>`hybrid` displays a mixture of normal and satellite views</li>
    <li>`terrain` displays a physical map based on terrain information</li>
</ul>
  * @param {string=} info-window-theme Can optionally be set to `dark` to use a dark theme on all `<info-window>` components. Defaults to a white background theme.
  * @param {string=} desktop-height Sets the height of the map at a desktop width (>1280px). Set with px. Eg `800px`. Defaults to `500px`.
  * @param {string=} mobile-height Sets the height of the map at a mobile/tablet width (<1280px). Set with px. Eg `400px`.
  *
  * @usage
  * <ma-map zoom="10" map-type="roadmap" flex="100" output-data="pointXID" desktop-height="950px" mobile-height="450px">
      <marker centered="true" position="-12.95, -38.45" 
      on-click="$parent.$ctrl.setOutputData('Demo 01-outsidetemp')"></marker>
      <marker position="40, -105" 
      on-click="$parent.$ctrl.setOutputData('Demo 01-amps')"></marker>
    </ma-map>
  *
  */
  
    maMapController.$inject = ['$scope', '$mdMedia', 'NgMap', 'MD_ADMIN_SETTINGS'];
    function maMapController($scope, $mdMedia, NgMap, MD_ADMIN_SETTINGS) {
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
        
        $ctrl.setOutputData = function(e, data) {
            $ctrl.outputData = data;
            // console.log('setData called', e, data);
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
            if (!$ctrl.desktopHeight) {
                $ctrl.height = "500px";
            }
            if (!$mdMedia('gt-md') && $ctrl.mobileHeight) {
                $ctrl.height = $ctrl.mobileHeight;
            }
        };

        $scope.$watch(function() { return $mdMedia('gt-md'); }, function(gtMd) {
            // console.log(gtMd);
            $ctrl.height = gtMd ? $ctrl.desktopHeight : $ctrl.mobileHeight;
        });
    }

    return {
        bindings: {
            zoom: '<',
            center: '@',
            mapType: '@',
            infoWindowTheme: '@',
            desktopHeight: '@',
            mobileHeight: '@',
            outputData: '='
        },
        controller: maMapController,
        templateUrl: require.toUrl('./maMap.html'),
        transclude: true
    };
}); // define
