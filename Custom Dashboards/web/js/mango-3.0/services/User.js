/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'jquery'], function(angular, $) {
'use strict';

/*
 * Provides service for getting list of users and create, update, delete
 */
function UserFactory($resource) {
    var User = $resource('/rest/v1/users/:xid', {
    		xid: '@xid'
    	}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data, fn, code) {
                if (code < 300) {
                    return angular.fromJson(data).items;
                }
                return [];
            },
            withCredentials: true,
            cache: true
        },
        rql: {
        	url: '/rest/v1/users?:query',
            method: 'GET',
            isArray: true,
            transformResponse: function(data, fn, code) {
                if (code < 300) {
                    return angular.fromJson(data).items;
                }
                return [];
            },
            withCredentials: true,
            cache: true
        },
        getById: {
            url: '/rest/v1/users/by-id/:id',
            method: 'GET',
            isArray: false,
            withCredentials: true,
            cache: true
        },
        current: {
            url: '/rest/v1/users/current',
            method: 'GET',
            isArray: false,
            withCredentials: true,
            cache: true
        },
        login: {
            url: '/rest/v1/login/:username',
            method: 'GET',
            headers: {
            	password: function(config) {
            		var password = config.params.password;
            		delete config.params.password;
                    return password;
                }
            },
            isArray: false,
            withCredentials: true,
            cache: false
        }
    });
    
    User.prototype.hasPermission = function(desiredPerms) {
        if (this.admin) return true;
        
        if (typeof desiredPerms === 'string') {
            desiredPerms = desiredPerms.split(',');
        }
        var userPerms = this.permissions.split(',');
        
        for (var i = 0; i < desiredPerms.length; i++) {
            if ($.inArray(desiredPerms[i], userPerms) > -1)
            	return true;
        }
        
        return false;
    };

    return User;
}

UserFactory.$inject = ['$resource'];
return UserFactory;

}); // define
