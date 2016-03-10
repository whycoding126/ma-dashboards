/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function pointValues($http, $parse, pointEventManager, Point, $q, mangoDefaultTimeout, Util) {
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
            toFromFormat: '@'
        },
        link: function ($scope, $element, attrs) {
            var pendingRequest = null;
            var tempValues = {};
            var subscriptions = {};

            var singlePoint = !attrs.points;
            var doCombine = !singlePoint && !!attrs.combinedValues;
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
	            	for (var i = 0; i < $scope.points.length; i++) {
	            		if (!$scope.points[i]) continue;
	            		xids.push($scope.points[i].xid);
	            	}
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
            	var changedXids = Util.arrayDiff(newValue.xids, oldValue.xids);
            	var i;

            	for (i = 0; i < changedXids.removed.length; i++) {
            		var removedXid = changedXids.removed[i];
                	unsubscribe(removedXid);
                	
                	// delete temp values if they exist
                	delete tempValues[removedXid];
                	
                	// remove old values
                	if (singlePoint) {
                		delete $scope.values;
                	} else {
                		delete $scope.values[removedXid];
                	}
                	
                	// remove values for xid from combined values
                	var combined = $scope.combinedValues;
                	if (combined) {
                		for (var j = 0; j < combined.length; j++) {
                			var item = combined[j];
                			delete item['value_' + removedXid];
                			if (Util.numKeys(item, 'value') === 0) {
                				combined.splice(j--, 1);
                			}
                		}
                	}
            	}

            	for (i = 0; i < changedXids.added.length; i++) {
            		if ($scope.realtime && $scope.latest) {
            			subscribe(changedXids.added[i]);
            		}
            	}
            	
            	if (!$scope.points || !$scope.points.length) return;

            	var promises = [];
            	var cancels = [];

            	if (pendingRequest) pendingRequest();
            	pendingRequest = cancelAll.bind(null, cancels);
            	
            	for (i = 0; i < $scope.points.length; i++) {
            		if (!$scope.points[i]) continue;
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
            			
            			if (singlePoint) {
            				$scope.values = values;
            			} else {
            				if (!$scope.values) $scope.values = {};
            				$scope.values[point.xid] = values;
            			}
            		}
            		
            		if (doCombine)
            			combineValues();
            	}, function(reason) {
            		if (cancels.length) {
            			// cancel hasn't been called, single failure
            			console.log(reason);
            		} else {
            			console.log('cancelled');
            		}
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
            	var combined = {};
            	
            	for (var xid in $scope.values) {
            		var seriesValues = $scope.values[xid];
            		combineInto(combined, seriesValues, 'value_' + xid);
            	}
                
                // convert object into array
                var output = [];
                for (var timestamp in combined) {
                    output.push(combined[timestamp]);
                }
                
                // sort array by timestamp
                output.sort(function(a,b) {
                    return a.timestamp - b.timestamp;
                });
                
                $scope.combinedValues = output;
            }
            
            function combineInto(output, newValues, valueField) {
                if (!newValues) return;
                
                for (var i = 0; i < newValues.length; i++) {
                    var value = newValues[i];
                    var timestamp = value.timestamp;
                    
                    if (!output[timestamp]) {
                        output[timestamp] = {timestamp: timestamp};
                    }
                    
                    output[timestamp][valueField] = value.value;
                }
            }
            
            function cancelAll(cancelFns) {
            	cancelFns = cancelFns.splice(0, cancelFns.length);
            	for (var i = 0; i < cancelFns.length; i++)
            		cancelFns[i]();
            }

            function subscribe(xid) {
            	if (!xid) {
            		for (var i = 0; i < $scope.points.length; i++) {
                		if (!$scope.points[i]) continue;
            			subscribe($scope.points[i].xid);
            		}
            	} else {
            		if (subscriptions[xid]) return;
            		pointEventManager.subscribe(xid, ['UPDATE'], websocketHandler);
                    subscriptions[xid] = true;
            	}
            }
            
            function unsubscribe(xid) {
            	if (!xid) {
            		for (var key in subscriptions) {
            			unsubscribe(key);
            		}
            	} else if (subscriptions[xid]) {
            		pointEventManager.unsubscribe(xid, ['UPDATE'], websocketHandler);
            		delete subscriptions[xid];
            	}
            }
            
            function websocketHandler(event, payload) {
                var xid = payload.xid;
                
                $scope.$apply(function() {
                	if (!payload.value) return;
                	
                	var value;
                    if ($scope.rendered === 'true') {
                    	value = payload.renderedValue;
                    } else if (payload.convertedValue !== undefined) {
                    	value = payload.convertedValue;
                    } else {
                    	value = payload.value.value;
                    }
                    
                    var item = {
                        value : value,
                        timestamp : payload.value.timestamp
                    };
                    
                    var destArray = $scope.point ? $scope.values : $scope.values[xid];

                    if (pendingRequest || !destArray) {
                    	if (!tempValues[xid]) tempValues[xid] = [];
                    	tempValues[xid].push(item);
                    	
                    	var combinedVals = $scope.combinedValues;
                    	if (combinedVals) {
                    		var last = combinedVals.length && combinedVals[combinedVals.length - 1];
                    		if (last && last.time === item.timestamp) {
                    			last['value_' + xid] = item.value;
                    		} else {
                    			var newVal = {time: item.timestamp};
                    			newVal['value_' + xid] = item.value;
                    			combinedVals.push(newVal);
                    		}
                    	}
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
            		now = new Date();
            		from = Util.toMoment($scope.from, now, $scope.toFromFormat);
            		to = Util.toMoment($scope.to, now, $scope.toFromFormat);
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
                    
                    if (!Util.isEmpty($scope.rollup) && $scope.rollup !== 'NONE') {
                        params.push('rollup=' + encodeURIComponent($scope.rollup));
                        
                        var timePeriodType = 'DAYS';
                        var timePeriods = 1;
                        
                        if (!Util.isEmpty($scope.rollupInterval)) {
                        	var parts = $scope.rollupInterval.split(' ');
                        	if (parts.length == 2 && !Util.isEmpty(parts[0]) && !Util.isEmpty(parts[1])) {
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

    			var cancelDefer = $q.defer();
    			var cancelFn = cancelDefer.resolve;
    			setTimeout(cancelFn, mangoDefaultTimeout);
                
                var promise = $http.get(url, {
                	timeout: cancelDefer.promise,
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
                });
                
                return {
                	promise: promise,
                	cancel: cancelFn
                };
            }
        }
    };
}

pointValues.$inject = ['$http', '$parse', 'PointEventManager', 'Point', '$q', 'mangoDefaultTimeout', 'Util'];
return pointValues;

}); // define
