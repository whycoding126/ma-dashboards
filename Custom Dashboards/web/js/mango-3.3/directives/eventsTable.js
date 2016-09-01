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
 * - Displays a list of Events in a table
 *
 * @param {object} Replace Replace
 *
 * @usage
 * <ma-events-table></ma-events-table>
 *
 */
function eventsTable(Events, $injector) {
    return {
        restrict: 'E',
        scope: {
            eventType: '=?',
            pointId: '=?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./eventsTable.html');
            }
            return require.toUrl('./eventsTable.html');
        },
        link: function ($scope, $element, attrs) {
            $scope.$watchGroup(['eventType', 'pointId'], function(newValues, oldValues) {
                if (newValues === undefined) return;
                Events.query({eventType: newValues[0], dataPointId: newValues[1]}).$promise.then(function(events) {
                    $scope.events = events;
                });
            });
        }
    };
}

eventsTable.$inject = ['Events', '$injector'];
return eventsTable;

}); // define
