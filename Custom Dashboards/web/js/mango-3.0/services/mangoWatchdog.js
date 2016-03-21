/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

function mangoWatchdog(mangoWatchdogTimeout, $timeout) {
	
	function MangoWatchdog(options) {
		this.failed = false;
		this.enabled = true;
		angular.extend(this, options);
		if (this.timeout <= 0)
			this.enabled = false;
	}

	MangoWatchdog.prototype.enable = function() {
		this.enabled = true;
	};
	
	MangoWatchdog.prototype.disable = function() {
		this.enabled = false;
	};
	
	MangoWatchdog.prototype.reset = function() {
		var _this = this;
		this.failed = false;
		
		if (!this.timeout || !this.enabled) return;
		
		if (this.promise) {
			$timeout.cancel(this.promise);
		}
		this.promise = $timeout(function() {
			_this.failed = true;
		}, this.timeout);
	};
	
	return new MangoWatchdog({timeout: mangoWatchdogTimeout});
}

mangoWatchdog.$inject = ['mangoWatchdogTimeout', '$timeout'];

return mangoWatchdog;

}); // define
