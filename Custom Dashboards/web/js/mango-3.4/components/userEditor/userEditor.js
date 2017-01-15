/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UserEditorController.$inject = ['User', '$http', '$mdDialog', 'Translate'];
function UserEditorController(User, $http, $mdDialog, Translate) {
    this.User = User;
    this.$http = $http;
    this.timezones = moment.tz.names();
    this.$mdDialog = $mdDialog;
    this.Translate = Translate;
    
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
            
            // update the cached user if we are modifying our own user
            if (previous.username === this.User.current.username) {
                this.User.current = this.originalUser;
            }
            
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

UserEditorController.prototype.remove = function(event) {
    var $ctrl = this;
    
    var confirm = this.$mdDialog.confirm()
        .title(this.Translate.trSync('dashboards.v3.app.areYouSure'))
        .textContent(this.Translate.trSync('dashboards.v3.components.confirmDeleteUser'))
        .ariaLabel(this.Translate.trSync('dashboards.v3.app.areYouSure'))
        .targetEvent(event)
        .ok(this.Translate.trSync('common.ok'))
        .cancel(this.Translate.trSync('common.cancel'));

    this.$mdDialog.show(confirm).then(function() {
        $ctrl.originalUser.$delete().then(function(user) {
            $ctrl.user = null;
            $ctrl.originalUser = null;
            $ctrl.resetForm();
            $ctrl.onDelete({$user: user});
        }, function(response) {
            console.log(response);
            // handle validation errors
        });
    });
};

UserEditorController.prototype.showMessages = function(field) {
    return this.userForm[field].$invalid && (this.userForm[field].$touched || this.userForm.$submitted);
};

UserEditorController.prototype.sendTestEmail = function() {
    this.$http({
        url:'/rest/v1/server/email/test',
        params: {
            username: this.user.username,
            email: this.user.email
        },
        method: 'PUT',
        data: null,
        accept: 'application/json'
    });
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
