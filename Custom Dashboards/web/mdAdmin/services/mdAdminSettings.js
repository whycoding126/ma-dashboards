/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

mdAdminSettingsFactory.$inject = ['MD_ADMIN_SETTINGS', 'JsonStore', '$mdTheming', '$MD_THEME_CSS', '$mdColors', 'cssInjector'];
function mdAdminSettingsFactory(MD_ADMIN_SETTINGS, JsonStore, $mdTheming, $MD_THEME_CSS, $mdColors, cssInjector) {
    var DASHBOARD_SETTINGS_XID = 'dashboard-settings';
    var NOT_SETTINGS_PROPERTIES = ['user', 'defaultSettings', 'userSettingsStore', 'theming', 'themingProvider', 'activeTheme'];
    var themeId = 0;
    var userThemeGenerated = false;
    
    function MdAdminSettings() {
        angular.extend(this, MD_ADMIN_SETTINGS);
        this.theming = $mdTheming;
        
        this.userSettingsStore = new JsonStore();
        this.userSettingsStore.name = DASHBOARD_SETTINGS_XID;
        this.userSettingsStore.xid = DASHBOARD_SETTINGS_XID;
        this.userSettingsStore.jsonData = this.initialSettings || {};
        this.userSettingsStore['public'] = true; // XXX
        this.userSettingsStore.readPermission = 'user';
        this.userSettingsStore.editPermission = 'superadmin';

        delete this.initialSettings;
    }

    MdAdminSettings.prototype = {
        save: function save() {
            var differences = deepDiff(this, this.defaultSettings, NOT_SETTINGS_PROPERTIES);
            this.userSettingsStore.jsonData = differences;
            return this.userSettingsStore.$save().then(function(store) {
                angular.merge(this, this.defaultSettings);
                angular.merge(this, store.jsonData);
                return store;
            }.bind(this));
        },
        get: function get() {
            return this.userSettingsStore.$get().then(function(store) {
                angular.merge(this, this.defaultSettings);
                angular.merge(this, store.jsonData);
                return store;
            }.bind(this));
        },
        reset: function() {
            angular.merge(this, this.defaultSettings);
            angular.merge(this, this.userSettingsStore.jsonData);
        },
        'delete': function reset() {
            return this.userSettingsStore.$delete();
        },
        generateTheme: function generateTheme() {
            var themeName = this.defaultTheme;
            var themeSettings = this.themes[themeName];

            // we want to dynamically update the userTheme, $mdTheming.generateTheme() will not re-generate
            // the style tags if it thinks it has already generated them though so work around it
            // by creating a new theme everytime
            var dynamicThemeName;
            if (themeName === 'userTheme') {
                if (userThemeGenerated) {
                    if (themeId > 0) {
                        var prevThemeName = 'dynamicTheme' + themeId;
                        delete this.theming.THEMES[prevThemeName];
                        angular.element('head > style[nonce="' + prevThemeName + '"]').remove();
                    }
                    dynamicThemeName = 'dynamicTheme' + ++themeId;
                    
                    var dynamicTheme = this.themeFromSettings(dynamicThemeName, themeSettings);
                    this.theming.THEMES[dynamicThemeName] = dynamicTheme;
                    
                    this.themingProvider.setNonce(dynamicThemeName);
                    $mdTheming.generateTheme(dynamicThemeName);

                    var theme = this.themeFromSettings('userTheme', themeSettings);
                    this.theming.THEMES.userTheme = theme;
                }
                userThemeGenerated = true;
            }
            
            this.themingProvider.setNonce(themeName);
            $mdTheming.generateTheme(themeName);
            this.activeTheme = dynamicThemeName || themeName;
            this.themingProvider.setDefaultTheme(this.activeTheme);
            this.theming.setBrowserColor({
                theme: this.activeTheme
            });
            this.generateCustomStyles();
        },
        themeFromSettings: function themeFromSettings(themeName, themeSettings) {
            var theme = this.themingProvider.theme(themeName);
            if (themeSettings.primaryPalette) {
                theme.primaryPalette(themeSettings.primaryPalette, themeSettings.primaryPaletteHues);
            }
            if (themeSettings.accentPalette) {
                theme.accentPalette(themeSettings.accentPalette, themeSettings.accentPaletteHues);
            }
            if (themeSettings.warnPalette) {
                theme.warnPalette(themeSettings.warnPalette, themeSettings.warnPaletteHues);
            }
            if (themeSettings.backgroundPalette) {
                theme.backgroundPalette(themeSettings.backgroundPalette, themeSettings.backgroundPaletteHues);
            }
            theme.dark(!!themeSettings.dark);
            return theme;
        },
        generateCustomStyles: function generateCustomStyles() {
            // inserts a style tag to style <a> tags with accent color
            if ($MD_THEME_CSS) {
                angular.element('head > style[tracking-name="hrefColors"]').remove();
                angular.element('head > style[tracking-name="mdTableColors"]').remove();
                
                var accent500 = $mdColors.getThemeColor(this.activeTheme + '-accent-500-1.0');
                var accent500Clear = $mdColors.getThemeColor(this.activeTheme + '-accent-500-0.2');
                var accent700 = $mdColors.getThemeColor(this.activeTheme + '-accent-700-1.0');
                var styleContent =
                    'a:not(.md-button) {color: ' + accent500 +'; border-bottom-color: ' + accent500Clear + ';}\n' +
                    'a:not(.md-button):hover, a:not(.md-button):focus {color: ' + accent700 + '; border-bottom-color: ' + accent700 + ';}\n';

                cssInjector.injectStyle(styleContent, 'hrefColors', '[md-theme-style]', false, true);

                var mdTableStyles = 'table.md-table.md-row-select tbody.md-body>tr.md-row.md-selected {\n' +
                    '  background-color: ' + $mdColors.getThemeColor(this.activeTheme + '-background-400-0.4') + ' !important;\n' +
                    '}\n\n' +
                    'table.md-table.md-row-select tbody.md-body>tr.md-row:not([disabled]):hover {\n' +
                    '  background-color: ' + $mdColors.getThemeColor(this.activeTheme + '-background-400-0.6') + ' !important;\n' +
                    '}\n';
                cssInjector.injectStyle(mdTableStyles, 'mdTableColors', '[href="styles/main.css"]', true, true);
            }
        }
    };
    
    function deepDiff(data, defaults, excludeFields) {
        var differences = {};
        for (var key in data) {
            if (excludeFields && excludeFields.indexOf(key) >= 0)
                continue;
            
            var fieldValue = data[key];
            var defaultValue = defaults && defaults[key];
            if (typeof fieldValue !== 'function' && !angular.equals(fieldValue, defaultValue)) {
                if (angular.isObject(fieldValue) && !angular.isArray(fieldValue)) {
                    differences[key] = deepDiff(fieldValue, defaultValue);
                } else {
                    differences[key] = fieldValue;
                }
            }
        }
        return differences;
    }
    
    return new MdAdminSettings();
}
return mdAdminSettingsFactory;

}); // define
