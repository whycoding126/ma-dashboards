/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

watchListParametersController.$inject = ['$parse', '$interpolate'];
function watchListParametersController($parse, $interpolate) {
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
            q.push(new query.Query({
                name: 'like',
                args: ['name', this.interpolateOption(options.nameIsLike)]
            }));
        }
        if (options.xidIsLike) {
            q.push(new query.Query({
                name: 'like',
                args: ['xid', this.interpolateOption(options.xidIsLike)]
            }));
        }
        return q.toString();
    };
    
    this.interpolateOption = function interpolateOption(option) {
        if (typeof option !== 'string' || option.indexOf('{{') < 0)
            return option;
        
        var matches = /{{(.*?)}}/.exec(option);
        if (matches && matches[0] === matches.input) {
            option = $parse(matches[1])(this.parameters);
        } else {
            option = $interpolate(option)(this.parameters);
        }
        return option;
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
