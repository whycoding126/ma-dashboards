/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['jquery'], function($) {
'use strict';

function maTr(Translate) {
    return {
        restrict: 'A',
        scope: {
            maTr: '@',
            maTrArgs: '=?'
        },
        link: function ($scope, $elem, $attrs) {
        	$scope.$watch(function() {
        		return [$scope.maTr, $scope.maTrArgs];
        	}, doTranslate, true);

            function doTranslate() {
	            Translate.tr($scope.maTr, $scope.maTrArgs || []).then(function(translation) {
	            	return {
	            		failed: false,
	            		text: translation
	            	};
	            }, function(error) {
	            	var result = {
	            		failed: true,
	            		text: '!!' + $scope.maTr + '!!'
	            	};
	            	return $.Deferred().resolve(result);
	            }).then(function(result) {
	            	var text = result.text;
	            	var tagName = $elem.prop('tagName');
	            	if (tagName === 'IMG') {
	            		$elem.attr('alt', text);
	            		return;
	            	} else if (tagName === 'INPUT') {
	            		$elem.attr('placeholder', text);
	            		return;
	            	}
	            	
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
        }
    };
}

maTr.$inject = ['Translate'];
return maTr;

}); // define
