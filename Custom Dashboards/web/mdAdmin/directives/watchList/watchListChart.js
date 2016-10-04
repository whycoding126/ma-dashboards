/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    watchListChart.$inject = ['$mdMedia', '$timeout', 'DateBar', 'localStorageService'];
    function watchListChart($mdMedia, $timeout, DateBar, localStorageService) {
        return {
            restrict: 'E',
            scope: {
                addChecked: '='
            },
            templateUrl: 'directives/watchList/watchListChart.html',
            link: function link(scope, element, attrs) {
                
                scope.dateBar = DateBar;
                
                scope.graphOptions = [];
                
                scope.parseInt = parseInt; // Make parseInt available to scope
                scope.parseFloat = parseFloat; // Make parseFloat available to scope
                scope.stats = []; // Set up array for storing stats for stats tab
                scope.points = []; // Set up array for storing charted points
                scope.$mdMedia = $mdMedia; // Make $mdMedia service available to scope
                
                var watchlistChartColors = localStorageService.get('watchlistChartColors');
                
                if (watchlistChartColors != null) {
                    scope.selectedAxis = watchlistChartColors.selectedAxis;
                    scope.assignColors = watchlistChartColors.assignColors;
                    scope.axisColors = watchlistChartColors.axisColors;
                    scope.selectedColor = watchlistChartColors.selectedColor
                }
                else {
                    scope.assignColors = false;
                    scope.selectedAxis = 'left';
                    scope.axisColors = { left2AxisColor: "#000000",
                        leftAxisColor: "#000000",
                        right2AxisColor: "#000000",
                        rightAxisColor: "#000000"
                    }
                    scope.selectedColor = '#C2185B';
                }

                scope.$watchCollection('addChecked', function(newValues, oldValues) {
                    if (newValues === undefined || newValues === oldValues) return;
                    
                    // If cleared from selecting a new watchlist clear stats and graphOptions
                    if (newValues.length === 0) {
                        scope.stats = [];
                        scope.graphOptions = [];
                    }
                    
                    
                    // Clear Stats before new ones are generated
                    scope.stats = [];
                    
                    // assign the chart's points equal to the checked from table
                    scope.points = newValues;
                    
                    if(oldValues === undefined || newValues.length > oldValues.length) {
                        var graphOption = {valueAxis: scope.selectedAxis, xid: newValues[newValues.length-1].xid};
                        if (scope.assignColors) {
                            graphOption.lineColor = scope.selectedColor;
                        }
                        scope.graphOptions.push(graphOption);
                        // console.log('Adding', newValues[newValues.length-1].xid);
                    }
                    else if (newValues.length < oldValues.length) {
                        var arrayDiff = oldValues.filter(function(x) { return newValues.indexOf(x) < 0 });
                        var removedXid = arrayDiff[0].xid;
                        var removedIndex = oldValues.map(function(x) {return x.xid; }).indexOf(removedXid);
                        
                        scope.graphOptions.splice(removedIndex, 1);
                        // console.log('Removed', removedXid, 'at index', removedIndex);
                    }

                    // console.log('Graph Options', scope.graphOptions);
                });
                
                scope.updateColors = function () {
                    localStorageService.set('watchlistChartColors', {assignColors: scope.assignColors, selectedColor: scope.selectedColor, axisColors: scope.axisColors, selectedAxis: scope.selectedAxis});
                    
                    // console.log(localStorageService.get('watchlistChartColors'));
                };

            } // End Link
        }; // End return
    }; // End DDO

    return watchListChart;

}); // define