/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var dateControls = function($rootScope) {
	$rootScope.dateControls = {
		rollup: 'AVERAGE',
		rollupInterval: '1 minutes',
		updateInterval: '5 minutes'
	};
	return {
		templateUrl: require.toUrl('./sidebar-date-controls.html'),
		restrict: 'E',
		replace: true
	}
};

dateControls.$inject = ['$rootScope'];

return dateControls;

}); // define
