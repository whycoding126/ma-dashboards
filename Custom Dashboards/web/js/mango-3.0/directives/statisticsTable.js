/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

function statisticsTable() {
    return {
        restrict: 'E',
        scope: {
            statistics: '='
        },
        replace: true,
        templateUrl: require.toUrl('./statisticsTable.html')
    };
}

return statisticsTable;

}); // define
