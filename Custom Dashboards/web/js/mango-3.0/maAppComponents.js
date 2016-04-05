/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['./services/errorInterceptor',
        './services/rQ',
        'angular'
], function(errorInterceptor, rQ, angular) {
'use strict';

var maAppComponents = angular.module('maAppComponents', []);

maAppComponents.factory('errorInterceptor', errorInterceptor);
maAppComponents.factory('rQ', rQ);
maAppComponents.constant('require', require);

return maAppComponents;

}); // require
