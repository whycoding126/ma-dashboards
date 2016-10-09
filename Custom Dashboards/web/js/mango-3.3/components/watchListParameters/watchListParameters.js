/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

watchListParametersController.$inject = [];
function watchListParametersController() {
    this.parameters = {};

    this.inputChanged = function inputChanged() {
        this.parametersChanged({parameters: this.parameters});
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
