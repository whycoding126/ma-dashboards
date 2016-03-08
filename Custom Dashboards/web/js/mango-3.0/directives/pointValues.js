/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'moment-timezone'], function(angular, moment) {
'use strict';

function pointValues($http, $parse, pointEventManager, Point, $q, mangoDefaultTimeout) {
    return {
        scope: {
            point: '=?',
            points: '=?',
            pointXid: '@',
            values: '=?',
            combinedValues: '=?',
            from: '=?',
            to: '=?',
            latest: '=?',
            realtime: '=?',
            rollup: '@',
            rollupInterval: '@',
            rendered: '@',
            dateFormat: '@'
        },
        controller: function ($scope, $element) {
            var pendingRequest = null;
            var tempValues = {};
            var subscriptions = {};
            
            if ($scope.realtime === undefined) $scope.realtime = true;
            
            $scope.$on('$destroy', function() {
            	unsubscribe();
            });
            
            $scope.$watch('realtime', function(newValue, oldValue) {
            	if (newValue !== oldValue) {
            		if (newValue) {
            			subscribe();
            		} else {
            			unsubscribe();
            		}
            	}
            });

            $scope.$watch(function() {
            	var xids = [];
            	if ($scope.points) {
	            	for (var i = 0; i < $scope.points.length; i++)
	            		xids.push($scope.points[i].xid);
            	}
            	
            	return {
            		xids: xids,
            		from: $scope.from,
            		to: $scope.to,
            		latest: $scope.latest,
            		rollup: $scope.rollup,
            		rollupInterval: $scope.rollupInterval,
            		rendered: $scope.rendered
            	};
            }, function(newValue, oldValue) {
            	var changedXids = arrayDiff(newValue.xids, oldValue.xids);
            	var i;
            	
            	if ($scope.realtime && $scope.latest) {
	            	for (i = 0; i < changedXids.added.length; i++) {
	            		subscribe(changedXids.added[i]);
	            	}
            	}
            	
            	for (i = 0; i < changedXids.removed.length; i++) {
            		var removedXid = changedXids.removed[i];
                	unsubscribe(removedXid);
                	delete tempValues[removedXid];
                	if (!$scope.point)
                		delete $scope.values[removedXid];
            	}
            	
            	if (!$scope.points || !$scope.points.length) return;

            	var promises = [];
            	var cancels = [];

            	if (pendingRequest) pendingRequest();
            	pendingRequest = cancelAll.bind(null, cancels);
            	
            	for (i = 0; i < $scope.points.length; i++) {
            		var query = doQuery($scope.points[i]);
            		promises.push(query.promise);
            		cancels.push(query.cancel);
            	}
            	$q.all(promises).then(function(results) {
            		pendingRequest = null;
            		for (var i = 0; i < results.length; i++) {
            			var point = results[i].point;
            			var values = results[i].values;
            			
            			values.concat(tempValues[point.xid]);
                        delete tempValues[point.xid];
                        limitValues(values);
            			
            			if ($scope.point) {
            				$scope.values = values;
            			} else {
            				if (!$scope.values) $scope.values = {};
            				$scope.values[point.xid] = values;
            			}
            		}
            		combineValues();
            	}, function() {
            		pendingRequest();
            		pendingRequest = null;
            	});
            }, true);

            $scope.$watch('pointXid', function(newXid) {
                if (!newXid || $scope.point) return;
                $scope.point = Point.get({xid: newXid});
            });

            // for some reason the old value of the xid in the $watchGroup below is always undefined
            // so can't do this check below
            $scope.$watch('point.xid', function(newValue, oldValue) {
            	if (newValue === oldValue) return;
            	// point changed, clear out values to avoid strange looking style transitions on graphs
            	$scope.values = [];
            	$scope.points = [$scope.point];
            });
            
            function combineValues() {
            	if ($scope.point) return;

            	var combined = $scope.categoryFormat ? {} : [];
            	
            	for (var key in $scope.values) {
            		var seriesValues = $scope.values[key];
            		combine(combined, seriesValues, 'value_' + key);
            	}
                
                // normalize sparse array or object into dense array
                var output = [];
                for (var category in combined) {
                    output.push(combined[category]);
                }
                
                // XXX sparse array to dense array doesnt result in sorted array
                // manually sort here
                if (output.length && typeof output[0].category === 'number') {
                    output.sort(function(a,b) {
                        return a.category - b.category;
                    });
                }
                
                $scope.combinedValues = output;
            }
            
            function combine(output, newValues, valueField) {
                if (!newValues) return;
                
                for (var i = 0; i < newValues.length; i++) {
                    var value = newValues[i];
                    var category = $scope.categoryFormat ?
                            moment(value.timestamp).format($scope.categoryFormat) :
                            value.timestamp;
                    
                    if (!output[category]) {
                        output[category] = {category: category};
                    }
                    
                    output[category][valueField] = value.value;
                }
            }
            
            function cancelAll(cancelFns) {
            	for (var i = 0; i < cancelFns.length; i++)
            		cancelFns[i]();
            }

            function subscribe(xid) {
            	if (!xid) {
            		for (var i = 0; i < $scope.points.length; i++) {
            			subscribe($scope.points[i].xid);
            		}
            	} else {
            		if (subscriptions[xid]) return;
            		pointEventManager.subscribe(xid, ['UPDATE'], eventHandler);
                    subscriptions[xid] = true;
            	}
            }
            
            function unsubscribe(xid) {
            	if (!xid) {
            		for (var key in subscriptions) {
            			unsubscribe(key);
            		}
            	} else if (subscriptions[xid]) {
            		pointEventManager.unsubscribe(xid, ['UPDATE'], eventHandler);
            		delete subscriptions[xid];
            	}
            }
            
            function eventHandler(event, payload) {
                var xid = payload.xid;
                
                $scope.$apply(function() {
                	if (!payload.value) return;
                	
                    var dataType = $scope.point.pointLocator.dataType;

                    var item = {
                        value : payload.value.value,
                        timestamp : payload.value.timestamp
                    };
                    
                    if ($scope.rendered === 'true') {
                    	item.value = payload.renderedValue;
                    } else if (dataType === 'NUMERIC') {
                    	item.value = payload.convertedValue;
                    }
                    
                    var destArray = $scope.point ? $scope.values : $scope.values[xid];

                    if (pendingRequest || !destArray) {
                    	if (!tempValues[xid]) tempValues[xid] = [];
                    	tempValues[xid].push(item);
                    } else {
                    	destArray.push(item);
                        
                        if ($scope.latest) {
                        	limitValues(destArray);
                        }
                    }
                });
            }
            
            function limitValues(values) {
            	while (values.length > $scope.latest) {
            		values.shift();
                }
            }
            
            function doQuery(point) {
            	var now, from, to;
            	
            	if (!$scope.latest) {
            		now = moment();
            		from = toMoment($scope.from, now);
            		to = toMoment($scope.to, now);
            	}
                
                if (!point || !point.xid) return;

                var url = '/rest/v1/point-values/'  + encodeURIComponent(point.xid);
                var params = [];
                var reverseData = false;
                var dataType = point.pointLocator.dataType;

                if ($scope.latest) {
                    url += '/latest';
                    params.push('limit=' + encodeURIComponent($scope.latest));
                    reverseData = true;
                } else {
                    if (from.valueOf() === to.valueOf()) {
                    	return $q.defer().resolve([]);
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
                }
                
                if (dataType === 'NUMERIC' || $scope.rendered === 'true') {
                    // TODO unit conversion not working with rollups
                    // use rendered and parse strings
                    //params.push('unitConversion=true');
                    params.push('useRendered=true');
                }
                
                for (var i = 0; i < params.length; i++) {
                    url += (i === 0 ? '?' : '&') + params[i];
                }

    			var cancel = $q.defer();
    			setTimeout(cancel.resolve, mangoDefaultTimeout);
                
                var promise = $http.get(url, {
                	timeout: cancel.promise,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(function(response) {
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
                    
                    return {
                    	point: point,
                    	values: values
                    };
                }, function() {
                	return $q.when({
                    	point: point,
                    	values: []
                    });
                });
                
                return {
                	promise: promise,
                	cancel: cancel.resolve
                };
            }

            function toMoment(input, now) {
                if (!input || input === 'now') return now;
                if (typeof input === 'string') {
                	return moment(input, $scope.dateFormat || 'll LTS');
                }
                return moment(input);
            }

            // test for null, undefined or whitespace
            function isEmpty(str) {
            	return !str || /^\s*$/.test(str);
            }
            
            function arrayDiff(newArray, oldArray) {
            	if (newArray === undefined) newArray = [];
            	if (oldArray === undefined) oldArray = [];
            	
            	var added = angular.element(newArray).not(oldArray);
            	var removed = angular.element(oldArray).not(newArray);

            	return {
            		added: added,
            		removed: removed,
            		changed: !!(added.length || removed.length)
            	};
            }
        }
    };
}

pointValues.$inject = ['$http', '$parse', 'PointEventManager', 'Point', '$q', 'mangoDefaultTimeout'];
return pointValues;

}); // define
