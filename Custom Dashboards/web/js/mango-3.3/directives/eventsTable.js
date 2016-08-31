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
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./eventsTable.html');
            }
            return require.toUrl('./eventsTable.html');
        },
        link: function ($scope, $element, attrs) {
            var queryResult = Events.query().$promise.then(function(events) {
                $scope.events = events;
            });
        }
    };
}

eventsTable.$inject = ['Events', '$injector'];
return eventsTable;

}); // define
