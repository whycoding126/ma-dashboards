/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

function maMapController() {
    
    this.$onChanges = function(changes) {
        // console.log(changes);
    };
    
}

return {
    bindings: {
        zoom: '<',
        center: '@'
    },
    controller: maMapController,
    templateUrl: require.toUrl('./maMap.html'),
    transclude: true
};

}); // define
