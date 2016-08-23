/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    var watchListTableRow = function($mdMedia, $mdDialog) {
        return {
            templateUrl: 'directives/watchList/watchListTableRow.html',
            link: function link(scope, element, attrs) {

                    scope.$mdMedia = $mdMedia;
                    
                    scope.$watch('pointValue.value', function(newValue, old) {
                        if (newValue === undefined || newValue === old) return;
                        
                        console.log('New Point Values:',scope.pointValue.name,scope.pointValue.value);
                    });

                    scope.showSetPoint = function(ev, point) {
                        $mdDialog.show({
                                controller: setDialogController,
                                templateUrl: require.toUrl('./setPointDialog.html'),
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                fullscreen: false,
                                clickOutsideToClose: true,
                                locals : {
                                    point : point
                                }
                            })
                            .then(function(answer) {
                                //$scope.status = 'You said the information was "' + answer + '".';
                            }, function() {
                                //$scope.status = 'You cancelled the dialog.';
                            });
                    }
                    
                    scope.showStats = function(ev, point, from, to, rollupType, rollupIntervalNumber, rollupIntervalPeriod, autoRollup) {
                        $mdDialog.show({
                                controller: setStatsController,
                                templateUrl: require.toUrl('./statsDialog.html'),
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                fullscreen: false,
                                clickOutsideToClose: true,
                                locals : {
                                    point : point,
                                    from: from,
                                    to: to,
                                    rollupType: rollupType,
                                    rollupIntervalNumber: rollupIntervalNumber,
                                    rollupIntervalPeriod: rollupIntervalPeriod,
                                    autoRollup: autoRollup
                                }
                            })
                            .then(function(answer) {
                                //$scope.status = 'You said the information was "' + answer + '".';
                            }, function() {
                                //$scope.status = 'You cancelled the dialog.';
                            });
                    }

                    function setDialogController(scope, $mdDialog, point) {
                        scope.point = point;
                        
                        scope.hide = function() {
                            $mdDialog.hide();
                        };
                        scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        scope.answer = function(answer) {
                            $mdDialog.hide(answer);
                        };
                    }
                    
                    setDialogController.$inject = ['$scope', '$mdDialog', 'point'];
                    
                    function setStatsController(scope, $mdDialog, point, from, to, rollupType, rollupIntervalNumber, rollupIntervalPeriod, autoRollup) {
                        scope.point = point;
                        scope.from = from;
                        scope.to = to;
                        scope.rollupType = rollupType;
                        scope.rollupIntervalNumber = rollupIntervalNumber;
                        scope.rollupIntervalPeriod = rollupIntervalPeriod;
                        scope.autoRollup = autoRollup;
                        scope.hide = function() {
                            $mdDialog.hide();
                        };
                        scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        scope.answer = function(answer) {
                            $mdDialog.hide(answer);
                        };
                    }
                    
                    setStatsController.$inject = ['$scope', '$mdDialog', 'point', 'from', 'to',  'rollupType', 'rollupIntervalNumber', 'rollupIntervalPeriod', 'autoRollup'];

                } // End Link
        }; // End return
    }; // End DDO

    watchListTableRow.$inject = ['$mdMedia', '$mdDialog'];

    return watchListTableRow;

}); // define