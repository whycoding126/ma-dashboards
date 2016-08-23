/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    var watchListChart = function($mdMedia, $timeout) {
        return {
            restrict: 'E',
            scope: {
                to: '=',
                from: '=',
                addChecked: '=',
                rollupType: '=',
                rollupIntervalNumber: '=',
                rollupIntervalPeriod: '=',
                autoRollup: '='
            },
            templateUrl: 'directives/watchList/watchListChart.html',
            link: function link(scope, element, attrs) {

                scope.parseInt = parseInt; // Make parseInt availble to scope
                scope.parseFloat = parseFloat; // Make parseFloat availble to scope
                scope.stats = []; // Set up array for storing stats for stats tab
                scope.points = []; // Set up array for storing charted points
                scope.$mdMedia = $mdMedia; // Make $mdMedia service availble to scope

                scope.$watchCollection('addChecked', function(newValues, oldValues) {
                    if (newValues === undefined || newValues === oldValues) return;

                    // Enables the ability to add points to the drill down chart by checking items in the table
                    //console.log('addChecked:', newValues);

                    // Clear Stats Tab
                    scope.stats = [];
                    
                    // assign the chart's points equal to the checked from table
                    scope.points = newValues;
                });

            } // End Link
        }; // End return
    }; // End DDO

    watchListChart.$inject = ['$mdMedia', '$timeout'];

    return watchListChart;

}); // define