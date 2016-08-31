/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maUserNotesTable
 * @restrict E
 * @description
 * `<ma-user-notes-table></ma-user-notes-table>`
 * - Displays a list of User Notes
 *
 * @param {object} Replace Replace
 *
 * @usage
 * <ma-user-notes-table></ma-user-notes-table>`
 *
 */
function userNotesTable(UserNotes, $injector) {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./userNotesTable.html');
            }
            return require.toUrl('./userNotesTable.html');
        },
        link: function ($scope, $element, attrs) {
            var queryResult = UserNotes.query().$promise.then(function(userNotes) {
                $scope.userNotes = userNotes;
            });
        }
    };
}

userNotesTable.$inject = ['UserNotes', '$injector'];
return userNotesTable;

}); // define
