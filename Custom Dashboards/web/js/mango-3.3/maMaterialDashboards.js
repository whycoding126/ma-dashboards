/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular',
        './maDashboards',
        './components/colorPreview/colorPreview',
        'angular-material',
        'mdPickers',
        'angular-material-data-table'], function(angular, maDashboards, colorPreview) {
'use strict';

var maMaterialDashboards = angular.module('maMaterialDashboards', ['maDashboards', 'ngMaterial', 'mdPickers', 'md.data.table']);
maDashboards.component('maColorPreview', colorPreview);
return maMaterialDashboards;

}); // define
