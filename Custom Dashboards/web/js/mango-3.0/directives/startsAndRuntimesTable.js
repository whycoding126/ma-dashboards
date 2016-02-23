/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function startsAndRuntimesTable() {
    return {
        restrict: 'E',
        scope: {
        	startsAndRuntimes: '='
        },
        replace: true,
        templateUrl: require.toUrl('./startsAndRuntimesTable.html')
    };
}

return startsAndRuntimesTable;

}); // define
