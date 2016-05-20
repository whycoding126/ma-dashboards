/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuToggle = function($state, $timeout, $rootScope) {
    return {
        scope: {
            section: '='
        },
        templateUrl: require.toUrl('./menuToggle.html'),
        link: function($scope, $element) {
            var $ul = $element.find('ul');
            
            $scope.open = function() {
                $scope.isOpen = true;
                setHeight();
                $rootScope.$broadcast('menuOpened', $scope.section);
            }
            
            $scope.close = function() {
                $scope.isOpen = false;
            }
            
            $scope.toggle = function() {
                if ($scope.isOpen) {
                    $scope.close();
                } else {
                    $scope.open();
                }
            };
            
            if ($state.includes($scope.section.state) && !$scope.isOpen) {
                // use timeout to run open() after ul has been populated by ng-repeat
                $timeout(function() {
                    $scope.open();
                }, 0);
            }
            
            $scope.$on('menuOpened', function(event, section) {
                if (!$scope.isOpen || section === $scope.section) return;
                $scope.close();
            });

            // close/open menus when changing states
            $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                if ($state.includes($scope.section.state)) {
                    if (!$scope.isOpen) {
                        $scope.open();
                    }
                } else if ($scope.isOpen) {
                    $scope.close();
                }
            });
            
            // calculates the height of ul and sets its height style so transition works correctly.
            // absolute positioning means it is taken out of usual flow so doesn't affect surrounding
            // elements while calculating height, however briefly
            function setHeight() {
                $ul.addClass('no-transition');
                $ul.css({
                    height: '',
                    visibility: 'hidden',
                    position: 'absolute'
                });
                $ul.removeClass('ng-hide');
                var height = $ul.prop('clientHeight');
                $ul.addClass('ng-hide');
                $ul.css({
                    height: height + 'px',
                    visibility: '',
                    position: ''
                });
                $ul.removeClass('no-transition');
            };
        }
    };
};

menuToggle.$inject = ['$state', '$timeout', '$rootScope'];

return menuToggle;

}); // define
