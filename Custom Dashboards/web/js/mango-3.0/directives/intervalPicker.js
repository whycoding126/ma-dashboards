/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function intervalPicker() {
    return {
        restrict: 'E',
        scope: {
            interval: '='
        },
        replace: true,
        templateUrl: require.toUrl('./intervalPicker.html'),
        link: function ($scope, $element, attr) {
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
