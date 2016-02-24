/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', './maDashboardApp'], function(angular) {
'use strict';

angular.element(document).ready(function() {
	var appElement = document.getElementById('ma-dashboard-app') || document.documentElement;
	angular.bootstrap(appElement, ['maDashboardApp']);
});

}); // require
