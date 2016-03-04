/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function intervalPicker() {
    var types = [
	  {type: 'SECONDS', label: 'Seconds'},
	  {type: 'MINUTES', label: 'Minutes'},
	  {type: 'HOURS', label: 'Hours'},
	  {type: 'DAYS', label: 'Days'},
	  {type: 'WEEKS', label: 'Weeks'},
	  {type: 'MONTHS', label: 'Months'},
	  {type: 'YEARS', label: 'Years'}
	];
	
    return {
        restrict: 'E',
        scope: {
            interval: '='
        },
        replace: true,
        templateUrl: require.toUrl('./intervalPicker.html'),
        link: function ($scope, $element, attr) {
        	$scope.types = types;
        	$scope.intervals = 1;
        	$scope.type = 'MINUTES';
        	
        	$scope.$watchGroup(['intervals', 'type'], function() {
        		$scope.interval = $scope.intervals + ' ' + $scope.type;
        	});
        }
    };
}

intervalPicker.$inject = [];

return intervalPicker;

}); // define
