/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

return {
    template: '<img ng-src="{{$ctrl.src}}" ng-class="$ctrl.classes">',
    bindings: {
        srcMap: '<',
        defaultSrc: '@',
        enabled: '<'
    },
    controller: [function() {
        this.$onInit = function() {
            if (angular.isUndefined(this.enabled)) {
                this.enabled = true;
            }
            this.classes = {
                'live-value': true,
                'point-disabled': !this.enabled
            };
        };
        
        this.$onChanges = function(changes) {
            if (changes.srcMap) {
                this.prevSrcMap = angular.copy(this.srcMap);
            }
            if (changes.enabled && !changes.enabled.isFirstChange()) {
                this.classes['point-disabled'] = !this.enabled;
            }
        };
        
        this.$doCheck = function() {
            if (!this.srcMap) return;
            
            var changed = false;
            angular.forEach(this.srcMap, function(value, srcKey) {
                if (this.prevSrcMap[srcKey] !== value) {
                    changed = true;
                    this.prevSrcMap[srcKey] = value;
                }
            }.bind(this));
            
            if (changed) {
                this.updateSrc();
            }
        };
        
        this.updateSrc = function updateSrc() {
            var src;
            angular.forEach(this.srcMap, function(value, srcKey) {
                if (value) {
                    src = srcKey;
                }
            });
            if (!src) {
                src = this.defaultSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            }
            this.src = src;
        };
    }]
};

}); // define
