/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

describe('Point service', function() {
    'use strict';

    var mochaConfig = require('../../../../web-test/mocha');
    var cleanupJsDom, injector, Point, $timeout;

    before('Load maServices module', function(done) {
        cleanupJsDom = mochaConfig.initEnvironment('http://localhost:8080');
        
        requirejs(['mango-3.3/maServices'], function(maServices) {
            angular.module('PointMockModule', ['maServices', 'ngMockE2E'])
                .constant('mangoBaseUrl', 'http://localhost:8080')
                .constant('mangoTimeout', 5000)
                .config(['$httpProvider', function($httpProvider) {
                    $httpProvider.interceptors.push('mangoHttpInterceptor');
                }])
                .run(['$httpBackend', function($httpBackend) {
                    $httpBackend.whenGET(/.*/).passThrough();
                    $httpBackend.whenPUT(/.*/).passThrough();
                    $httpBackend.whenPOST(/.*/).passThrough();
                    $httpBackend.whenDELETE(/.*/).passThrough();
                }]);
            done();
        });
    });
    
    after(function() {
        cleanupJsDom();
    });

    beforeEach(function() {
        injector = angular.injector(['ng', 'ngMock', 'PointMockModule'], true);
        Point = injector.get('Point');
        $timeout = injector.get('$timeout');
        
        /*
        this.timeout(10000);
        injector.get('User').login({username: 'admin', password: 'admian'}).$promise.then(function() {
            done();
        }, function() {
            done(new Error());
        });
        */
    });
    
    afterEach(function() {
        mochaConfig.cleanupInjector(injector);
    });

    it('/GET point via xid', function(done) {
        this.timeout(10000);
        Point.get({xid: 'voltage'}).$promise.then(function() {
            // TODO verify point
            done();
        }, function(response) {
            done(new Error('Error retrieving point - ' + response.statusText));
        });
        $timeout.flush();
        //$rootScope.$apply();
    });
    
    it('/GET non-existing point via xid', function(done) {
        this.timeout(10000);
        Point.get({xid: '003a5f46-b239-4bf4-9a8a-d71643f282db'}).$promise.then(function(response) {
            done(new Error('Received success response when point should not exist - ' + response.statusText));
        }, function(response) {
            try {
                assert.equal(response.status, 404);
                done();
            } catch (e) {
                done(e);
            }
        }).then(null, function(e) {
            console.log(e);
            done(e);
        });
        $timeout.flush();
        //$rootScope.$apply();
    });
});
