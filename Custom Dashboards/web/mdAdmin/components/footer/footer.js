/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require', 'moment-timezone'], function(angular, require, moment) {
'use strict';

FooterController.$inject = ['MA_PRODUCT_INFO'];
function FooterController(MA_PRODUCT_INFO) {
    // TODO
    // get module version and license status from API and display in footer
    this.year = moment().year();
    this.productName = MA_PRODUCT_INFO.productName;
    this.distributor = MA_PRODUCT_INFO.distributor;
    this.distributorUrl = MA_PRODUCT_INFO.distributorUrl;
    this.moduleName = MA_PRODUCT_INFO.moduleName;
    this.moduleVersion = MA_PRODUCT_INFO.moduleVersion;
}

FooterController.prototype.$onChanges = function(changes) {
};

FooterController.prototype.$onInit = function() {
};

return {
    controller: FooterController,
    templateUrl: require.toUrl('./footer.html')
};

}); // define