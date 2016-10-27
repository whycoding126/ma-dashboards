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
    var cleanupJsDom, injector, Point, $timeout, $q, $rootScope;

    before('Load maServices module', function(done) {
        cleanupJsDom = mochaConfig.initEnvironment('http://localhost:8080');
        
        requirejs(['mango-3.3/maServices'], function(maServices) {
            angular.module('PointMockModule', ['maServices', 'ngMockE2E'])
                .constant('mangoBaseUrl', 'http://localhost:8080')
                .constant('mangoTimeout', 5000)
                .config(['$httpProvider', '$exceptionHandlerProvider', function($httpProvider, $exceptionHandlerProvider) {
                    $httpProvider.interceptors.push('mangoHttpInterceptor');
                    $exceptionHandlerProvider.mode('log');
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

    beforeEach(function(done) {
        injector = angular.injector(['ng', 'ngMock', 'PointMockModule'], true);
        Point = injector.get('Point');
        $timeout = injector.get('$timeout');
        $q = injector.get('$q');
        $rootScope = injector.get('$rootScope');

        injector.get('User')
        .login({username: 'admin', password: 'admin'}).$promise
        .then(function() {
            done();
        }, function() {
            done(new Error('Invalid credentials, couldn\'t log in'));
        });
        
        $rootScope.$digest();
    });
    
    afterEach(function() {
        mochaConfig.cleanupInjector(injector);
    });

    it('/GET point via xid', function() {
        var promise = Point.get({xid: 'voltage'}).$promise
        .then(function(response) {
            assert.equal(response.xid, 'voltage');
        }, function(error) {
            throw new Error(error.statusText);
        });
        /*
        if (!$rootScope.$$phase)
            $rootScope.$digest();
        */
        return promise;
    });
    
    it('/GET non-existing point via xid', function() {
        var promise = Point.get({xid: '003a5f46-b239-4bf4-9a8a-d71643f282db'}).$promise
        .then(function() {
            throw new Error('Shouldn\'t get a point for a random XID');
        }, function(response) {
            assert.equal(response.status, 404);
            return $q.when();
        });
        /*
        if (!$rootScope.$$phase)
            $rootScope.$digest();
        */
        return promise;
    });
});
