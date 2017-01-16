/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

SystemSettingEditorController.$inject = ['SystemSettings'];
function SystemSettingEditorController(SystemSettings) {
    this.SystemSettings = SystemSettings;
}

SystemSettingEditorController.prototype.$onChanges = function(changes) {
    if (changes.key) {
        this.systemSetting = new this.SystemSettings(this.key);
        this.systemSetting.getValue();
    }
};

return {
    controller: SystemSettingEditorController,
    templateUrl: require.toUrl('./systemSettingEditor.html'),
    bindings: {
        key: '@',
        labelTr: '@'
    }
};

}); // define