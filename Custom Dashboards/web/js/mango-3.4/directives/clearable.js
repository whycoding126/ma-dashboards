/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

clearable.$inject = ['$compile', '$timeout'];
function clearable($compile, $timeout) {
    return {
        restrict: 'A',
        require: 'mdAutocomplete',
        scope: false,
        link: function ($scope, $element, $attrs, $mdAutocompleteCtrl) {
            var wrapElement = $element.find('md-autocomplete-wrap');
            var template = '<button ng-if="(maClearable || maClearable==undefined) && $mdAutocompleteCtrl.scope.searchText && !$mdAutocompleteCtrl.isDisabled" ng-click="clear()" aria-label="{{\'dashboards.v3.app.clear\' | tr}}"><md-icon>clear</md-icon></button>';
            
            var buttonScope = $scope.$new(false);
            buttonScope.$mdAutocompleteCtrl = $mdAutocompleteCtrl;
            buttonScope.clear = function() {
                $element.find('input').focus();
                $timeout(function() {
                    $mdAutocompleteCtrl.scope.searchText = '';
                },0)
            }
            
            var buttonElement = $compile(template)(buttonScope);
            wrapElement.append(buttonElement);
        }
    };
}

return clearable;

}); // define
