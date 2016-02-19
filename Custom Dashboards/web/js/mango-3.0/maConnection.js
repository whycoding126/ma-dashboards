/**
 * Copyright (C) 2015 Delta Automation Pty Ltd. All rights reserved.
 * http://deltamation.com.au/
 * @author Jared Wiltshire
 */

(function(root) {
'use strict';

var connection = document.querySelector("ma-connection");

var baseUrl = connection.getAttribute('server-url') || '';
var requireBaseUrl = require.toUrl('');

var username = connection.getAttribute('username');
var password = connection.getAttribute('password');
var logout = connection.getAttribute('logout');
logout = logout === null ? false : true;

require.config({
    baseUrl: baseUrl + requireBaseUrl
});

require(['mango-3.0/api', 'jquery'], function(MangoAPI, $) {
	var api = MangoAPI.defaultApi = new MangoAPI({
        baseUrl: baseUrl
    });
    
	$(connection).data('api', api);
	
    if (username) {
    	api.login(username, password, logout).then(function() {
            require(['mango-3.0/bootstrap']);
        });
    } else {
        require(['mango-3.0/bootstrap']);
    }
});

})(this);
