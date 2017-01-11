/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UsersPageController.$inject = ['$stateParams', 'User', '$state'];
function UsersPageController($stateParams, User, $state) {
    this.$stateParams = $stateParams;
    this.User = User;
    this.$state = $state;
}

UsersPageController.prototype.$onInit = function() {
    if (this.$stateParams.username) {
        this.user = this.User.get({username: this.$stateParams.username});
    }
};

UsersPageController.prototype.userChanged = function() {
    this.$stateParams.username = this.user && this.user.username || null;
    this.$state.go('.', this.$stateParams, {location: 'replace', notify: false});
};

return {
    controller: UsersPageController,
    templateUrl: require.toUrl('./usersPage.html')
};

}); // define