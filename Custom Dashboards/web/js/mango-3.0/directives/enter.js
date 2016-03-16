/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

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
