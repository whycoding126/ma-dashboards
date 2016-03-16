/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['../EventManager'], function(EventManager) {
'use strict';

function PointEventManagerFactory(mangoBaseUrl) {
    return new EventManager({
    	url: '/rest/v1/websocket/point-value',
    	baseUrl: mangoBaseUrl
    });
}

PointEventManagerFactory.$inject = ['mangoBaseUrl'];
return PointEventManagerFactory;

}); // define
