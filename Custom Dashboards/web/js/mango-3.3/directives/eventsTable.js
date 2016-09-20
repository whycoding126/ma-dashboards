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
            eventId: '=?',
            alarmLevel: '=?',
            acknowledged: '=?',
            activeStatus: '=?',
            query: '=',
            start: '=?',
            limit: '=?',
            sort: '=?',
            sortOrder: '=?',
            paginateLimit: '=?',
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
            
            var filterBeforePush = function (event) {
                
                if ($scope.query.eventType !== event.eventType.eventType && $scope.query.eventType !== '*') {
                    // console.log('returning');
                    return;
                }
                if ($scope.alarmLevel !== event.alarmLevel && $scope.alarmLevel !== '*') {
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
                        if (msg.status === 'OK') {
                            var event = msg.payload.event;
                            
                            filterBeforePush(event);
                        }
                    });
                }
            });
            
            
            $scope.$watch('sortOrder', function(newValue, oldValue) {
                if (newValue === undefined) return;
                // console.log(newValue);
                $scope.myOrder = $scope.sortOrder;
            });
            
            $scope.parseHTML = function(text) {
                return $sce.trustAsHtml(text);
            };
            
            $scope.acknowledgeEvent = function(eventID) {
                Events.acknowledge({id: eventID}, null).$promise.then(
                    function (data) {
                        // console.log('Success', data);
                        
                        $scope.events.find(function(item) {
                            return item.id === data.id;
                        }).acknowledged = true;
                        
                    },
                    function (data) {
                        console.log('Error', data);
                    }
                );
            };
            
            $scope.$watch(function() {
                return {
                    query: $scope.query,
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
                value.sort = value.sort || '-activeTimestamp';
                $scope.events = Events.objQuery(value);
            }, true);
            
        }
    };
}

eventsTable.$inject = ['Events', 'eventsEventManager', 'UserNotes', '$mdMedia', '$injector', '$sce'];
return eventsTable;

}); // define
