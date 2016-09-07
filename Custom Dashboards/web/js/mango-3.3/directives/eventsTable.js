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
            pointId: '=?',
            eventId: '=?',
            alarmLevel: '=?',
            query: '=',
            start: '=?',
            limit: '=?',
            sort: '=?',
            paginateLimit: '=?',
            from: '=?',
            to: '=?'
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
            };
            
            $scope.acknowledgeEvent = function(eventID) {
                Events.acknowledge({id: eventID}, {acknowledge: true});
            };
            
            $scope.$watch(function() {
                return {
                    query: $scope.query,
                    start: $scope.start,
                    limit: $scope.limit,
                    sort: $scope.sort,
                    alarmLevel: $scope.alarmLevel,
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

eventsTable.$inject = ['Events', '$injector', '$sce'];
return eventsTable;

}); // define
