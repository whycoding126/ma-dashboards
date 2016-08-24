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
                data: '@',
                to: '=',
                from: '=',
                selected: '=',
                rollupType: '=',
                rollupIntervalNumber: '=',
                rollupIntervalPeriod: '=',
                autoRollup: '='
            },
            templateUrl: 'directives/watchList/watchListTable.html',
            link: function link(scope, element, attrs) {
                    scope.page.searchQuery = "xid=like=*" + scope.data + "*";
                    scope.$mdMedia = $mdMedia;
                    
                    if ($mdMedia('gt-sm')) {
                        scope.page.myLimit = 15;
                    }
                    else {
                        scope.page.myLimit = 5;
                    }
                } // End Link
        }; // End return
    }; // End DDO

    watchListTable.$inject = ['$mdMedia'];

    return watchListTable;

}); // define