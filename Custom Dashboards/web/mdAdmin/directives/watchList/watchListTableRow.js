/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
      'use strict';

      var watchListTableRow = function($mdMedia, $mdDialog, $timeout) {
            return {
                  templateUrl: 'directives/watchList/watchListTableRow.html',
                  link: function link(scope, element, attrs) {

                              scope.$mdMedia = $mdMedia;
                              scope.Updated = false;

                              scope.$watch('point.value', function(newValue, old) {
                                    if (newValue === undefined || newValue === old) return;
                                    // console.log('New Point Values:', scope.point.name, scope.point.value);
                                    
                                    scope.Updated = true;
                                    $timeout(function() {
                                          scope.Updated = false;
                                    }, 200);
                              });

                              scope.showSetPoint = function(ev) {
                                    $mdDialog.show({
                                                controller: function () { this.parent = scope; },
                                                templateUrl: require.toUrl('./setPointDialog.html'),
                                                parent: angular.element(document.body),
                                                targetEvent: ev,
                                                fullscreen: false,
                                                clickOutsideToClose: true,
                                                controllerAs: 'ctrl'
                                          })
                                          .then(function(answer) {
                                                //$scope.status = 'You said the information was "' + answer + '".';
                                          }, function() {
                                                //$scope.status = 'You cancelled the dialog.';
                                          });
                              }


                              scope.showStats = function(ev) {
                                    $mdDialog.show({
                                                controller: function () { this.parent = scope; },
                                                templateUrl: require.toUrl('./statsDialog.html'),
                                                parent: angular.element(document.body),
                                                targetEvent: ev,
                                                fullscreen: false,
                                                clickOutsideToClose: true,
                                                controllerAs: 'ctrl'
                                          })
                                          .then(function(answer) {
                                                //$scope.status = 'You said the information was "' + answer + '".';
                                          }, function() {
                                                //$scope.status = 'You cancelled the dialog.';
                                          });
                              }


                        } // End Link
            }; // End return
      }; // End DDO

      watchListTableRow.$inject = ['$mdMedia', '$mdDialog', '$timeout'];

      return watchListTableRow;

}); // define