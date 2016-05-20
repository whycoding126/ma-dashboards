/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var menuLink = function() {
    return {
        scope: {
            page: '='
        },
        templateUrl: require.toUrl('./menuLink.html')
    };
};

menuLink.$inject = [];

return menuLink;

}); // define
