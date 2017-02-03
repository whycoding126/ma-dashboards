/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */



define([], function() {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maSvgCircle
 *
 * @description
 * `<ma-svg-circle></ma-svg-circle>`
 * - This directive will insert an SVG circle that you can control the radius of with data binding
 *
 *
 * @param {number} radius Radius of the circle
 *
 * @usage
 * <ma-svg-circle radius="myPoint.value"></ma-svg-circle>
 */
function svgCircle() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            radius: '='
        },
        templateNamespace: 'svg',
        template: '<circle cx="50" cy="50" ng-attr-r="{{radius}}" stroke="black" stroke-width="3" fill="red" />'
    };
}

svgCircle.$inject = [];

return svgCircle;

}); // define
