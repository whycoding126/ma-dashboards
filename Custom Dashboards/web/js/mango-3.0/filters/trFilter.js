/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

/*
 * The translate filter cannot asynchronously load the translation namespace and display the translation.
 * Translation namespace must be loaded into Globalize prior to filter being run.
 */
function trFilter(Translate) {
    return function(key) {
    	var args = Array.prototype.slice.call(arguments, 1);
    	var text;
    	try {
        	text = Translate.trSync(key, args);
    	} catch (e) {
    		text = '!!' + key + '!!';
    	}
    	return text;
    };
}

trFilter.$inject = ['Translate'];
return trFilter;

}); // define
