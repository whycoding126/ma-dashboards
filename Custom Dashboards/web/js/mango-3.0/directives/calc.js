/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function calc($parse) {
    return {
        restrict: 'E',
        scope: {
        	input: '@',
            output: '='
        },
        link: function($scope, $element, attr) {
        	var unbindWatch;
        	
        	$scope.$watch('input', function(newValue) {
        		newValue = newValue || '';
        		if (unbindWatch) unbindWatch();
        		unbindWatch = $scope.$parent.$watch(newValue, function(newValue) {
        			//$element.html(newValue);
                	$scope.output = newValue;
        		});
        	});
        }
    };
}

calc.$inject = ['$parse'];

return calc;

}); // define
