/**
 * Copyright (C) 2015 Delta Automation Pty Ltd. All rights reserved.
 * http://deltamation.com.au/
 * @author Jared Wiltshire
 */

(function(root) {
'use strict';

if (!document.registerElement) return;

var proto = Object.create(HTMLElement.prototype, {
    attachedCallback: {
        value:
            /**
             * Lifecycle callback that is invoked when this element is added to the
             * DOM.
             */
            function() {
            this.bootstrap();
        },
        enumerable: true
    },

    bootstrap: {
        value:
            function() {
            if (this.configured) return;
            
            var _this = this;
            var baseUrl = this.getAttribute('server-url') || '';
            var requireBaseUrl = require.toUrl('');
            
            var username = this.getAttribute('username');
            var password = this.getAttribute('password');
            var logout = this.getAttribute('logout');
            logout = logout === null ? false : true;
            
            require.config({
                baseUrl: baseUrl + requireBaseUrl
            });
            
            require(['mango-3.0/api'], function(MangoAPI) {
            	_this.api = MangoAPI.defaultApi = new MangoAPI({
                    baseUrl: baseUrl
                });
                
                if (username) {
                	_this.api.login(username, password, logout).then(function() {
                        require(['mango-3.0/bootstrap']);
                    });
                } else {
                    require(['mango-3.0/bootstrap']);
                }
            });
            
            this.configured = true;
        }
    }
});

document.registerElement('ma-connection', {prototype: proto});

})(this);
