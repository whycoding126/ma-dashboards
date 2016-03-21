/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function PointEventManagerFactory(EventManager) {
    return new EventManager({
    	url: '/rest/v1/websocket/point-value'
    });
}

PointEventManagerFactory.$inject = ['EventManager'];
return PointEventManagerFactory;

}); // define
