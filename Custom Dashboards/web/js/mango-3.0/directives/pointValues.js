/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', '../api', 'moment-timezone'], function(angular, MangoAPI, moment) {
'use strict';

var baseUrl = MangoAPI.defaultApi.baseUrl;

function pointValues($http, $parse, pointEventManager, Point) {
    return {
        restrict: 'E',
        scope: {
            point: '=?',
            pointXid: '@',
            values: '=',
            from: '=?',
            fromOutput: '=?',
            fromFilter: '@',
            to: '=?',
            toOutput: '=?',
            toFilter: '@',
            latest: '=?',
            realtime: '=?',
            refreshInterval: '@',
            rollup: '@',
            rollupInterval: '@',
            rendered: '@'
        },
        template: '<span style="display:none"></span>',
        replace: true,
        controller: function ($scope, $element) {
            function eventHandler(event, payload) {
                if (!(payload.event == 'UPDATE' || payload.event == 'REGISTERED')) return;
                if (payload.xid !== $scope.point.xid) return;
                $scope.$apply(function() {
                    var item = {
                        value : payload.convertedValue,
                        timestamp : payload.value.timestamp
                    };
                    
                    if (requestPending || !$scope.values) {
                        tempValues.push(item);
                    } else {
                        $scope.values.push(item);
                        
                        if ($scope.latest) {
                            while ($scope.values.length > $scope.latest) {
                                $scope.values.shift();
                            }
                        }
                    }
                });
            }
            
            var requestPending = false;
            var tempValues = [];
            
            function doQuery() {
            	var now, from, to;
            	
            	if (!$scope.latest) {
            		now = moment();
            		from = toMoment($scope.from, now);
            		to = toMoment($scope.to, now);
	                from = filterMoment(from, $scope.fromFilter);
	                to = filterMoment(to, $scope.toFilter);
	                $scope.fromOutput = from;
	                $scope.toOutput = to;
            	} else {
            		$scope.fromOutput = null;
	                $scope.toOutput = null;
            	}
                
                if (!$scope.point || !$scope.point.xid) return;

                var url = baseUrl + '/rest/v1/point-values/'  + encodeURIComponent($scope.point.xid);
                var params = [];
                var reverseData = false;
                var dataType = $scope.point.pointLocator.dataType;
                
                if ($scope.latest) {
                    url += '/latest';
                    params.push('limit=' + encodeURIComponent($scope.latest));
                    params.push('unitConversion=true');
                    reverseData = true;
                } else {
                    if (from.valueOf() === to.valueOf()) {
                    	$scope.values = [];
                    	return;
                    }
                    
                    params.push('from=' + encodeURIComponent(from.toISOString()));
                    params.push('to=' + encodeURIComponent(to.toISOString()));
                    
                    if (!isEmpty($scope.rollup) && $scope.rollup !== 'NONE') {
                        params.push('rollup=' + encodeURIComponent($scope.rollup));
                        
                        var timePeriodType = 'DAYS';
                        var timePeriods = 1;
                        
                        if (!isEmpty($scope.rollupInterval)) {
                        	var parts = $scope.rollupInterval.split(' ');
                        	if (parts.length == 2 && !isEmpty(parts[0]) && !isEmpty(parts[1])) {
                        		var intVal = parseInt(parts[0], 10);
                        		timePeriods = intVal > 0 ? intVal : 1;
                        		timePeriodType = parts[1].toUpperCase();
                        	}
                        }
                        
                        params.push('timePeriodType=' + encodeURIComponent(timePeriodType));
                        params.push('timePeriods=' + encodeURIComponent(timePeriods));
                    }
                    
                    if (dataType === 'NUMERIC' || $scope.rendered === 'true') {
                        // TODO unit conversion not working with rollups
                        // use rendered and parse strings
                        //params.push('unitConversion=true');
                        params.push('useRendered=true');
                    }
                }
                
                for (var i = 0; i < params.length; i++) {
                    url += (i === 0 ? '?' : '&') + params[i];
                }
                
                startRefreshTimer();
                
                requestPending = true;
                var promise = $http.get(url, {
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(function(response) {    
                    requestPending = false;
                    var values = response.data;
                    
                    if (reverseData)
                        values.reverse();
                    
                    // TODO remove when unit conversion fixed
                    if (dataType === 'NUMERIC' && $scope.rendered !== 'true') {
                        for (var i = 0; i < values.length; i++) {
                            if (typeof values[i].value === 'string') {
                                values[i].value = parseFloat(values[i].value);
                            }
                        }
                    }
                    
                    $scope.values = values;
                    $scope.values.concat(tempValues);
                    tempValues = [];
                    
                    if ($scope.latest) {
                        while ($scope.values.length > $scope.latest) {
                            $scope.values.shift();
                        }
                    }
                    
                    //angular.copy(response.data, $scope.values);
                    // splice new data into start of array
                    //Array.prototype.splice.apply($scope.values, [0,0].concat(response.data));
                }, function() {
                    requestPending = false;
                    $scope.values = [];
                    tempValues = [];
                });
            }

            var subscribed = false;
            if ($scope.realtime === undefined) {
                $scope.realtime = true;
            }
            
            $scope.$watch('pointXid', function() {
                if (!$scope.pointXid || $scope.point) return;
                $scope.point = Point.get({xid: $scope.pointXid});
            });
            
            $scope.$watchGroup(['point.xid', 'realtime', 'from', 'to', 'latest','fromFilter', 'toFilter',
                                'rollup', 'rollupInterval'],
                    function(newValues, oldValues) {
                
                if ($scope.realtime && $scope.point && $scope.point.xid && $scope.latest) {
                    subscribe($scope.point.xid);
                } else {
                    unsubscribe();
                }
                
                doQuery();
            }, true);
            
            function toMoment(input, now) {
                if (!input || input === 'now') return now;
                return moment(input);
            }
            
            function filterMoment(m, filterString) {
                if (!filterString) return m;
                var fn = $parse('date|' + filterString);
                var scope = {date: m};
                return fn(scope);
            }
            
            $scope.$watch('refreshInterval', function() {
            	startRefreshTimer();
            });
            
            var timerId;
            function startRefreshTimer() {
                cancelRefreshTimer();
                
                if (isEmpty($scope.refreshInterval)) return;
                
                var fromIsRelative = !$scope.from || $scope.from === 'now';
                var toIsRelative = !$scope.to || $scope.to === 'now';
                if (!fromIsRelative && !toIsRelative) return;
                
                var parts = $scope.refreshInterval.split(' ');
                if (parts.length < 2) return;
                
                if (isEmpty(parts[0]) || isEmpty(parts[1])) return;
                
                var duration = moment.duration(parseFloat(parts[0]), parts[1]);
                var millis = duration.asMilliseconds();
                
                // dont allow continuous loops
                if (millis === 0) return;
                
                timerId = setInterval(function() {
                    $scope.$apply(function() {
                        doQuery();
                    });
                }, millis);
            }
            
            // test for null, undefined or whitespace
            function isEmpty(str) {
            	return !str || /^\s*$/.test(str);
            }
            
            function cancelRefreshTimer() {
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }
            }
            
            $scope.$on('$destroy', function() {
                unsubscribe();
                cancelRefreshTimer();
            });
            
            var subscribedXid = null;
            
            function subscribe(xid) {
                if (!xid || xid === subscribedXid) return;
                unsubscribe();
                pointEventManager.subscribe(xid, 'UPDATE', eventHandler);
                subscribedXid = xid;
            }
            
            function unsubscribe() {
                if (subscribedXid) {
                    pointEventManager.unsubscribe(subscribedXid, 'UPDATE', eventHandler);
                    subscribedXid = null;
                }
            }
        }
    };
}

pointValues.$inject = ['$http', '$parse', 'PointEventManager', 'Point'];
return pointValues;

}); // define
