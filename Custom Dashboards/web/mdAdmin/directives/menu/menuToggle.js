'use strict';

angular.module('mdAdminApp').directive('menuToggle', ['$state', function($state) {
    return {
        scope: {
            section: '='
        },
        templateUrl: 'directives/menu/menuToggle.html',
        link: function($scope, $element) {
            $scope.open = function() {
                $scope.isOpen = true;
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
                $scope.open();
            }
            
            $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                if ($state.includes($scope.section.state)) {
                    if (!$scope.isOpen) {
                        $scope.open();
                    }
                } else if ($scope.isOpen) {
                    $scope.close();
                }
            });

            /*
            $mdUtil.nextTick(function() {
                $scope.$watch(function() {
                    return controller.isOpen($scope.section);
                }, function(open) {
                    var $ul = $element.find('ul');

                    var targetHeight = open ? getTargetHeight() : 0;
                    $timeout(function() {
                        $ul.css({
                            height: targetHeight + 'px'
                        });
                    }, 0, false);

                    function getTargetHeight() {
                        var targetHeight;
                        $ul.addClass('no-transition');
                        $ul.css('height', '');
                        targetHeight = $ul.prop('clientHeight');
                        $ul.css('height', 0);
                        $ul.removeClass('no-transition');
                        return targetHeight;
                    }
                });
            });
            */
        }
    };
}]);