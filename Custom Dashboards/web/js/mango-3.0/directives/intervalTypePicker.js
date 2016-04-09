/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function intervalTypePicker() {
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
            ngModel: '='
        },
        replace: true,
        template: ' <md-select>' +
            '<md-option ng-value="t.type" ng-repeat="t in types">{{t.label}}</md-option>' +
            '</md-select>',
        link: function ($scope, $element, attr) {
        	$scope.types = types;
        }
    };
}

intervalTypePicker.$inject = [];

return intervalTypePicker;

}); // define
