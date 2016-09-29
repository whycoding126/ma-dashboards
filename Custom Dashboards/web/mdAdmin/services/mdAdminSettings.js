/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

mdAdminSettingsFactory.$inject = ['MD_ADMIN_SETTINGS', 'JsonStore', '$mdTheming'];
function mdAdminSettingsFactory(MD_ADMIN_SETTINGS, JsonStore, $mdTheming) {

    function MdAdminSettings() {
        angular.extend(this, MD_ADMIN_SETTINGS);
        this.registeredThemes = $mdTheming.THEMES;
        this.registeredPalettes = $mdTheming.PALETTES;
    }
    
    MdAdminSettings.prototype = {

    };
    
    return new MdAdminSettings();
}
return mdAdminSettingsFactory;

}); // define
