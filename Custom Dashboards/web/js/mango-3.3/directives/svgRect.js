/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */



define([], function() {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maSvgRect
 *
 * @description
 * `<ma-svg-rect></ma-svg-rect>`
 * - This directive will insert an SVG rectangle that you can control the width and height of with data binding
 *
 *
 * @param {number} rectHeight Height of the rectangle
 * @param {number} rectWidth Width of the rectangle
 *
 * @usage
 * <ma-svg-rect></ma-svg-rect>
 */
function svgRect() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            rectHeight: '=',
            rectWidth: '='
        },
        templateNamespace: 'svg',
        template: '<rect ng-attr-height="{{rectHeight}}" ng-attr-width="{{rectWidth}}"></rect>'
    };
}

svgRect.$inject = [];

return svgRect;

}); // define
