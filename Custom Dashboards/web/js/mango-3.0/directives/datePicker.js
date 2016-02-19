/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require', 'jquery', 'jquery-ui/jquery.datetimepicker'], function(require, $) {
'use strict';

function datePicker() {
    return {
        restrict: 'A',
        scope: {
        },
        link: function ($scope, $element, attributes) {
        	if ($('#datetimpicker-style').length === 0) {
        		var url = require.toUrl('jquery-ui/jquery.datetimepicker.css');
        		$('head').append('<link id="datetimpicker-style" rel="stylesheet" href="' + url + '"></link>');
        	}
        	
        	$element.datetimepicker();
        }
    };
}

return datePicker;

}); // define
