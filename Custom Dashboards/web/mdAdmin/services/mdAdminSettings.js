/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

mdAdminSettingsFactory.$inject = ['MD_ADMIN_SETTINGS', 'JsonStore', '$mdColors'];
function mdAdminSettingsFactory(MD_ADMIN_SETTINGS, JsonStore, $mdColors) {

    function MdAdminSettings() {
        angular.extend(this, MD_ADMIN_SETTINGS);
    }
    
    MdAdminSettings.prototype = {

    };
    
    return new MdAdminSettings();
}
return mdAdminSettingsFactory;

}); // define
