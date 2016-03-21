/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

(function(window) {
'use strict';

contentLoaded(window, findMangoConnections);

function findMangoConnections() {

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

	define(['angular', './maDashboards'], function(angular, maDashboards) {
		if (!connectionElements.length) {
			doBootstrap(document.documentElement, 'maDashboards');
			return;
		}
		
		for (i = 0; i < connectionElements.length; i++) {
			connectionElement = connectionElements[i];
			mangoConnection = connectionElement.mangoConnection;
			delete connectionElement.mangoConnection;
			
			var appName = 'maDashboardsSubModule' + i;
			var app = angular.module(appName, ['maDashboards']);
			
			if (mangoConnection.baseUrl)
				app.constant('mangoBaseUrl', mangoConnection.baseUrl);
			if (mangoConnection.timeout)
				app.constant('mangoTimeout', mangoConnection.timeout);
			if (mangoConnection.watchdogTimeout)
				app.constant('mangoWatchdogTimeout', mangoConnection.watchdogTimeout);
			
			if (mangoConnection.username) {
				var injector = angular.injector([appName]);
				var User = injector.get('User');
				User.login({
					username: mangoConnection.username,
					password: mangoConnection.password,
					logout: mangoConnection.logout
				}).$promise.then(doBootstrap.bind(null, connectionElement, appName));
			} else {
				doBootstrap(connectionElement, appName);
			}
		}
		
		function doBootstrap(element, appName) {
			angular.bootstrap(element, [appName]);
		}
	}); // define
}

/**
 * DOMContentLoaded shim for old browsers
 * https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
 */
function contentLoaded(win, fn) {
	var done = false, top = true,

	doc = win.document,
	root = doc.documentElement,
	modern = doc.addEventListener,

	add = modern ? 'addEventListener' : 'attachEvent',
	rem = modern ? 'removeEventListener' : 'detachEvent',
	pre = modern ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (!modern && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}
}

})(this); // root closure
