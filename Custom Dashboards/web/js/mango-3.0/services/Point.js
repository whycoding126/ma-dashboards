/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

/*
 * Provides service for getting list of points and create, update, delete
 */
function PointFactory($resource, $http) {
    var Point = $resource('/rest/v1/data-points/:xid', {
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
            url: '/rest/v1/data-points/by-id/:id',
            method: 'GET',
            isArray: false,
            withCredentials: true,
            cache: true
        }
    });

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
    				color: textRenderer.oneColour,
    				text: textRenderer.oneText
    			},
    			'false': {
    				color: textRenderer.zeroColour,
    				text: textRenderer.zeroText
    			}
    		};
    	}
    	
    	return this._rendererMap;
    };
    
    Point.prototype.valueRenderer = function(value) {
    	var rendererMap = this.rendererMap();
    	if (rendererMap) return rendererMap[value];
    };
    
    return Point;
}

PointFactory.$inject = ['$resource', '$http'];
return PointFactory;

}); // define
