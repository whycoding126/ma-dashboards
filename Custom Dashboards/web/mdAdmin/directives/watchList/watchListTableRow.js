/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require', 'moment-timezone'], function(require, moment) {
    'use strict';
    var FLASH_CLASS = 'flash-on-change';
    
    watchListTableRow.$inject = ['$mdMedia', '$mdDialog', '$timeout', 'UserNotes', 'MD_ADMIN_SETTINGS'];
    return watchListTableRow;

    function watchListTableRow($mdMedia, $mdDialog, $timeout, UserNotes, MD_ADMIN_SETTINGS) {
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
                    var timezone = MD_ADMIN_SETTINGS.user.getTimezone();
                    
                    scope.pointValueChanged = function pointValueChanged(point) {
                        // manually add and remove classes rather than using ng-class as point values can
                        // change rapidly and result in huge slow downs / heaps of digest loops
                        
                        var now = (new Date()).valueOf();
                        var format = now - point.time > 86400 ? 'l LTS' : 'LTS';
                        pointTimeCell.text(moment.tz(point.time, timezone).format(format));

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
                                    this.dateBar = MD_ADMIN_SETTINGS.dateBar;
                                    
                                    this.parent = scope;
                                    this.timeRange = moment.duration(moment(this.dateBar.to).diff(moment(this.dateBar.from))).humanize();
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
    } // End DDO

}); // define