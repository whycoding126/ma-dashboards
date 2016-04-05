/**
 * Copyright (C) 2016 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
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
