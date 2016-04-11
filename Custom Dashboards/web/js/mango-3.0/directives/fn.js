/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function enter($parse) {
    return {
        scope: {
            fn: '=',
            ready: '=?',
            argNames: '=?'
        },
    	compile: function($element, attrs) {
    		var parsed = $parse(attrs.expression);
    		
    		return function($scope, $element, attrs) {
    			$scope.fn = argMatch.bind(null, parsed, $scope.$parent, $scope.argNames);
    			$scope.ready = true;
            };
            
            function argMatch(parsedFn, context, argNames) {
                var overrides = {};
                for (var i = 3; i < arguments.length; i++) {
                    var argNumber = i - 3;
                    var argName = argNames && argNames.length > argNumber && argNames[argNumber] || 'arg' + argNumber;
                    overrides[argName] = arguments[i];
                }
                return parsedFn(context, overrides);
            }
    	}
    };
}

enter.$inject = ['$parse'];

return enter;

}); // define
