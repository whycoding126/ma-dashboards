/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

describe('Point values service', function() {
    'use strict';

    var MochaUtils = require('../../../../web-test/mocha');
    var mochaUtils = new MochaUtils();
    var pointValues, Util;
    var runDigestAfter = mochaUtils.getRunDigestAfter();

    before('Load maServices module', function(done) {
        this.timeout(5000);
        
        requirejs(['mango-3.3/maServices'], function(maServices) {
            angular.module('mochaTestModule', ['maServices', 'ngMockE2E'])
                .constant('mangoBaseUrl', mochaUtils.config.url)
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
        
        mochaUtils.initEnvironment();
    });

    after('Clean up environment', function() {
        mochaUtils.cleanupEnvironment();
    });

    beforeEach('Get injector and dependencies', runDigestAfter(function() {
        var injector = angular.injector(['ng', 'ngMock', 'mochaTestModule'], true);
        mochaUtils.setInjector(injector);
        pointValues = injector.get('pointValues');
        Util = injector.get('Util');
        return mochaUtils.login();
    }));
    
    afterEach('Clean up injector', function() {
        mochaUtils.cleanupInjector();
    });

    it('gets latest 1 point value', runDigestAfter(function() {
        return pointValues.getPointValuesForXid('voltage', {latest: 1}).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 1);
            checkNumericPointValue(pointValues[0]);
        }, Util.throwHttpError);
    }));
    
    it('gets latest 10 point values', runDigestAfter(function() {
        return pointValues.getPointValuesForXid('voltage', {latest: 10}).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 10);
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
            });
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
    
    function checkNumericPointValue(pointValue) {
        assert.equal(pointValue.dataType, 'NUMERIC');
        assert.isNumber(pointValue.value);
        assert.isNumber(pointValue.timestamp);
        assert.property(pointValue, 'annotation');
        if (pointValue.annotation != null) {
            assert.isString(pointValue.annotation);
        }
    }
});
