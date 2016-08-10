/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'jquery'], function(angular, $) {
'use strict';
/**
* @ngdoc service
* @name maServices.User
*
* @description
* REPLACE
*
* # Usage
*
* <pre prettyprint-mode="javascript">
    REPLACE
* </pre>
*/

/**
* @ngdoc method
* @methodOf maServices.User
* @name REPLACE
*
* @description
* REPLACE
*
*/
/*
 * Provides service for getting list of users and create, update, delete
 */
function UserFactory($resource, $cacheFactory) {
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
                },
                logout: function(config) {
            		var logout = config.params.logout;
            		delete config.params.logout;
                    return !!logout;
                }
            },
            isArray: false,
            withCredentials: true,
            cache: false
        }
    });
    
    // replace the login function with one which caches the login credentials
    var origLogin = User.login;
    User.login = function login(params) {
        this.username = params.username;
        this.password = params.password;
        return origLogin.apply(this, arguments);
    };
    
    User.cachedLogin = function cachedLogin() {
        var params = {
            username: this.username,
            password: this.password
        };
        return this.login.call(this, params);
    };
    
    User.clearCredentialCache = function clearCredentialCache() {
        delete this.username;
        delete this.password;
    };

    User.invalidateCache = function() {
        $cacheFactory.get('$http').remove('/rest/v1/users/current');
    };

    User.prototype.hasPermission = function(desiredPerms) {
        if (this.admin || !desiredPerms) return true;
        if (!this.permissions) return false;

        if (typeof desiredPerms === 'string') {
            desiredPerms = desiredPerms.split(',');
        }

        var userPerms = this.permissions.split(',');
        for (var i = userPerms.length - 1; i >= 0; i--) {
            var userPerm = userPerms[i].trim();
            if (userPerm) {
                userPerms[i] = userPerm;
            } else {
                userPerms.splice(i, 1);
            }
        }

        for (i = 0; i < desiredPerms.length; i++) {
            var desiredPerm = desiredPerms[i].trim();
            if (!desiredPerm) continue;
            if ($.inArray(desiredPerm, userPerms) > -1)
            	return true;
        }

        return false;
    };

    User.prototype.getTimezone = function() {
        return this.timezone || this.systemTimezone;
    };

    return User;
}

UserFactory.$inject = ['$resource', '$cacheFactory'];
return UserFactory;

}); // define
