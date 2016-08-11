/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var login = function($state, User, $rootScope) {
    return {
        templateUrl: require.toUrl('./login.html'),
        scope: {},
        link: function($scope, $element, attrs) {
            $scope.errors = {};
            
            $scope.$watchGroup(['username', 'password'], function() {
                delete $scope.errors.invalidLogin;
            });
            
            $scope.doLogin = function() {
                if (!$scope.storeCredentials) {
                    User.clearCredentialCache();
                }
                var user = User.login({
                    username: $scope.username,
                    password: $scope.password,
                    storeCredentials: $scope.storeCredentials
                });
                user.$promise.then(function() {
                    var redirect = 'dashboard.home';
                    if ($state.loginRedirect) {
                        redirect = $state.loginRedirect;
                        delete $state.loginRedirect;
                    }
                    $rootScope.clearErrors();
                    $state.go(redirect);
                }, function(error) {
                    User.clearCredentialCache();
                    
                    if (error.status === 406) {
                        $scope.errors.invalidLogin = true;
                    }
                    else {
                        $scope.errors.otherError = error.statusText || 'Connection refused';
                    }
                });
            }
        }
    };
};

login.$inject = ['$state', 'User', '$rootScope'];

return login;

}); // define
