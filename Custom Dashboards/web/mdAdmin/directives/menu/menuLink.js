'use strict';

angular.module('mdAdminApp').directive('menuLink', function() {
    return {
        scope: {
            page: '='
        },
        templateUrl: 'directives/menu/menuLink.html'
    };
});
