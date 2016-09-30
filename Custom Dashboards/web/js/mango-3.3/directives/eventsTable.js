/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maEventsTable
 * @restrict E
 * @description
 * `<ma-events-table></ma-events-table>`
 * - Displays a list of Events in a table format.
 *
 * @param {string} event-type Query via eventType
 * @param {string} point-id Query via pointId, not to be used with other query by attributes
 * @param {string} alarm-level Query via alarmLevel
 * @param {number} limit Set the initial limit of the pagination
 *
 * @usage
 * <ma-events-table event-type="eventType" limit="25"></ma-events-table>
 *
 */
function eventsTable(Events, eventsEventManager, UserNotes, $mdMedia, $injector, $sce) {
    return {
        restrict: 'E',
        scope: {
            pointId: '=?',
            singlePoint: '@',
            eventId: '=?',
            alarmLevel: '=?',
            eventType:'=?',
            acknowledged: '=?',
            activeStatus: '=?',
            query: '=?',
            limit: '=?',
            sort: '=?',
            from: '=?',
            to: '=?',
            dateRange: '@'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./eventsTable.html');
            }
            return require.toUrl('./eventsTable.html');
        },
        link: function ($scope, $element, attrs) {
            
            $scope.$mdMedia = $mdMedia;
            $scope.addNote = UserNotes.addNote;
            
            $scope.page = 1;
            $scope.total = 0;
            $scope.totalUnAcknowledged = 0;
            
            var filterBeforePush = function (payload) {
                if (payload.type === 'ACKNOWLEDGED') {
                    // console.log('returning');
                    return;
                }
                if ($scope.query.eventType !== payload.event.eventType.eventType && $scope.query.eventType !== '*') {
                    // console.log('returning');
                    return;
                }
                if ($scope.alarmLevel !== payload.event.alarmLevel && $scope.alarmLevel !== '*') {
                    // console.log('returning');
                    return;
                }
                
                // console.log('pushing');
                $scope.events.push(event);
            }
            
            $scope.$watch('dateRange', function(newValue, oldValue) {
                if (newValue === undefined) return;
                
                if (newValue) {
                    eventsEventManager.subscribe(function(msg) {
                        // console.log(msg);
                        if (msg.status === 'OK') {
                            filterBeforePush(msg.payload);
                        }
                        else {
                            console.log('Error:', msg);
                        }
                    });
                }
            });
            
            $scope.onPaginate = function(page, limit) {
                $scope.start = (page - 1) * limit;
            };
            
            $scope.parseHTML = function(text) {
                return $sce.trustAsHtml(text);
            };
            
            $scope.acknowledgeEvents = function(events) {
                events.forEach(function(event) {
                    Events.acknowledge({id: event.id}, null).$promise.then(
                        function (data) {
                            // console.log('Success', data);
                            
                            if (data.id) {
                                $scope.events.find(function(item) {
                                    return item.id === data.id;
                                }).acknowledged = true;
                            }
                        },
                        function (data) {
                            console.log('Error', data);
                        }
                    );
                });
            };
            
            $scope.acknowledgeAll = function() {
                Events.acknowledgeViaRql({rql: $scope.RQL.RQLforAcknowldege}, null).$promise.then(
                    function (data) {
                        if (data.count) {
                            //console.log('Acknowledged ', data.count, ' events with RQL', $scope.RQL.RQLforAcknowldege);
                            // Filter by acknowledged
                            $scope.acknowledged = true;
                        }
                    },
                    function (data) {
                        console.log('Error', data);
                    }
                );
            };
            
            $scope.$watch('events.$total', function(newValue, oldValue){
                if (newValue === undefined || newValue === oldValue) return;
                $scope.total = newValue;
                
                if ($scope.acknowledged === 'false' || $scope.acknowledged === '*' || $scope.acknowledged === undefined) {
                    Events.rql({query: $scope.RQL.RQLforAcknowldege+'&limit(0)'}, null).$promise.then(
                        function (data) {
                            if (data.$total) {
                                // console.log($scope.RQL.RQLforAcknowldege+'&limit(0)', data.$total);
                                $scope.totalUnAcknowledged = data.$total;
                            }
                        },
                        function (data) {
                            console.log('Error', data);
                        }
                    );
                }
                else {
                    $scope.totalUnAcknowledged = 0;
                }
                
                
            });
            
            $scope.$watch(function() {
                return {
                    eventType: $scope.eventType,
                    start: $scope.start,
                    limit: $scope.limit,
                    sort: $scope.sort,
                    alarmLevel: $scope.alarmLevel,
                    acknowledged: $scope.acknowledged,
                    activeStatus: $scope.activeStatus,
                    pointId: $scope.pointId,
                    eventId: $scope.eventId,
                    from: $scope.from,
                    to: $scope.to
                };
            }, function(value) {
                
                if ($scope.singlePoint && !$scope.pointId) {
                    // console.log('Returning', $scope.singlePoint, $scope.pointId);
                    return;
                }
                
                $scope.RQL = doQuery(value);
                //console.log('Querying on:', $scope.RQL.RQLforDisplay);
                $scope.events = Events.rql({query: $scope.RQL.RQLforDisplay});
            }, true);
            
            var doQuery = function(options) {
                var params = [];
                
                if (options.alarmLevel && options.alarmLevel != '*') {
                    params.push('alarmLevel=' + options.alarmLevel);
                }
                if (options.eventType && options.eventType != '*') {
                    params.push('eventType=' + options.eventType);
                }
                if (options.pointId) {
                    params.push('dataPointId=' + options.pointId);
                }
                if (options.eventId) {
                    params.push('id=' + options.eventId);
                }
                if (options.activeStatus && options.activeStatus != '*') {
                    if (options.activeStatus==='active') {
                        params.push('active=true');
                    }
                    else if (options.activeStatus==='noRtn') {
                        params.push('rtnApplicable=false');
                    }
                    else if (options.activeStatus==='normal') {
                        params.push('active=false');
                    }
                }
                if (options.acknowledged && options.acknowledged != '*') {
                    if (options.acknowledged==='true') {
                        params.push('acknowledged=true');
                    }
                    else if (options.acknowledged==='false') {
                        params.push('acknowledged=false');
                    }
                }
                if (options.from) {
                    params.push('activeTimestamp=ge=' + options.from.valueOf());
                }
                if (options.to) {
                    params.push('activeTimestamp=lt=' + options.to.valueOf());
                }
                
                var RQLforAcknowldege = params.join('&');
                var RQLforDisplay = params.join('&');
                
                RQLforAcknowldege += '&acknowledged=false';
                
                if (options.sort) {
                    var sort = options.sort;
                    if (angular.isArray(sort)) {
                        sort = sort.join(',');
                    }
                    RQLforDisplay += '&sort(' + sort + ')';
                }
                if (options.limit) {
                    var start = options.start || 0;
                    RQLforDisplay += '&limit(' + options.limit + ',' + start + ')';
                }

                return {RQLforAcknowldege: RQLforAcknowldege, RQLforDisplay: RQLforDisplay}; 
            }
            
        }
    };
}

eventsTable.$inject = ['Events', 'eventsEventManager', 'UserNotes', '$mdMedia', '$injector', '$sce'];
return eventsTable;

}); // define
