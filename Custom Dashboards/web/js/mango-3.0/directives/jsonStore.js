/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function jsonStore(JsonStore) {
    return {
        scope: {
        	key: '@',
            value: '='
        },
        link: function ($scope, $element, attr) {
        	var knownValue;
        	
            $scope.$watch('key', function(newValue, oldValue) {
            	if (!newValue) return;

            	JsonStore.get({key: newValue}).$promise.then(function(value) {
            		knownValue = angular.copy(value);
            		$scope.value = value;
            	});
            });
            
            $scope.$watch('value', function(newValue, oldValue) {
            	if (newValue === oldValue || angular.equals(newValue, knownValue)) return;
            	
            	JsonStore.save({key: $scope.key, name: $scope.key}, newValue).$promise.then(function(value) {
            		knownValue = angular.copy(value);
            		$scope.value = value;
            	});
            }, true);
        }
    };
}

jsonStore.$inject = ['JsonStore'];
return jsonStore;

}); // define
