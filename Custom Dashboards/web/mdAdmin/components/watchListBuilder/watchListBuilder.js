/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

var watchListBuilder = function watchListBuilder(Point, cssInjector) {
    cssInjector.injectLink(require.toUrl('./watchListBuilder.css'), 'watchListBuilder');
    
    this.query = {
        limit: 10,
        page: 1,
        order: 'name',
        rql: ''
    };
    this.selectedOptions = {
        limit: 10,
        page: 1,
        order: 'name'
    };
    
    this.showSearch = false;
    this.selectedPoints = [];
    this.queryProperties = [
        {
            label: 'Point name',
            value: 'name'
        },
        {
            label: 'Device name',
            value: 'deviceName'
        },
        {
            label: 'Data source name',
            value: 'dataSourceName'
        },
        {
            label: 'XID',
            value: 'xid'
        }
    ];
    
    this.$onInit = function() {
        this.doQuery();
    };
    
    this.$postLink = function() {
    };

    this.doQuery = function doQuery() {
        this.queryPromise = Point.objQuery({
            query: this.query.rql,
            sort: this.query.order,
            limit: this.query.limit,
            start: (this.query.page - 1) * this.query.limit
        }).$promise.then(function(allPoints) {
            this.allPoints = allPoints;
        }.bind(this));
    }.bind(this);
};

watchListBuilder.$inject = ['Point', 'cssInjector'];

return {
    controller: watchListBuilder,
    templateUrl: require.toUrl('./watchListBuilder.html')
};

}); // define
