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
        this.user.$promise.then(function(user) {
            // causes a stack overflow when we try and deep merge this object later
            delete user.$promise;
        }, function() {
            this.user = this.User.current;
            this.updateUrl();
        }.bind(this));
    } else {
        this.user = this.User.current;
        this.updateUrl();
    }
};

UsersPageController.prototype.updateUrl = function() {
    this.$stateParams.username = this.user && this.user.username || null;
    this.$state.go('.', this.$stateParams, {location: 'replace', notify: false});
};

UsersPageController.prototype.userDeleted = function(user) {
    this.addUser();
};

UsersPageController.prototype.userSaved = function(user, prevUser) {
    if (prevUser.username === this.User.current.username) {
        this.User.current = user;
    }
    // username might have been updated
    this.updateUrl();
};

UsersPageController.prototype.addUser = function($event) {
    this.user = new this.User();
    this.user.isNew = true;
    this.user.username = '';
    this.user.email = '';
    this.user.phone = '';
    this.user.homeURL = '';
    this.user.locale = '';
    this.user.systemLocale = '';
    this.user.timezone = '';
    this.user.systemTimezone = '';
    this.user.permissions = 'user';
    this.user.muted = true;
    this.user.receiveOwnAuditEvents = false;
    this.user.disabled = false;
    this.user.receiveAlarmEmails = 'IGNORE';
    this.updateUrl();
};

return {
    controller: UsersPageController,
    templateUrl: require.toUrl('./usersPage.html')
};

}); // define