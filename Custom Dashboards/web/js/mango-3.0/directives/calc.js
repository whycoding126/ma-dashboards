/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function calc() {
    return {
        scope: {
            output: '='
        },
        link: function($scope, $element, attr) {
        	var deregister = $scope.$parent.$watch(attr.input, function(newValue) {
            	$scope.output = newValue;
    		});
        	$scope.$on('$destroy', deregister);
        }
    };
}

calc.$inject = [];

return calc;

}); // define
