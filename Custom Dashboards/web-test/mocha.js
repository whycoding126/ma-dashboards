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

// sets up a virtual DOM and the window object
require('jsdom-global')();

// load the dashboards loaderConfig.js so we can locate AMD modules
require('../web/js/loaderConfig.js');
// remove angular from paths so requirejs falls back to node require('angular')
requirejs.config({
    paths: {
        'angular': undefined
    }
});

// load the chai assertion library
global.chai = require('chai');
global.assert = chai.assert;

// load the sinon spying library
global.sinon = require('sinon');

// needed to get angular-mocks to create module and inject functions
window.mocha = true;
window.beforeEach = beforeEach;
window.afterEach = afterEach;

// load angular mocks
require('angular/angular');
// put angular on global so doing require('angular') doesnt fail
// angular/index.js tries to export angular not window.angular
global.angular = window.angular;
require('angular-mocks');

global.mock = window.angular.mock;
