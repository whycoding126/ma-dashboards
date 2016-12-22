/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

accordionSection.$inject = [];
function accordionSection() {
    return {
        restrict: 'E',
        transclude: true,
        require: '?^^maAccordion',
        scope: {},
        template: '<div class="ma-slide-up" ng-if="accordionController.section[id]" ng-transclude></div>',
        link: function($scope, $element, $attrs, accordionController) {
            var id = $attrs.id;
            
            $scope.accordionController = accordionController;
            $scope.id = id;
            
            // jshint eqnull:true
            if ($attrs.maAccordionOpen != null) {
                accordionController.open(id);
            }
        }
    };
}

return accordionSection;

}); // define
