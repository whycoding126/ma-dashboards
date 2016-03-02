'use strict';

angular.module('sbAdminApp').directive('login', ['$state', 'User', function($state, User) {
	return {
		templateUrl: 'scripts/directives/login/login.html',
		scope: {},
		link: function($scope, $element, attrs) {
			$scope.doLogin = function() {
				var user = User.login({
					username: $scope.username,
					password: $scope.password
				});
				user.$promise.then(function() {
					$state.go('dashboard.home');
				}, function(error) {
					// show error
				});
			}
		}
	};
}]);
