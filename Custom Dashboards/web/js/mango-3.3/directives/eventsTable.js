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
function eventsTable(Events, $injector, $sce) {
    return {
        restrict: 'E',
        scope: {
            eventType: '=?',
            pointId: '=?',
            limit: '=?',
            alarmLevel: '=?',
            from: '=?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./eventsTable.html');
            }
            return require.toUrl('./eventsTable.html');
        },
        link: function ($scope, $element, attrs) {
            
            $scope.parseHTML = function(text) {
                return $sce.trustAsHtml(text);
            }
            
            $scope.acknowledgeEvent = function(eventID) {
                Events.acknowledge({id: eventID}, {hi: true});
            }
            
            $scope.$watch('pointId', function(newValue, oldValue) {
                if (newValue === undefined) return;
                Events.query({
                    eventType: 'DATA_POINT', 
                    dataPointId: newValue
                }).$promise.then(function(events) {
                    $scope.events = events;
                });
            });
            
            $scope.$watch('from', function(newValue, oldValue) {
                if (newValue === undefined) return;
                console.log('From Time', newValue);
            });
            
            $scope.$watchGroup(['eventType','alarmLevel'], function(newValues, oldValues) {
                if (newValues === undefined) return;
                if (newValues[1]==='ALL' && newValues[0]!='ALL') {
                    Events.query({
                        eventType: newValues[0]
                    }).$promise.then(function(events) {
                        $scope.events = events;
                    });
                }
                else if (newValues[0]==='ALL' && newValues[1]!='ALL') {
                    Events.query({
                        alarmLevel : newValues[1]
                    }).$promise.then(function(events) {
                        $scope.events = events;
                    });
                }
                else if (newValues[0]==='ALL' && newValues[1]==='ALL') {
                    Events.query().$promise.then(function(events) {
                        $scope.events = events;
                    });
                }
                else {
                    Events.query({
                        eventType: newValues[0],
                        alarmLevel : newValues[1]
                    }).$promise.then(function(events) {
                        $scope.events = events;
                    });
                }
            });
        }
    };
}

eventsTable.$inject = ['Events', '$injector', '$sce'];
return eventsTable;

}); // define
