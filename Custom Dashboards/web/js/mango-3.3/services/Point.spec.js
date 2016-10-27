/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

require('../../../../web-test/mocha');

describe('Point service', function() {
    'use strict';
    
    var Point, $rootScope;
    
    beforeEach(function(done) {
        requirejs(['mango-3.3/maServices'], function(maServices) {
            angular.module('testPoint', ['maServices']).constant('mangoBaseUrl', 'http://localhost:8080/');
            var injector = angular.injector(['testPoint'], true);
            Point = injector.get('Point');
            $rootScope = injector.get('$rootScope');
            done();
        });
    });
    
    afterEach(function() {
        $rootScope.$destroy();
    });

    it('/GET point via xid', function(done) {
        Point.get({xid: 'voltage'}).$promise.then(function() {
            // TODO verify point
            done();
        }, function() {
            throw new Error('Point could not be retrieved');
        });
        $rootScope.$apply();
    });
    
    it('/GET non-existing point via xid', function(done) {
        Point.get({xid: '003a5f46-b239-4bf4-9a8a-d71643f282db'}).$promise.then(function() {
            throw new Error('Got point for XID which should not exist');
        }, function() {
            // TODO verify error response
            done();
        });
        $rootScope.$apply();
    });
});
