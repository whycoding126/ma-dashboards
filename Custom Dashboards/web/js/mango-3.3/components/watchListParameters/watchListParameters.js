/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

watchListParametersController.$inject = [];
function watchListParametersController() {
    this.parameters = {};

    this.inputChanged = function inputChanged() {
        this.parametersChanged({parameters: this.parameters});
    };
    
    this.createDsQuery = function createDsQuery(options) {
        if (!(options.nameIsLike || options.xidIsLike)) {
            return;
        }
        var q = new query.Query();
        if (options.nameIsLike) {
            q.push(new query.Query({name: 'like', args: ['name', options.nameIsLike]}));
        }
        if (options.xidIsLike) {
            q.push(new query.Query({name: 'like', args: ['xid', options.xidIsLike]}));
        }
        return q.toString();
    };
};

return {
    controller: watchListParametersController,
    templateUrl: require.toUrl('./watchListParameters.html'),
    bindings: {
        watchList: '<',
        parametersChanged: '&'
    }
};

}); // define
