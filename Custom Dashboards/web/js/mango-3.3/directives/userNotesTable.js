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
 * @param {string} reference-id Query via referenceId
 * @param {string} limit Set the initial limit of the pagination
 *
 * @usage
 * <ma-user-notes-table></ma-user-notes-table>`
 *
 */
function userNotesTable(UserNotes, $injector) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            referenceId: '=?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./userNotesTable.html');
            }
            return require.toUrl('./userNotesTable.html');
        },
        link: function ($scope, $element, attrs) {
            
            $scope.addNote = UserNotes.addNote;
            
            $scope.updateWithNewNote = function(data) {
                $scope.userNotes.push(data);
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

userNotesTable.$inject = ['UserNotes', '$injector'];
return userNotesTable;

}); // define
