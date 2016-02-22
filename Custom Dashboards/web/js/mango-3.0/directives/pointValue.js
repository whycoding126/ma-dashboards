/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
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
        template: '<span ng-style="style">{{displayValue}}</span>',
        controller: function ($scope, $element) {
        	var multiStateRendererMap = null;
        	
            function eventHandler(event, payload) {
                if (!(payload.event == 'UPDATE' || payload.event == 'REGISTERED')) return;
                if (payload.xid !== $scope.point.xid) return;
                
                var displayType = $scope.displayType || 'rendered';
                var displayValue = payload.value.value;
                var dateTimeFormat = $scope.dateTimeFormat || 'lll';

                var color;
                if (multiStateRendererMap) {
            		var rendererOptions = multiStateRendererMap[payload.value.value];
            		if (rendererOptions) {
                		color = rendererOptions.colour;
            		}
            	}
                
                var style = {};
                switch(displayType) {
                case 'converted':
                    displayValue = payload.convertedValue; break;
                case 'rendered':
                    displayValue = payload.renderedValue;
                    style.color = color;
                    break;
                case 'dateTime':
                    displayValue = $filter('moment')(payload.value.timestamp, 'format', dateTimeFormat); break;
                case 'none':
                	style.display = 'none';
                    displayValue = '';
                }
                
                $scope.$apply(function() {
                	$scope.style = style;
                    $scope.displayValue = displayValue;
                    
                    $scope.point.value = payload.value.value;
                    $scope.point.convertedValue = payload.convertedValue;
                    $scope.point.renderedValue = payload.renderedValue;
                    if (color)
                    	$scope.point.renderedColor = color;
                    $scope.point.time = payload.value.timestamp;
                });
            }
            
            $scope.$watch('pointXid', function() {
                if (!$scope.pointXid || $scope.point) return;
                $scope.point = Point.get({xid: $scope.pointXid});
            });
            
            $scope.$watch('point.xid', function(newXid, oldXid) {
            	multiStateRendererMap = null;
                if (oldXid) {
                    pointEventManager.unsubscribe(oldXid, 'UPDATE', eventHandler);
                }
                if (newXid) {
                	if ($scope.point.textRenderer && $scope.point.textRenderer.multistateValues) {
                		multiStateRendererMap = {};
                		var msv = $scope.point.textRenderer.multistateValues;
                		for (var i = 0; i < msv.length; i++) {
                        	multiStateRendererMap[msv[i].key] = msv[i];
                		}
                	}
                	
                    pointEventManager.subscribe(newXid, 'UPDATE', eventHandler);
                }
            });
            
            $scope.$on('$destroy', function() {
                if ($scope.point) {
                    pointEventManager.unsubscribe($scope.point.xid, 'UPDATE', eventHandler);
                }
            });
        },
        replace: true
    };
}

pointValue.$inject = ['$filter', 'PointEventManager', 'Point'];
return pointValue;

}); // define
