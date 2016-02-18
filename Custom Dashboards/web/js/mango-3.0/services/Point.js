/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', '../api'], function(angular, MangoAPI) {
'use strict';

/*
 * Provides service for getting list of points and create, update, delete
 */
function PointFactory($resource) {
    var baseUrl = MangoAPI.defaultApi.baseUrl;
    var Point = $resource(baseUrl + '/rest/v1/data-points/:xid', {
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
        	url: '/rest/v1/data-points?:query',
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
            url: baseUrl + '/rest/v1/data-points/by-id/:id',
            method: 'GET',
            isArray: false,
            withCredentials: true,
            cache: true
        }
    });

    Point.prototype.setValue = function setValue(value, options) {
    	var dataType = this.pointLocator.dataType;
    	if (!value.value) {
    		if (dataType === 'NUMERIC') {
    			value = Number(value);
    		} else if (dataType === 'MULTISTATE') {
    			if (/^\d+$/.test(value)) {
    				value = parseInt(value, 10);
    			}
    		}
    		value = {
    		    value: value,
    		    dataType: dataType
    		};
    	}
    	return MangoAPI.defaultApi.putValue(this.xid, value, options);
    };
    
    return Point;
}

PointFactory.$inject = ['$resource'];
return PointFactory;

}); // define
