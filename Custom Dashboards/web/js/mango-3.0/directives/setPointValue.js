/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function setPointValue(Translate, $q) {
    return {
        restrict: 'E',
        scope: {
            point: '='
        },
        replace: true,
        templateUrl: require.toUrl('./setPointValue.html'),
        controller: function($scope) {
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
        		var locator = $scope.point.pointLocator;
        		var type = locator.dataType;
        		var textRenderer = $scope.point.textRenderer;
        		$scope.options = null;
        		
        		if (type === 'MULTISTATE') {
        			var values = locator.values;
        			var i, rendererMap = {};
        			
        			if (textRenderer && textRenderer.multistateValues) {
        				var msv = $scope.point.textRenderer.multistateValues;
            			for (i = 0; i < msv.length; i++) {
            				rendererMap[msv[i].key] = msv[i];
            			}
        			}
        			
        			$scope.options = [];
        			for (i = 0; i < values.length; i++) {
        				var renderer = rendererMap[values[i]];
        				var label = renderer ? renderer.text : values[i];
        				var option = {
        					id: values[i],
        					label: label
        				};
        				if (renderer && renderer.color) option.color = renderer.colour;
        				$scope.options.push(option);
        			}
        		} else if (type === 'BINARY') {
        			if (textRenderer.type === 'textRendererBinary') {
        				$scope.options = [{
        					id: false,
        					label: textRenderer.zeroLabel,
        					color: textRenderer.zeroColour
        				}, {
        					id: true,
        					label: textRenderer.oneLabel,
        					color: textRenderer.oneColour
        				}];
        			} else {
        				$scope.options = $scope.defaultBinaryOptions;
        			}
        		}
        	});
        }
    };
}

setPointValue.$inject = ['Translate', '$q'];

return setPointValue;

}); // define
