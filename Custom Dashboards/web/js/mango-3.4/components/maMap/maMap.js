/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function (angular, require) {
    'use strict';
    maMapController.$inject = ['$timeout', 'NgMap'];
    function maMapController($timeout, NgMap) {
        this.render = false;
        this.infoWindowCache = {};

        $timeout(function () {
            this.render = true;
        }.bind(this), 100);

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
            // console.log(changes);
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
