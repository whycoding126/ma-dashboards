/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

describe('Point values service', function() {
    'use strict';

    var mochaConfig = require('../../../../web-test/mocha');
    var cleanupJsDom, injector, $q, $rootScope, user, pointValues, Util;

    // angular promises only resolve on digest, and http requests are only flushed on digest
    // so we have to run the digest loop after each test
    function runDigestAfter(fn) {
        return function() {
            var result = fn.apply(this, arguments);
            if (!$rootScope.$$phase)
                $rootScope.$digest();
            return result;
        };
    };

    before('Load maServices module', function(done) {
        cleanupJsDom = mochaConfig.initEnvironment(mochaConfig.config.url);
        
        requirejs(['mango-3.3/maServices'], function(maServices) {
            angular.module('mochaTestModule', ['maServices', 'ngMockE2E'])
                .constant('mangoBaseUrl', mochaConfig.config.url)
                .constant('mangoTimeout', 0)
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

    after('Clean up environment', function() {
        cleanupJsDom();
    });

    beforeEach('Get injector and dependencies', runDigestAfter(function() {
        injector = angular.injector(['ng', 'ngMock', 'mochaTestModule'], true);
        $q = injector.get('$q');
        $rootScope = injector.get('$rootScope');
        pointValues = injector.get('pointValues');
        Util = injector.get('Util');

        if (!user) {
            return injector.get('User').login({
                username: mochaConfig.config.username,
                password: mochaConfig.config.password
            }).$promise.then(function(_user) {
                user = _user;
            }, function(error) {
                throw new Error(error.status + ' - ' + error.statusText + ' - Invalid credentials, couldn\'t log in');
            });
        }
    }));
    
    afterEach('Clean up injector', function() {
        mochaConfig.cleanupInjector(injector);
    });

    it('gets latest 1 point value', runDigestAfter(function() {
        return pointValues.getPointValuesForXid('voltage', {latest: 1}).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 1);
            assert.equal(pointValues[0].dataType, 'NUMERIC');
            assert.isNumber(pointValues[0].value);
            assert.isNumber(pointValues[0].timestamp);
            assert.property(pointValues[0], 'annotation');
            if (pointValues[0].annotation != null) {
                assert.isString(pointValues[0].annotation);
            }
        }, Util.throwHttpError);
    }));
    
    it('cancels requests successfully', runDigestAfter(function() {
        var promise = pointValues.getPointValuesForXid('voltage', {latest: 1}).then(function(pointValues) {
            throw new Error('Got response from server, request should have been cancelled');
        }, function(error) {
            assert.equal(error.status, -1);
        });
        promise.cancel();
        return promise;
    }));
});
