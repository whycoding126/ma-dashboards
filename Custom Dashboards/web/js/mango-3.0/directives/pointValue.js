/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function pointValue($filter, pointEventManager, Point) {
    return {
        restrict: 'E',
        scope: {
            point: '=?',
            pointXid: '@',
            displayType: '@',
            dateTimeFormat: '@'
        },
        templateUrl: require.toUrl('./pointValue.html'),
        controller: function ($scope, $element) {
        	var multiStateRendererMap = null;
            $scope.style = {};
            $scope.classes = {};
            
        	var displayType = $scope.displayType || 'rendered';
            var dateTimeFormat = $scope.dateTimeFormat || 'll LTS';
            if (displayType === 'none') $scope.style.display = 'none';
            
            function eventHandler(event, payload) {
                //if (!(payload.event == 'UPDATE' || payload.event == 'REGISTERED')) return;
                if (payload.xid !== $scope.point.xid) return;

                $scope.$apply(function() {
	                $scope.point.enabled = !!payload.enabled;
	                $scope.classes['point-disabled'] = !payload.enabled;
	                
	                if (payload.value) {
	                	var textRenderer = $scope.point.textRenderer;
	                    var color = null;
	                    if (multiStateRendererMap) {
	                		var rendererOptions = multiStateRendererMap[payload.value.value];
	                		if (rendererOptions) {
	                    		color = rendererOptions.colour;
	                		}
	                	} else if (textRenderer.type === 'textRendererBinary') {
	                		color = payload.value.value ? textRenderer.oneColour : textRenderer.zeroColour;
	                	}
	                    
	                    switch(displayType) {
	                    case 'converted':
	                    	$scope.displayValue = payload.convertedValue;
	                        break;
	                    case 'rendered':
	                    	$scope.displayValue = payload.renderedValue;
	                        $scope.style.color = color;
	                        break;
	                    case 'dateTime':
	                    	$scope.displayValue = $filter('moment')(payload.value.timestamp, 'format', dateTimeFormat);
	                        break;
	                    case 'none':
	                    	$scope.displayValue = '';
	                        break;
	                    default:
	                    	$scope.displayValue = payload.value.value;
	                    }
	                    
	                    $scope.point.value = payload.value.value;
	                    $scope.point.time = payload.value.timestamp;
	                    $scope.point.convertedValue = payload.convertedValue;
	                	$scope.point.renderedValue = payload.renderedValue;
	                	$scope.point.renderedColor = color;
	                }
                });
            }
            
            $scope.$watch('pointXid', function() {
                if (!$scope.pointXid || $scope.point) return;
                $scope.point = Point.get({xid: $scope.pointXid});
            });
            
            $scope.$watch('point.xid', function(newXid, oldXid) {
            	multiStateRendererMap = null;
                if (oldXid) {
                    pointEventManager.unsubscribe(oldXid, ['REGISTERED', 'UPDATE', 'TERMINATE', 'INITIALIZE'], eventHandler);
                    delete $scope.displayValue;
                    $scope.style = {};
                    $scope.classes = {};
                }
                if (newXid) {
                	if ($scope.point.textRenderer && $scope.point.textRenderer.multistateValues) {
                		multiStateRendererMap = {};
                		var msv = $scope.point.textRenderer.multistateValues;
                		for (var i = 0; i < msv.length; i++) {
                        	multiStateRendererMap[msv[i].key] = msv[i];
                		}
                	}
                	
                    pointEventManager.subscribe(newXid, ['REGISTERED', 'UPDATE', 'TERMINATE', 'INITIALIZE'], eventHandler);
                }
            });
            
            $scope.$on('$destroy', function() {
                if ($scope.point) {
                    pointEventManager.unsubscribe($scope.point.xid, ['REGISTERED', 'UPDATE', 'TERMINATE', 'INITIALIZE'], eventHandler);
                }
            });
        },
        replace: true
    };
}

pointValue.$inject = ['$filter', 'PointEventManager', 'Point'];
return pointValue;

}); // define
