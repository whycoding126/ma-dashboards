/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

clearable.$inject = ['$compile'];
function clearable($compile) {
    return {
        restrict: 'A',
        require: 'mdAutocomplete',
        scope: false,
        link: function ($scope, $element, $attrs, $mdAutocompleteCtrl) {
            var wrapElement = $element.find('md-autocomplete-wrap');
            var template = '<md-button ng-if="(maClearable || maClearable==undefined) && $mdAutocompleteCtrl.scope.searchText && !$mdAutocompleteCtrl.isDisabled" class="md-icon-button" ng-click="$mdAutocompleteCtrl.clear($event)" aria-label="{{\'dashboards.v3.app.clear\' | tr}}"><md-icon>clear</md-icon></md-button>';
            
            var buttonScope = $scope.$new(false);
            buttonScope.$mdAutocompleteCtrl = $mdAutocompleteCtrl;
            var buttonElement = $compile(template)(buttonScope);
            wrapElement.append(buttonElement);
        }
    };
}

return clearable;

}); // define
