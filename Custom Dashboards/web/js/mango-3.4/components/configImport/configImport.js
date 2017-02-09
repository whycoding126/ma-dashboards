/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

ConfigImportController.$inject = ['ImportExport', '$timeout', '$mdColors'];
function ConfigImportController(ImportExport, $timeout, $mdColors) {
    this.ImportExport = ImportExport;
    this.$timeout = $timeout;

    this.accentColor = $mdColors.getThemeColor('accent');
}

ConfigImportController.prototype.$onInit = function() {
};

ConfigImportController.prototype.fileDropped = function(data) {
    var types = data.getDataTransferTypes();
    if (types.length && types[0] === 'Files') {
        var transfer = data.getDataTransfer();
        if (transfer.length) {
            var file = transfer[0];
            if (!file.type || file.type === 'application/json' || file.type.indexOf('text/') === 0) {
                this.importFile(file);
            }
        }
    }
};

ConfigImportController.prototype.fileSelected = function($event) {
    var fileInput = $event.target;
    if (fileInput.files && fileInput.files.length) {
        this.importFile(fileInput.files[0]);
        fileInput.value = null;
    }
};

ConfigImportController.prototype.importFile = function(file) {
    var $ctrl = this;

    delete this.importStatus;
    
    /*
    if (!FileReader) return;
    var reader = new FileReader();
    reader.onload = function() {
        $ctrl.jsonString = this.result;
        $ctrl.doImport();
    };
    reader.readAsText(file);
    */
    
    this.ImportExport.importData(file).then(function(importStatus) {
        this.importStatus = importStatus;
        this.getImportStatus();
    }.bind(this));
};

ConfigImportController.prototype.doImport = function() {
    var data = angular.fromJson(this.jsonString);
    delete this.importStatus;
    this.ImportExport.importData(data).then(function(importStatus) {
        this.importStatus = importStatus;
        this.getImportStatus();
    }.bind(this), function(response) {
        console.log('error importing file');
    }.bind(this));
};

ConfigImportController.prototype.getImportStatus = function() {
    var $ctrl = this;
    if (this.importStatus) {
        this.importStatus.getStatus().then(function(status) {
            if ((status.state !== 'COMPLETED' || status.state !== 'CANCELLED') && status.progress !== 100) {
                $ctrl.$timeout(function() {
                    $ctrl.getImportStatus();
                }, 1000);
            }
        });
    }
};

ConfigImportController.prototype.cancelImport = function() {
    if (this.importStatus) {
        this.importStatus.cancel();
    }
};

return {
    controller: ConfigImportController,
    templateUrl: require.toUrl('./configImport.html'),
    bindings: {
        jsonString: '<?'
    }
};

}); // define
