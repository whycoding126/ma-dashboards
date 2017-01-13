/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UserEditorController.$inject = ['User', '$http'];
function UserEditorController(User, $http) {
    this.User = User;
    this.timezones = moment.tz.names();
    
    $http.get(require.toUrl('dashboards/vendor/localeList.json')).then(function(response) {
        this.locales = response.data;
    }.bind(this));
}

UserEditorController.prototype.$onChanges = function(changes) {
    if (changes.originalUser) {
        this.user = angular.copy(this.originalUser);
        this.prepareUser(this.user);
        this.resetForm();
    }
};

UserEditorController.prototype.hashRegExp = /^\{(.*?)\}(.*)$/;

UserEditorController.prototype.prepareUser = function(user) {
    if (user.password) {
        var matches = this.hashRegExp.exec(user.password);
        if (!matches || matches[1] !== 'BCRYPT') {
            user.insecureHash = true;
        }
    }
    user.password = '';
    user.confirmPassword = '';
};

UserEditorController.prototype.resetForm = function() {
    if (this.userForm) {
        this.userForm.$setPristine();
        this.userForm.$setUntouched();
    }
};

UserEditorController.prototype.save = function() {
    if (this.userForm.$valid) {
        this.user.saveOrUpdate({username: this.originalUser.username}).then(function(user) {
            var previous = angular.copy(this.originalUser);
            delete this.originalUser.isNew;
            angular.merge(this.originalUser, user);
            this.onSave({$user: this.originalUser, $previous: previous});
            this.prepareUser(user);
            this.resetForm();
        }.bind(this), function(response) {
            console.log(response);
            // handle validation errors
        });
    }
};

UserEditorController.prototype.revert = function() {
    this.user = angular.copy(this.originalUser);
    this.prepareUser(this.user);
    this.resetForm();
};

UserEditorController.prototype.remove = function() {
    this.originalUser.$delete().then(function(user) {
        this.user = null;
        this.originalUser = null;
        this.resetForm();
        this.onDelete({$user: user});
    }.bind(this), function(response) {
        console.log(response);
        // handle validation errors
    });
};

UserEditorController.prototype.showMessages = function(field) {
    return this.userForm[field].$invalid && (this.userForm[field].$touched || this.userForm.$submitted);
};

UserEditorController.prototype.sendTestEmail = function() {
};

UserEditorController.prototype.regExpEscape = function(s) {
    return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
};

return {
    controller: UserEditorController,
    templateUrl: require.toUrl('./userEditor.html'),
    bindings: {
        originalUser: '<?user',
        onSave: '&?',
        onDelete: '&?'
    }
};

}); // define
