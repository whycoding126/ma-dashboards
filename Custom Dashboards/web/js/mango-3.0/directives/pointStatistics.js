/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'moment-timezone'], function(angular, moment) {
'use strict';

function pointValues($http, $parse, Point) {
    return {
        restrict: 'E',
        scope: {
            point: '=?',
            pointXid: '@',
            statistics: '=',
            from: '=?',
            fromFilter: '@',
            to: '=?',
            toFilter: '@',
            refreshInterval: '@',
            dateFormat: '@',
            firstLast: '@'
        },
        template: '<span style="display:none"></span>',
        replace: true,
        controller: function ($scope, $element) {
        	// TODO use service to get statistics
            function doQuery() {
                if (!$scope.point || !$scope.point.xid) return;
                
                var url;
                if ($scope.firstLast === 'true') {
                	url = '/rest/v1/point-values/' + encodeURIComponent($scope.point.xid) +
                    '/first-last';
                } else {
                	url = '/rest/v1/point-values/' + encodeURIComponent($scope.point.xid) +
                    '/statistics';
                }
                var params = [];
                
                var now = moment();
                var from = toMoment($scope.from, now);
                var to = toMoment($scope.to, now);
                from = filterMoment(from, $scope.fromFilter);
                to = filterMoment(to, $scope.toFilter);
                
                if (from.valueOf() === to.valueOf()) return;
                
                params.push('from=' + encodeURIComponent(from.toISOString()));
                params.push('to=' + encodeURIComponent(to.toISOString()));
                params.push('useRendered=true');
                
                for (var i = 0; i < params.length; i++) {
                    url += (i === 0 ? '?' : '&') + params[i];
                }
                
                startRefreshTimer();
                
                var promise = $http.get(url, {
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(function(response) {
                	var data = response.data;
                	
                	if (data.startsAndRuntimes && $scope.point.textRenderer && $scope.point.textRenderer.multistateValues) {
                		var msv = $scope.point.textRenderer.multistateValues;
                		var msvMap = {};
                		for (var i = 0; i < msv.length; i++) {
                			msvMap[msv[i].key] = msv[i];
                		}
                		for (i = 0; i < data.startsAndRuntimes.length; i++) {
                			var statsObj = data.startsAndRuntimes[i];
                			var msvObj = msvMap[statsObj.value];
                			if (!msvObj) continue;
                			statsObj.renderedValue = msvObj.text;
                			statsObj.renderedColor = msvObj.colour;
                		}
                	}
                	
                    $scope.statistics = data;
                }, function() {
                    $scope.statistics = {};
                });
            }

            $scope.$watch('pointXid', function() {
                if (!$scope.pointXid || $scope.point) return;
                $scope.point = Point.get({xid: $scope.pointXid});
            });
            
            $scope.$watchGroup(['point.xid', 'from', 'to', 'fromFilter', 'toFilter'],
                    function(newValues, oldValues) {
                doQuery();
            }, true);
            
            function toMoment(input, now) {
                if (!input || input === 'now') return now;
                if (typeof input === 'string') {
                	return moment(input, $scope.dateFormat || 'll LTS');
                }
                return moment(input);
            }
            
            function filterMoment(m, filterString) {
                if (!filterString) return m;
                var fn = $parse('date|' + filterString);
                var scope = {date: m};
                return fn(scope);
            }
            
            var timerId;
            function startRefreshTimer() {
                cancelRefreshTimer();
                if (!$scope.refreshInterval) return;
                
                var fromIsRelative = !$scope.from || $scope.from === 'now';
                var toIsRelative = !$scope.to || $scope.to === 'now';
                if (!fromIsRelative && !toIsRelative) return;
                
                var parts = $scope.refreshInterval.split(' ');
                if (parts.length < 2) return;
                
                var duration = moment.duration(parseFloat(parts[0]), parts[1]);
                var millis = duration.asMilliseconds();
                
                timerId = setInterval(function() {
                    $scope.$apply(function() {
                        doQuery();
                    });
                }, millis);
            }
            
            function cancelRefreshTimer() {
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }
            }
            
            $scope.$on('$destroy', function() {
                cancelRefreshTimer();
            });
        }
    };
}

pointValues.$inject = ['$http', '$parse', 'Point'];
return pointValues;

}); // define
