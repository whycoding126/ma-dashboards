/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function focusOn($timeout) {
    return {
    	restrict: 'A',
    	compile: function(cElem, cAttrs, transclude) {
    		var name = this.name;
    		
    		return function($scope, $element, attr) {
            	$scope.$watch(attr[name], function(newValue, oldValue) {
            		if (newValue !== oldValue && newValue) {
            		    $timeout(function() {
            		        $element.focus();
            		    });
            		}
            	});
            };
    	}
    };
}

focusOn.$inject = ['$timeout'];

return focusOn;

}); // define
