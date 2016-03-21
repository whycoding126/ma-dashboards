/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

(function(root) {
'use strict';

var requireBaseUrlSet = false;
var i, connectionElement, mangoConnection;

var connectionElements = document.querySelectorAll("[ma-connection], ma-connection");
for (i = 0; i < connectionElements.length; i++) {
	connectionElement = connectionElements[i];
	mangoConnection = {};
	
	mangoConnection.baseUrl = connectionElement.getAttribute('server-url') ||
		connectionElement.getAttribute('ma-connection') || '';

	if (!requireBaseUrlSet) {
		requireBaseUrlSet = true;
		var requireBaseUrl = require.toUrl('');
		require.config({
		    baseUrl: mangoConnection.baseUrl + requireBaseUrl
		});
	}
	
	mangoConnection.username = connectionElement.getAttribute('username');
	mangoConnection.password = connectionElement.getAttribute('password');
	var timeout = connectionElement.getAttribute('timeout');
	if (timeout) {
		mangoConnection.timeout = parseInt(timeout, 10);
	}
	var watchdogTimeout = connectionElement.getAttribute('watchdog-timeout');
	if (watchdogTimeout) {
		mangoConnection.watchdogTimeout = parseInt(watchdogTimeout, 10);
	}
	var logout = connectionElement.getAttribute('logout');
	mangoConnection.logout = logout === null ? false : true;
	
	connectionElement.mangoConnection = mangoConnection;
}

define(['angular', './maDashboardApp'], function(angular, maDashboardApp) {
	if (!connectionElements.length) {
		doBootstrap(document.documentElement, 'maDashboardApp');
		return;
	}
	
	var defaultConnection = maDashboardApp.constant('mangoConnection');
	
	for (i = 0; i < connectionElements.length; i++) {
		connectionElement = connectionElements[i];
		mangoConnection = connectionElement.mangoConnection;
		delete connectionElement.mangoConnection;
		
		var appName = 'maDashboardApp' + i;
		var app = angular.module(appName, ['maDashboardApp']);
		
		if (mangoConnection.baseUrl)
			app.constant('mangoBaseUrl', mangoConnection.baseUrl);
		if (mangoConnection.username)
			app.constant('mangoUsername', mangoConnection.username);
		if (mangoConnection.password)
			app.constant('mangoPassword', mangoConnection.password);
		if (mangoConnection.logout)
			app.constant('mangoLogout', mangoConnection.logout);
		if (mangoConnection.timeout)
			app.constant('mangoTimeout', mangoConnection.timeout);
		if (mangoConnection.watchdogTimeout)
			app.constant('mangoWatchdogTimeout', mangoConnection.watchdogTimeout);
		
		angular.element(document).ready(doBootstrap.bind(null, connectionElement, appName));
	}
	
	function doBootstrap(element, appName) {
		angular.bootstrap(element, [appName], {strictDi: true});
	}
	
}); // define

})(this); // root closure
