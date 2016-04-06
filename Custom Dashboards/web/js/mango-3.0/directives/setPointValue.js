/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function setPointValue(Translate, $q, $injector, $timeout) {
    return {
        restrict: 'E',
        scope: {
            point: '='
        },
        replace: true,
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./setPointValue-md.html');
            }
            return require.toUrl('./setPointValue.html');
        },
        link: function($scope) {
        	$scope.input = {};
        	
        	$scope.defaultBinaryOptions = [];
        	var trPromise = $q.all([Translate.tr('common.false'), Translate.tr('common.true')]).then(function(trs) {
        		$scope.defaultBinaryOptions.push({
					id: false,
					label: trs[0]
				});
        		$scope.defaultBinaryOptions.push({
        			id: true,
					label: trs[1]
				});
			});
        	
        	$scope.$watch('point', function(newValue) {
        		if (newValue === undefined) return;
        		delete $scope.input.value;
        		delete $scope.result;
        		
        		var locator = $scope.point.pointLocator;
        		var type = locator.dataType;
        		var textRenderer = $scope.point.textRenderer;
        		$scope.options = null;
        		
        		if (type === 'MULTISTATE') {
        			var values = locator.values;
        			var i;
        			
        			$scope.options = [];
        			for (i = 0; i < values.length; i++) {
        				var renderer = $scope.point.valueRenderer(values[i]);
        				var label = renderer ? renderer.text : values[i];
        				var option = {
        					id: values[i],
        					label: label,
        					style: {}
        				};
        				if (renderer && renderer.color) option.style.color = renderer.colour;
        				$scope.options.push(option);
        			}
        		} else if (type === 'BINARY') {
        			if ($scope.point.rendererMap()) {
        				var falseRenderer = $scope.point.valueRenderer(false);
        				var trueRenderer = $scope.point.valueRenderer(true);
        				$scope.options = [{
        					id: false,
        					label: falseRenderer.text,
        					style: {
        					    color: falseRenderer.color
        					}
        				}, {
        					id: true,
        					label: trueRenderer.text,
        					style: {
                                color: trueRenderer.color
        					}
        				}];
        			} else {
        				$scope.options = $scope.defaultBinaryOptions;
        			}
        		}
        	});
        	
        	var HOLD_TIMEOUT = 3000;
        	
        	$scope.setPointValue = function(value) {
        	    var result = {
        	        pending: true
        	    };
        	    $scope.point.setValue(value).then(function() {
                    delete result.pending;
        	        result.success = true;
        	        $timeout(function() {
        	            delete result.success;
        	        }, HOLD_TIMEOUT);
        	    }, function(data) {
                    delete result.pending;
        	        result.error = data;
        	        $timeout(function() {
                        delete result.error;
                    }, HOLD_TIMEOUT);
        	    });
        	    return result;
        	};
        }
    };
}

setPointValue.$inject = ['Translate', '$q', '$injector', '$timeout'];

return setPointValue;

}); // define
