/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
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
