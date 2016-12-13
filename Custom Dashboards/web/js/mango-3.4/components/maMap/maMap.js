/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function (angular, require) {
    'use strict';

    maMapController.$inject = ['$scope', 'NgMap', 'MA_GOOGLE_MAPS_API_KEY'];
    function maMapController($scope, NgMap, MA_GOOGLE_MAPS_API_KEY) {
        var $ctrl = this;
        
        require(['https://maps.google.com/maps/api/js?key=' + MA_GOOGLE_MAPS_API_KEY], function() {
            $scope.$applyAsync(function() {
                $ctrl.render = true;
            });
        });

        this.render = false;
        this.infoWindowCache = {};

        NgMap.getMap().then(function (map) {
            this.map = map;
        }.bind(this));

        this.toggleInfoWindow = function(e, windowId, markerId) {
            // console.log(e, windowId, markerId);
            if (!this.infoWindowCache[windowId]) {
                this.map.showInfoWindow(windowId, markerId);
                this.infoWindowCache[windowId] = true;
            }
            else {
                this.map.hideInfoWindow(windowId);
                this.infoWindowCache[windowId] = false;
            }
        }.bind(this);

        this.$onChanges = function (changes) {
            console.log(changes);
            if (!this.height) {
                this.height = "400px";
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
