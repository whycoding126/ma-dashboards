/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['jquery'], function($) {
'use strict';

function maTr(translate) {
    return {
        restrict: 'A',
        scope: {
            maTr: '@',
            maTrArgs: '=?'
        },
        link: function ($scope, $elem, $attrs) {
            var text;
            var args = $scope.maTrArgs || [];
            
            translate($scope.maTr, args).then(function(translation) {
            	return translation;
            }, function(error) {
            	return $.Deferred().resolve('!!' + $scope.maTr + '!!');
            }).then(function(text) {
            	// if element is a text node set the text value
                if ($elem.get(0).nodeType === 3) {
                    $elem.get(0).nodeValue = text;
                } else {
                	// else prepend a text node to its children
                    $elem.prepend(document.createTextNode(text));
                }
            });
        }
    };
}

maTr.$inject = ['translate'];
return maTr;

}); // define
