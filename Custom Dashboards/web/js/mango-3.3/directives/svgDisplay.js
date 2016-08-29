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
 * - This directive will 
 *
 *
 * @param {number} radius Radius of the circle
 *
 * @usage
 * <ma-svg-circle></ma-svg-circle>
 */
function svgDisplay() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            svg: '@'
        },
        template: '<div ng-include="svg"></div>'
    };
}

svgDisplay.$inject = [];

return svgDisplay;

}); // define
