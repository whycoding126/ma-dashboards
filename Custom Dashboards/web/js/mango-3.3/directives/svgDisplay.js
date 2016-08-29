/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */



define([], function() {
    'use strict';
    /**
     * @ngdoc directive
     * @name maDashboards.maSvgDisplay
     *
     * @description
     * `<ma-svg-display></ma-svg-display>`
     * - This directive will display a SVG graphic you can bind data too
     *
     *
     * @param {string} svg Path to the SVG file
     *
     * @usage
     * <ma-svg-display></ma-svg-display>
     */
    function svgDisplay() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                svg: '@',
                point: '=',
                max: '='
            },
            template: '<div ng-include="svg" onload="init()"></div>',
            link: function($scope, $element, attributes) {
                $scope.init = function() {
                    $scope.$watch('point.value', function(newValue, oldValue) {
                        if (newValue === undefined || newValue === oldValue) return;
                        update();
                    });
                    $scope.$watch('max', function(newValue, oldValue) {
                        if (newValue === undefined || newValue === oldValue) return;
                        update();
                    });

                    var update = function() {
                        var attrArray = [];
                        
                        angular.forEach(attributes, function(value, key) {
                            attrArray.push([key, value])
                        });
                        
                        attrArray = attrArray.filter(function(item, index, array) {
                            return item[0].indexOf('shape') !== -1;
                        });
                        
                        attrArray.forEach(function(item, index, array) {
                            var shapeId = item[0].substring(0, item[0].indexOf('Mode'));
                            
                            if (item[1] === 'opacity') {
                                angular.element(document).find('#' + shapeId).css('fill-opacity', $scope.point.value / $scope.max);
                            }
                            else if (item[1] === 'stroke') {
                                angular.element(document).find('#' + shapeId).css('stroke-width', $scope.point.value / $scope.max * 5);
                            }
                        });
                    }
                }
            }
        };
    }

    svgDisplay.$inject = [];

    return svgDisplay;

}); // define