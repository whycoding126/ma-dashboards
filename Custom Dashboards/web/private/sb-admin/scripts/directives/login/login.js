'use strict';

angular.module('sbAdminApp').directive('login', ['$state', 'User', function($state, User) {
	return {
		templateUrl: 'scripts/directives/login/login.html',
		scope: {},
		link: function($scope, $element, attrs) {
			$scope.$watchGroup(['username', 'password'], function() {
				delete $scope.invalidLogin;
			});
			
			$scope.doLogin = function() {
				delete $scope.invalidLogin;
				delete $scope.otherError;
				
				var user = User.login({
					username: $scope.username,
					password: $scope.password
				});
				user.$promise.then(function() {
					var redirect = 'dashboard.home';
					if ($state.loginRedirect) {
						redirect = $state.loginRedirect;
						delete $state.loginRedirect;
					}
					$state.go(redirect);
				}, function(error) {
					if (error.status === 406) {
						$scope.invalidLogin = true;
					}
					else {
						$scope.otherError = error.statusText || 'Connection refused';
					}
				});
			}
		}
	};
}]);
