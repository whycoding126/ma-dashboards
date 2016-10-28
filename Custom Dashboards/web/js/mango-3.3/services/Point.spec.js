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
    var cleanupJsDom, injector, Point, $q, $rootScope, user, query;
    var voltagePointId;
    
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
        
        requirejs(['mango-3.3/maServices', 'rql/query'], function(maServices, _query) {
            query = _query;
            
            angular.module('PointMockModule', ['maServices', 'ngMockE2E'])
                .constant('mangoBaseUrl', mochaConfig.config.url)
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

    after('Clean up environment', function() {
        cleanupJsDom();
    });

    beforeEach('Get injector and dependencies', runDigestAfter(function() {
        injector = angular.injector(['ng', 'ngMock', 'PointMockModule'], true);
        Point = injector.get('Point');
        $q = injector.get('$q');
        $rootScope = injector.get('$rootScope');

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

    it('Get point via XID', runDigestAfter(function() {
        var promise = Point.get({xid: 'voltage'}).$promise
        .then(function(point) {
            checkPoint(point);
            assert.equal(point.xid, 'voltage');
            assert.equal(point.name, 'Voltage');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
            voltagePointId = point.id;
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText);
        });
        return promise;
    }));
    
    it('Get point via ID', runDigestAfter(function() {
        var promise = Point.getById({id: voltagePointId}).$promise
        .then(function(point) {
            checkPoint(point);
            assert.equal(point.xid, 'voltage');
            assert.equal(point.id, voltagePointId);
            assert.equal(point.name, 'Voltage');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText);
        });
        return promise;
    }));

    it('Get non-existing point via XID', runDigestAfter(function() {
        var promise = Point.get({xid: '003a5f46-b239-4bf4-9a8a-d71643f282db'}).$promise
        .then(function() {
            throw new Error('Shouldn\'t get a point for a random XID');
        }, function(response) {
            assert.equal(response.status, 404);
            return $q.when();
        });
        return promise;
    }));

    it('Query for point on XID', runDigestAfter(function() {
        var q = new query.Query({name: 'eq', args: ['xid', 'voltage']});
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.equal(result.$total, 1);
            var point = result[0];
            checkPoint(point);
            assert.equal(point.xid, 'voltage');
            assert.equal(point.name, 'Voltage');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for point on ID', runDigestAfter(function() {
        var q = new query.Query({name: 'eq', args: ['id', voltagePointId]});
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.equal(result.$total, 1);
            var point = result[0];
            checkPoint(point);
            assert.equal(point.xid, 'voltage');
            assert.equal(point.id, voltagePointId);
            assert.equal(point.name, 'Voltage');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));

    it('Limit query to zero results', runDigestAfter(function() {
        var q = new query.Query()
            .eq('xid', 'voltage')
            .limit(0);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 0);
            assert.equal(result.$total, 1);
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Limit query to one and offset by one', runDigestAfter(function() {
        var q = new query.Query()
            .eq('xid', 'voltage')
            .limit(1, 1);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 0);
            assert.equal(result.$total, 1);
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source name', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceName', 'Dashboard Demo');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 5);
            assert.equal(result.$total, 5);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source xid', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 5);
            assert.equal(result.$total, 5);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));

    it('Query by data source name, limit and offset', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceName', 'Dashboard Demo')
            .limit(3, 2);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 3);
            assert.equal(result.$total, 5);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source name, offset so results are limited', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceName', 'Dashboard Demo')
            .limit(100, 3);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 2);
            assert.equal(result.$total, 5);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source name, offset so no results returned', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceName', 'Dashboard Demo')
            .limit(100, 10);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 0);
            assert.equal(result.$total, 5);
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source XID and device name', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'vmeters')
            .eq('deviceName', 'Meter 1');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 13);
            assert.equal(result.$total, 13);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source XID and multiple device names using IN', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'vmeters')
            ['in']('deviceName', 'Meter 1', 'Meter 2');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 26);
            assert.equal(result.$total, 26);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query by data source XID and multiple device names using OR', runDigestAfter(function() {
        var orPart = new query.Query()
            .eq('deviceName', 'Meter 1')
            .eq('deviceName', 'Meter 2');
        orPart.name = 'or';
        
        var q = new query.Query()
            .eq('dataSourceXid', 'vmeters')
            .push(orPart);
        
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 26);
            assert.equal(result.$total, 26);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query with root OR term', runDigestAfter(function() {
        var queryDs1 = new query.Query()
            .eq('dataSourceXid', 'vmeters')
            .eq('deviceName', 'Meter 1');

        var queryDs2 = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('name', 'Voltage');
        
        var q = new query.Query({name: 'or', args: [queryDs1, queryDs2]});
        
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 14);
            assert.equal(result.$total, 14);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query with root OR term and nested OR term', runDigestAfter(function() {
        var orPart = new query.Query()
            .eq('deviceName', 'Meter 1')
            .eq('deviceName', 'Meter 2');
        orPart.name = 'or';
        
        var queryDs1 = new query.Query()
            .eq('dataSourceXid', 'vmeters')
            .push(orPart);

        var queryDs2 = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('name', 'Voltage');
        
        var q = new query.Query({name: 'or', args: [queryDs1, queryDs2]});
        
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 27);
            assert.equal(result.$total, 27);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));

    it('Query for enabled points using \'Y\'', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', 'Y');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 4);
            assert.equal(result.$total, 4);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for enabled points using \'true\'', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', 'true');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 4);
            assert.equal(result.$total, 4);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for enabled points using true', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', true);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 4);
            assert.equal(result.$total, 4);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for enabled points using \'N\'', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', 'N');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.equal(result.$total, 1);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for enabled points using \'false\'', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', 'false');
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.equal(result.$total, 1);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for enabled points using false', runDigestAfter(function() {
        var q = new query.Query()
            .eq('dataSourceXid', 'DS_997094')
            .eq('enabled', false);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.equal(result.$total, 1);
            angular.forEach(result, function(point) {
                checkPoint(point);
            });
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));
    
    it('Query for points in root folder', runDigestAfter(function() {
        this.timeout(10000);
        var q = new query.Query()
            .eq('pointFolderId', 0)
            .limit(1);
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.isAbove(result.$total, 1);
            checkPoint(result[0]);
            assert.equal(result[0].pointFolderId, 0);
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText + ' - ' + q.toString());
        });
        return promise;
    }));

    it('Query on non-existing property', runDigestAfter(function() {
        var q = new query.Query({name: 'eq', args: ['xyz', 'blah']});
        var promise = Point.query({rqlQuery: q.toString()}).$promise
        .then(function(result) {
            throw new Error('Returned successful result for invalid query');
        }, function(error) {
            assert.equal(error.status, 500);
            assert.isObject(error.data);
            assert.equal(error.data.message, 'No column found for: xyz');
            assert.isString(error.data.stackTrace);
            return $q.when();
        });
        return promise;
    }));

    var createdPointXid;
    
    it('Create point', runDigestAfter(function() {
        var point = new Point();
        point.name = 'temporary test point';
        //point.xid = 'temp_test_point';
        point.dataSourceXid = 'DS_997094';
        point.deviceName = 'Dashboard Demo';
        point.pointLocator = {
            modelType: 'PL.VIRTUAL',
            changeType: 'NO_CHANGE',
            startValue: '0',
            dataType: 'BINARY'
        };
        
        return point.$save().then(function(point) {
            createdPointXid = point.xid;
            checkPoint(point);
            assert.equal(point.name, 'temporary test point');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceXid, 'DS_997094');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
            return Point.get({xid: createdPointXid}).$promise;
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText);
        });
    }));

    it('Delete created point', runDigestAfter(function() {
        if (!createdPointXid) {
            throw new Error('Can\'t perform test, point was not created');
        }
        return Point['delete']({xid: createdPointXid}).$promise.then(function(point) {
            checkPoint(point);
            assert.equal(point.name, 'temporary test point');
            assert.equal(point.deviceName, 'Dashboard Demo');
            assert.equal(point.dataSourceXid, 'DS_997094');
            assert.equal(point.dataSourceName, 'Dashboard Demo');
            return Point.get({xid: createdPointXid}).$promise;
        }, function(error) {
            throw new Error(error.status + ' - ' + error.statusText);
        }).then(function() {
            throw new Error('Retrieved point which should have been deleted');
        }, function(error) {
            assert.equal(error.status, 404);
            return $q.when();
        });
    }));

    function checkPoint(point) {
        assert.instanceOf(point, Point);
        assert.isBoolean(point.enabled);
        assert.property(point, 'templateXid');
        assert.isObject(point.loggingProperties);
        assert.isObject(point.textRenderer);
        assert.property(point, 'chartRenderer');
        assert.equal(point.modelType, 'DATA_POINT');
        assert.isArray(point.validationMessages);
        assert.lengthOf(point.validationMessages, 0);
        assert.isNumber(point.id);
        assert.isAtLeast(point.id, 0);
        assert.isNumber(point.dataSourceId);
        assert.isAtLeast(point.dataSourceId, 0);
        assert.isBoolean(point.useRenderedUnit);
        assert.isBoolean(point.useIntegralUnit);
        assert.isString(point.dataSourceName);
        assert.property(point, 'setPermission');
        if (point.setPermission != null) {
            assert.isString(point.setPermission);
        }
        assert.isString(point.chartColour);
        assert.isBoolean(point.purgeOverride);
        assert.isString(point.plotType);
        assert.isObject(point.purgePeriod);
        assert.isObject(point.pointLocator);
        assert.isString(point.deviceName);
        assert.property(point, 'readPermission');
        if (point.readPermission != null) {
            assert.isString(point.readPermission);
        }
        assert.isNumber(point.pointFolderId);
        assert.isAtLeast(point.pointFolderId, 0);
        assert.property(point, 'integralUnit');
        assert.property(point, 'unit');
        assert.isString(point.name);
        assert.isString(point.xid);
    }
});
