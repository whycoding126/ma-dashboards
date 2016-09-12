/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';
    var FLASH_CLASS = 'flash-on-change';

    var watchListTableRow = function($mdMedia, $mdDialog, $timeout, UserNotes) {
        return {
            templateUrl: 'directives/watchList/watchListTableRow.html',
            link: function link(scope, element, attrs) {

                    scope.$mdMedia = $mdMedia;
                    scope.Updated = false;
                    scope.addNote = UserNotes.addNote;

                    scope.showSetPoint = function(ev) {
                        $mdDialog.show({
                                controller: function() {
                                    this.parent = scope;
                                    this.cancel = function cancel() {
                                        $mdDialog.cancel();
                                    };
                                },
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
                    
                    var pointValueCell = element.find('.point-value');
                    var pointTimeCell = element.find('.point-time');
                    
                    var timeoutID;
                    var lastValue;
                    scope.flashRow = function flashRow(point) {
                        // manually add and remove classes rather than using ng-class as point values can
                        // change rapidly and result in huge slow downs / heaps of digest loops
                        
                        pointTimeCell.addClass(FLASH_CLASS);
                        if (point.value !== lastValue) {
                            pointValueCell.addClass(FLASH_CLASS);
                        };
                        lastValue = point.value;
                        
                        if (timeoutID) {
                            clearTimeout(timeoutID);
                            timeoutID = null;
                        }

                        timeoutID = setTimeout(function() {
                            pointValueCell.removeClass(FLASH_CLASS);
                            pointTimeCell.removeClass(FLASH_CLASS);
                        }, 400);
                    };

                    scope.showStats = function(ev) {
                        $mdDialog.show({
                                controller: function() {
                                    this.parent = scope;
                                    this.timeRange = moment.duration(moment(scope.to).diff(moment(scope.from))).humanize();
                                    this.cancel = function cancel() {
                                        $mdDialog.cancel();
                                    };
                                },
                                templateUrl: require.toUrl('./statsDialog.html'),
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                fullscreen: true,
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

    watchListTableRow.$inject = ['$mdMedia', '$mdDialog', '$timeout', 'UserNotes'];

    return watchListTableRow;

}); // define