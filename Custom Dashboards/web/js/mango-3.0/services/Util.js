/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular', 'moment-timezone'], function(angular, moment) {
'use strict';

function UtilFactory() {
	function Util() {}
	
	/**
	 * @return difference object
	 */
	Util.arrayDiff = function (newArray, oldArray) {
    	if (newArray === undefined) newArray = [];
    	if (oldArray === undefined) oldArray = [];
    	
    	var added = angular.element(newArray).not(oldArray);
    	var removed = angular.element(oldArray).not(newArray);

    	return {
    		added: added,
    		removed: removed,
    		changed: !!(added.length || removed.length)
    	};
    };
    
    /**
     * Converts input to a moment
     */
    Util.toMoment = function(input, now, format) {
        if (!input || input === 'now') return moment(now);
        if (typeof input === 'string') {
        	return moment(input, format || 'll LTS');
        }
        return moment(input);
    };

    /**
     * test for null, undefined or whitespace
     */ 
    Util.isEmpty = function(str) {
    	return !str || /^\s*$/.test(str);
    };

    /**
     * @return Number of keys in object starting with xxx
     */
    Util.numKeys = function(obj, start) {
    	var count = 0;
    	for (var key in obj) {
    		if (key.indexOf(start) === 0) count++;
    	}
    	return count;
    };
    
    return Util;
}

UtilFactory.$inject = [];
return UtilFactory;

}); // define
