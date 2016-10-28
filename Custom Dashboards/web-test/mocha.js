/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Sets up an environment for running mocha tests
 * 
 * This file should be required from *.spec.js files which can be run
 * via "npm test"
 */

module.exports = {};

try {
    module.exports.config = require('./config.json');
} catch (e) {
    module.exports.config = {};
}

if (module.exports.config.username == null)
    module.exports.config.username = 'admin';
if (module.exports.config.password == null)
    module.exports.config.password = 'admin';
if (module.exports.config.url == null)
    module.exports.config.url = 'http://localhost:8080';

// load requirejs as a global (node has a built in function called require)
global.requirejs = require('requirejs');

// set base URL to core and set node require function for fall back
requirejs.config({
    baseUrl: __dirname + '/../../../ma-core-public/Core/web/resources',
    nodeRequire: require,
    suppress: {
        nodeShim: true
    }
});
// the loaderConfig will use this as the dashboards path
requirejs.dashboardModulePath = __dirname + '/../web';

// load the dashboards loaderConfig.js so we can locate AMD modules
require('../web/js/loaderConfig.js');
// remove angular from paths so requirejs falls back to node require('angular')
requirejs.config({
    paths: {
        'angular': undefined
    }
});

//load the chai assertion library
global.chai = require('chai');
global.assert = chai.assert;

//load the sinon spying library
global.sinon = require('sinon');

var jsDomGlobal = require('jsdom-global');

module.exports.initEnvironment = function initEnvironment(url) {
  //sets up a virtual DOM and the window object
  var cleanupJsDom = url ? jsDomGlobal(undefined, {url: 'http://localhost:8080'}) : jsDomGlobal();

  // load angular mocks
  require('angular/angular');
  // put angular on global so doing require('angular') doesnt fail
  // angular/index.js tries to export angular not window.angular
  if (!global.angular)
      global.angular = window.angular;
  require('angular-mocks');
  
  return cleanupJsDom;
};

// see angular-mocks.js module.$$cleanup()
module.exports.cleanupInjector = function cleanupInjector(injector) {
    var $rootElement = injector.get('$rootElement');
    var rootNode = $rootElement && $rootElement[0];
    if (rootNode) {
        angular.element.cleanData([rootNode]);
    }
    
    var $rootScope = injector.get('$rootScope');
    if ($rootScope && $rootScope.$destroy) $rootScope.$destroy();
    
    // clean up jquery's fragment cache
    angular.forEach(angular.element.fragments, function(val, key) {
      delete angular.element.fragments[key];
    });

    angular.forEach(angular.callbacks, function(val, key) {
      delete angular.callbacks[key];
    });
    angular.callbacks.$$counter = 0;
};