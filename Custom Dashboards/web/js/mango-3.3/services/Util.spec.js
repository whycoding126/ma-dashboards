/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 * 
 * Mocha test spec, run "npm test" from the root directory to run test
 */

describe('Util service', function() {
    'use strict';

    var mochaConfig = require('../../../../web-test/mocha');
    var cleanupJsDom, injector, Util;
    
    before('Load maServices module', function(done) {
        cleanupJsDom = mochaConfig.initEnvironment();
        requirejs(['mango-3.3/maServices'], function(maServices) {
            done();
        });
    });
    
    after(function() {
        cleanupJsDom();
    });

    beforeEach(function() {
        injector = angular.injector(['ng', 'ngMock', 'maServices'], true);
        Util = injector.get('Util');
    });

    afterEach(function() {
        mochaConfig.cleanupInjector(injector);
    });

    describe('parseInternationalFloat()', function() {
        it('parses numbers with no thousands separators', function() {
            assert.equal(Util.parseInternationalFloat('1234567'), 1234567);
            assert.equal(Util.parseInternationalFloat('11234567'), 11234567);
            assert.equal(Util.parseInternationalFloat('111234567'), 111234567);
            assert.equal(Util.parseInternationalFloat('234567'), 234567);
            assert.equal(Util.parseInternationalFloat('1234'), 1234);
            assert.equal(Util.parseInternationalFloat('1234567.89'), 1234567.89);
            assert.equal(Util.parseInternationalFloat('11234567.89'), 11234567.89);
            assert.equal(Util.parseInternationalFloat('111234567.89'), 111234567.89);
            assert.equal(Util.parseInternationalFloat('1234567.891'), 1234567.891);
            assert.equal(Util.parseInternationalFloat('1234567.890'), 1234567.89);
            assert.equal(Util.parseInternationalFloat('123.891'), 123.891);
            assert.equal(Util.parseInternationalFloat('1234567.8'), 1234567.8);
            assert.equal(Util.parseInternationalFloat('1234567.0'), 1234567);
            assert.equal(Util.parseInternationalFloat('234567.89'), 234567.89);
            assert.equal(Util.parseInternationalFloat('1234.89'), 1234.89);
            assert.equal(Util.parseInternationalFloat('123.89'), 123.89);
            assert.equal(Util.parseInternationalFloat('12.89'), 12.89);
            assert.equal(Util.parseInternationalFloat('1.89'), 1.89);
        });
        
        it('parses numbers with comma thousands separators', function() {
            assert.equal(Util.parseInternationalFloat('1,234,567'), 1234567);
            assert.equal(Util.parseInternationalFloat('11,234,567'), 11234567);
            assert.equal(Util.parseInternationalFloat('111,234,567'), 111234567);
            assert.equal(Util.parseInternationalFloat('234,567'), 234567);
            assert.equal(Util.parseInternationalFloat('1,234'), 1234);
            assert.equal(Util.parseInternationalFloat('1,234,567.89'), 1234567.89);
            assert.equal(Util.parseInternationalFloat('11,234,567.89'), 11234567.89);
            assert.equal(Util.parseInternationalFloat('111,234,567.89'), 111234567.89);
            assert.equal(Util.parseInternationalFloat('1,234,567.891'), 1234567.891);
            assert.equal(Util.parseInternationalFloat('1,234,567.890'), 1234567.89);
            assert.equal(Util.parseInternationalFloat('1,234,567.8'), 1234567.8);
            assert.equal(Util.parseInternationalFloat('1,234,567.0'), 1234567);
            assert.equal(Util.parseInternationalFloat('234,567.89'), 234567.89);
            assert.equal(Util.parseInternationalFloat('1,234.89'), 1234.89);
        });
    });
});
