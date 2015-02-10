define(['mango/mangoApi'], function(mangoRest) {
"use strict";

var autologin = function(config) {
    if (typeof config.username === 'undefined') {
        config.username = 'guest';
    }
    if (typeof config.password === 'undefined') {
        config.password = '';
    }
    
    // login if not authenticated already
    var promise = mangoRest.login(config.username, config.password, false)
    .done(function(user) {
        if (config.mainScript) {
            require([config.mainScript]);
        }
        else if (config.redirectUrl) {
            window.location.href = config.redirectUrl;
        }
        else if (config.redirectToHome) {
            if (user.homeUrl) {
                window.location.href = user.homeUrl;
            }
            else {
                window.location.href = '/';
            }
        }
    });
    
    return promise;
};

return autologin;

}); // define
