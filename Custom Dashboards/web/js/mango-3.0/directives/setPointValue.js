/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function setPointValue() {
    return {
        restrict: 'E',
        scope: {
            point: '='
        },
        replace: true,
        templateUrl: require.toUrl('./setPointValue.html'),
        controller: function($scope) {
        	$scope.input = {};
        	$scope.$watch('point', function(newValue) {
        		if (newValue === undefined) return;
        		var locator = $scope.point.pointLocator;
        		var type = locator.dataType;

        		if (type === 'BINARY' || type === 'MULTISTATE') {
        			var values = locator.values;
        			var i, rendererMap = {}, options = [];
        			
        			// TODO deal with binary text renderer
        			
        			if ($scope.point.textRenderer && $scope.point.textRenderer.multistateValues) {
        				var msv = $scope.point.textRenderer.multistateValues;
            			for (i = 0; i < msv.length; i++) {
            				rendererMap[msv[i].key] = msv[i];
            			}
        			}
        			
        			for (i = 0; i < values.length; i++) {
        				var renderer = rendererMap[values[i]];
        				var label = renderer ? renderer.text : values[i];

        				// TODO translate true false for binary
        				
        				options.push({
        					id: values[i],
        					label: label
        				});
        			}
        			
        			$scope.options = options;
        		} else {
        			$scope.options = null;
        		}
        	});
        }
    };
}

return setPointValue;

}); // define
