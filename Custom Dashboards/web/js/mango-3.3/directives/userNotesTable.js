/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'moment-timezone'], function(require, moment) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maUserNotesTable
 * @restrict E
 * @description
 * `<ma-user-notes-table></ma-user-notes-table>`
 * - Displays a list of User Notes
 *
 * @param {string} reference-id Query via referenceId
 * @param {string} timezone Timezone for displaying time stamps
 * @param {string} limit Set the initial limit of the pagination
 *
 * @usage
 * <ma-user-notes-table></ma-user-notes-table>`
 *
 */
userNotesTable.$inject = ['UserNotes', '$injector', 'mangoDateFormats'];
function userNotesTable(UserNotes, $injector, mangoDateFormats) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            referenceId: '=?',
            timezone: '@'
        },
        templateUrl: require.toUrl('./userNotesTable.html'),
        link: function ($scope, $element, attrs) {
            
            $scope.addNote = UserNotes.addNote;
            
            $scope.updateWithNewNote = function(data) {
                $scope.userNotes.push(data);
            };
            
            $scope.formatDate = function(date) {
                var m = moment(date);
                if ($scope.timezone) {
                    m.tz($scope.timezone);
                }
                return m.format(mangoDateFormats.shortDateTime);
            };
            
            $scope.$watch('referenceId', function(newValue, oldValue) {
                if (newValue === undefined) return;
                UserNotes.query({
                    commentType: 'POINT', 
                    referenceId: newValue
                }).$promise.then(function(events) {
                    $scope.userNotes = events;
                });
            });
            
        }
    };
}

return userNotesTable;

}); // define
