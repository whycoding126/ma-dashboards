'use strict';

angular.module('mdAdminApp')
.directive('sidebarDateControls', ['$rootScope', function($rootScope) {
	$rootScope.dateControls = {
		rollup: 'AVERAGE',
		rollupInterval: '1 minutes',
		updateInterval: '5 minutes'
	};
	return {
		templateUrl:'directives/sidebar/sidebar-date-controls/sidebar-date-controls.html',
		restrict: 'E',
		replace: true
	}
}]);
