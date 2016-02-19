/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function copyBlurred() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
        	maCopyBlurred: '=',
            ngModel: '='
        },
        controller: function ($scope, $element) {
            $scope.$watch('maCopyBlurred', function(value) {
            	if (!$element.is(":focus")) {
            		$scope.ngModel = value;
            	}
            });
        }
    };
}

return copyBlurred;

}); // define
