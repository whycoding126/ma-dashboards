/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

/*
 * Provides service for getting list of points and create, update, delete
 */
function PointFactory($resource, $http, $timeout, Util) {
    var Point = $resource('/rest/v1/data-points/:xid', {
    		xid: '@xid'
    	}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: Util.transformArrayResponse,
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: true
        },
        rql: {
        	url: '/rest/v1/data-points?:query',
            method: 'GET',
            isArray: true,
            transformResponse: Util.transformArrayResponse,
            interceptor: {
                response: Util.arrayResponseInterceptor
            },
            withCredentials: true,
            cache: true
        },
        getById: {
            url: '/rest/v1/data-points/by-id/:id',
            method: 'GET',
            isArray: false,
            withCredentials: true,
            cache: true
        }
    });
    
    Point.objQuery = function(options) {
        if (!options) return this.query();
        if (typeof options.query === 'string') {
            return this.rql({query: options.query});
        }

        var params = [];
        if (options.query) {
            var and = !!options.query.$and;
            var exact = !!options.query.$exact;
            delete options.query.$exact;
            delete options.query.$and;
            
            var parts = [];
            for (var key in options.query) {
                var val = options.query[key] || '';
                var comparison = '=';
                var autoLike = false;
                if (val.indexOf('=') < 0 && !exact) {
                    comparison += 'like=*';
                    autoLike = true;
                }
                parts.push(key + comparison + val + (autoLike ? '*': ''));
            }
            
            var queryPart;
            if (and || parts.length === 1) {
                queryPart = parts.join('&');
            } else {
                queryPart = 'or(' + parts.join(',') + ')';
            }
            params.push(queryPart);
        }
        
        if (options.sort) {
            var sort = options.sort;
            if (angular.isArray(sort)) {
                sort = sort.join(',');
            }
            params.push('sort(' + sort + ')');
        }
        
        if (options.limit) {
            var start = options.start || 0;
            params.push('limit(' + options.limit + ',' + start + ')');
        }
        
        return params.length ? this.rql({query: params.join('&')}) : this.query();
    };

    Point.prototype.setValue = function setValue(value, options) {
    	options = options || {};
    	
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
    	
    	var url = '/rest/v1/point-values/' + encodeURIComponent(this.xid);
    	return $http.put(url, value, {
    		params: {
    			'unitConversion': options.converted
    		}
    	});
    };
    
    Point.prototype.setValueResult = function(value, holdTimeout) {
        holdTimeout = holdTimeout || 3000;
        var result = {
            pending: true
        };
        this.setValue(value).then(function() {
            delete result.pending;
            result.success = true;
            $timeout(function() {
                delete result.success;
            }, holdTimeout);
        }, function(data) {
            delete result.pending;
            result.error = data;
            $timeout(function() {
                delete result.error;
            }, holdTimeout);
        });
        return result;
    };
    
    Point.prototype.toggleValue = function toggleValue() {
    	var dataType = this.pointLocator.dataType;
    	if (dataType === 'BINARY' && this.value !== undefined) {
    		this.setValue(!this.value);
		}
    };
    
    Point.prototype.valueFn = function(setValue) {
    	if (setValue === undefined) return this.value;
    	this.setValue(setValue);
    };
    
    Point.prototype.rendererMap = function() {
    	if (this._rendererMap) return this._rendererMap;
    	var textRenderer = this.textRenderer;
    	if (!textRenderer) return;
    	
    	if (textRenderer.multistateValues) {
    		this._rendererMap = {};
    		var multistateValues = textRenderer.multistateValues;
    		for (var i = 0; i < multistateValues.length; i++) {
    			var item = multistateValues[i];
    			item.color = item.colour;
    			this._rendererMap[item.key] = item;
    		}
    	} else if (textRenderer.type === 'textRendererBinary') {
    		this._rendererMap = {
    			'true': {
    			    key: true,
    				color: textRenderer.oneColour,
    				text: textRenderer.oneLabel
    			},
    			'false': {
    			    key: false,
    				color: textRenderer.zeroColour,
    				text: textRenderer.zeroLabel
    			}
    		};
    	}
    	
    	return this._rendererMap;
    };
    
    Point.prototype.valueRenderer = function(value) {
    	var rendererMap = this.rendererMap();
    	if (rendererMap) {
    	    var obj = rendererMap[value]; 
    	    if (obj) return obj;
    	}
    	return {text: value};
    };
    
    return Point;
}

PointFactory.$inject = ['$resource', '$http', '$timeout', 'Util'];
return PointFactory;

}); // define
