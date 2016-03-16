/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['../EventManager'], function(EventManager) {
'use strict';

function JsonStoreEventManagerFactory(mangoBaseUrl) {
    return new EventManager({
    	url: '/rest/v1/websocket/json-data',
    	baseUrl: mangoBaseUrl
    });
}

JsonStoreEventManagerFactory.$inject = ['mangoBaseUrl'];
return JsonStoreEventManagerFactory;

}); // define
