/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
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
                Events.acknowledgeViaRql({rql: 'acknowledged=false&sort(-activeTimestamp)&limit(3,0)'}, null).$promise.then(
                    function (data) {
                        if (data.count) {
                            console.log('Acknowledged ', data.count, ' events');
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
                // console.log('Querying', $scope.singlePoint, $scope.pointId);
                $scope.events = Events.objQuery(value);
            }, true);
            
        }
    };
}

eventsTable.$inject = ['Events', 'eventsEventManager', 'UserNotes', '$mdMedia', '$injector', '$sce'];
return eventsTable;

}); // define
