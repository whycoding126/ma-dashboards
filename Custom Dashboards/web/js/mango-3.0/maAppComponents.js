/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['./services/errorInterceptor',
        'angular'
], function(errorInterceptor, angular) {
'use strict';

var maAppComponents = angular.module('maAppComponents', []);

maAppComponents.factory('errorInterceptor', errorInterceptor);

return maAppComponents;

}); // require
