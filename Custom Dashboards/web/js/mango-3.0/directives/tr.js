/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['globalize', '../api'], function(Globalize, MangoAPI) {
'use strict';

function maTr() {
	var api = MangoAPI.defaultApi;
    return {
        restrict: 'A',
        scope: {
            maTr: '@',
            maTrArgs: '=?'
        },
        link: function ($scope, $elem, $attrs) {
            var text;
            var args = $scope.maTrArgs || [];
            api.setupGlobalize('common').then(function() {
	            try {
	            	text = Globalize.messageFormatter($scope.maTr).apply(Globalize, args);
	            } catch(error) {
	                text = '!!' + $scope.maTr + '!!';
	            }
	            
	            if ($elem.get(0).nodeType === 3) {
	                $elem.get(0).nodeValue = text;
	            } else {
	                $elem.prepend(document.createTextNode(text));
	            }
        	});
        }
    };
}

maTr.$inject = [];
return maTr;

}); // define
