/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maEnter
 * @restrict A
 * @description
 * `<input ma-enter="runFunction()">`
 * - Restricted to usage as an attribute.
 * - Evaluates an expression when enter (return) key is hit on an input.
 * - Used within `<ma-set-point-value>` to set the value of a data point when enter key is hit.
 *
 *
 * @usage
 * <input ng-model="input.value" ma-copy-blurred="point.value"
 ma-enter="point.setValue(input.value)">
 */
function enter() {
    return {
    	restrict: 'A',
    	compile: function() {
    		var name = this.name;

    		return function($scope, $element, attr) {
    			$element.bind('keypress', function(event) {
    				if (event.which !== 13) return;
    				$scope.$apply(function() {
        				$scope.$eval(attr[name]);
    				});
    			});
            };
    	}
    };
}

enter.$inject = [];

return enter;

}); // define
