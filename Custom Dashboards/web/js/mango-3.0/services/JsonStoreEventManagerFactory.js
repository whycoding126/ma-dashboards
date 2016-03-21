/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function JsonStoreEventManagerFactory(EventManager) {
    return new EventManager({
    	url: '/rest/v1/websocket/json-data'
    });
}

JsonStoreEventManagerFactory.$inject = ['EventManager'];
return JsonStoreEventManagerFactory;

}); // define
