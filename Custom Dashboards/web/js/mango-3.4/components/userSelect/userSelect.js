/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

UserSelectController.$inject = ['User'];
function UserSelectController(User) {
    this.User = User;
}

UserSelectController.prototype.$onInit = function() {
    var $ctrl = this;
    this.ngModelCtrl.$render = function() {
        $ctrl.selectedUser = this.$viewValue;
    };
    this.users = this.User.query();
};

UserSelectController.prototype.selectUser = function(user) {
    this.ngModelCtrl.$setViewValue(user);
};

return {
    controller: UserSelectController,
    templateUrl: require.toUrl('./userSelect.html'),
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {},
    transclude: {
        label: '?maLabel'
    }
};

}); // define
