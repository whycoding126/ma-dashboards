/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

return {
    templateUrl: require.toUrl('./dateBar.html'),
    controller: ['MD_ADMIN_SETTINGS', '$stateParams', 'Util', dateBarController]
};

function dateBarController(MD_ADMIN_SETTINGS, $stateParams, Util) {
    this.params = MD_ADMIN_SETTINGS.dateBar;
    this.stateParams = $stateParams;

    this.$onInit = function() {
    };
    
    this.$doCheck = function() {
        if (this.params.from !== this.prevFrom || this.params.to !== this.prevTo) {
            this.prevFrom = this.params.from;
            this.prevTo = this.params.to;
            
            if (this.params.autoRollup) {
                var calc = Util.rollupIntervalCalculator(this.params.from, this.params.to, this.params.rollupType, true);
                this.params.rollupIntervals = calc.intervals;
                this.params.rollupIntervalPeriod = calc.units;
            }
        }
        
        if (this.params.useRollupForUpdate &&
                (this.params.rollupIntervals !== this.params.updateIntervals ||
                 this.params.rollupIntervalPeriod !== this.params.updateIntervalPeriod)) {
            this.calcUpdateInterval();
        }
    };
    
    this.calcUpdateInterval = function calcUpdateInterval() {
        if (this.params.useRollupForUpdate) {
            this.params.updateIntervals = this.params.rollupIntervals;
            this.params.updateIntervalPeriod = this.params.rollupIntervalPeriod;
        }
    };
}

}); // define
