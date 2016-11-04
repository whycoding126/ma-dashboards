/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

describe.only('Point values service', function() {
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

    it('gets latest 10 numeric point values', runDigestAfter(function() {
        return pointValues.getPointValuesForXid('voltage', {latest: 10}).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 10);
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets last 5 minutes of numeric point values', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 5 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert(pointValues.length >= 59 && pointValues.length <= 60, 'should return 59-60 point values'); // 5 second polling rate
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets last 5 minutes of numeric point values, rollup to 1 minute averages', runDigestAfter(function() {
        var to = new Date();
        to = new Date(to.valueOf() - to.valueOf() % 60000 + 1);
        var from = new Date(to.valueOf() - 5 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to,
            rollup: 'AVERAGE',
            rollupInterval: '1 minutes'
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 6);
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
                assert.equal(pointValue.timestamp % 60000, 0);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets last 5 minutes of numeric point values, rollup to 1 minute averages, exact minute boundaries', runDigestAfter(function() {
        var to = new Date();
        to = new Date(to.valueOf() - to.valueOf() % 60000);
        var from = new Date(to.valueOf() - 5 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to,
            rollup: 'AVERAGE',
            rollupInterval: 1,
            rollupIntervalType: 'MINUTES'
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.equal(pointValues.length, 5);
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
                assert.equal(pointValue.timestamp % 60000, 0);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets last 1 minute of multistate point values', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 1 * 60 * 1000);
        return pointValues.getPointValuesForXid('multistate', {
            from: from,
            to: to
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert(pointValues.length >= 11 && pointValues.length <= 12, 'should return 11 or 12 values');
            angular.forEach(pointValues, function(pointValue) {
                checkNumericPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets last 1 minute of binary point values', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 1 * 60 * 1000);
        return pointValues.getPointValuesForXid('binary', {
            from: from,
            to: to
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert(pointValues.length >= 11 && pointValues.length <= 12, 'should return 11 or 12 values');
            angular.forEach(pointValues, function(pointValue) {
                checkBooleanPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets rendered values for numeric points', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 1 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to,
            rollup: 'NONE',
            rendered: true
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.isAbove(pointValues.length, 0);
            angular.forEach(pointValues, function(pointValue) {
                checkStringPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets rendered values for multistate points', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 1 * 60 * 1000);
        return pointValues.getPointValuesForXid('multistate', {
            from: from,
            to: to,
            rollup: 'NONE',
            rendered: true
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.isAbove(pointValues.length, 0);
            angular.forEach(pointValues, function(pointValue) {
                checkStringPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('gets rendered values for binary points', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 1 * 60 * 1000);
        return pointValues.getPointValuesForXid('binary', {
            from: from,
            to: to,
            rollup: 'NONE',
            rendered: true
        }).then(function(pointValues) {
            assert.isArray(pointValues);
            assert.isAbove(pointValues.length, 0);
            angular.forEach(pointValues, function(pointValue) {
                checkStringPointValue(pointValue);
            });
        }, Util.throwHttpError);
    }));
    
    it('rejects negative rollup intervals', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 5 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to,
            rollup: 'AVERAGE',
            rollupInterval: -1,
            rollupIntervalType: 'MINUTES'
        }).then(function(pointValues) {
            throw new Error('Got successful response for negative rollup interval');
        }, function(error) {
            assert.instanceOf(error, Error);
            // consume error
        });
    }));
    
    it('rejects zero rollup intervals', runDigestAfter(function() {
        var to = new Date();
        var from = new Date(to.valueOf() - 5 * 60 * 1000);
        return pointValues.getPointValuesForXid('voltage', {
            from: from,
            to: to,
            rollup: 'AVERAGE',
            rollupInterval: 0,
            rollupIntervalType: 'MINUTES'
        }).then(function(pointValues) {
            throw new Error('Got successful response for zero rollup interval');
        }, function(error) {
            assert.instanceOf(error, Error);
            // consume error
        });
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
        assert.isNumber(pointValue.value);
        assert.isNumber(pointValue.timestamp);
        assert.property(pointValue, 'annotation');
        if (pointValue.annotation != null) {
            assert.isString(pointValue.annotation);
        }
    }
    
    function checkStringPointValue(pointValue) {
        assert.isString(pointValue.value);
        assert.isNumber(pointValue.timestamp);
        assert.property(pointValue, 'annotation');
        if (pointValue.annotation != null) {
            assert.isString(pointValue.annotation);
        }
    }
    
    function checkBooleanPointValue(pointValue) {
        assert.isBoolean(pointValue.value);
        assert.isNumber(pointValue.timestamp);
        assert.property(pointValue, 'annotation');
        if (pointValue.annotation != null) {
            assert.isString(pointValue.annotation);
        }
    }
});
