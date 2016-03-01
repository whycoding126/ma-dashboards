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
            	var firstChild = $elem.contents().length && $elem.contents().get(0);
            	// if first child is a text node set the text value
                if (firstChild && firstChild.nodeType === 3) {
                	firstChild.nodeValue = text;
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
