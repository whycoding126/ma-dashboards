/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['require'], function(require) {
    'use strict';

    var watchListTable = function($mdMedia) {
        return {
            restrict: 'E',
            scope: {
                watchList: '=',
                to: '=',
                from: '=',
                selected: '=',
                rollupType: '=',
                rollupIntervalNumber: '=',
                rollupIntervalPeriod: '=',
                autoRollup: '=',
                clear: '&'
            },
            templateUrl: 'directives/watchList/watchListTable.html',
            link: function link(scope, element, attrs) {
                    scope.$mdMedia = $mdMedia;
                } // End Link
        }; // End return
    }; // End DDO

    watchListTable.$inject = ['$mdMedia'];

    return watchListTable;

}); // define