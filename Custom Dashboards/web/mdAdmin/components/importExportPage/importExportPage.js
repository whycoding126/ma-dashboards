/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

ImportExportPageController.$inject = ['ImportExport', '$timeout', 'Util'];
function ImportExportPageController(ImportExport, $timeout, Util) {
    this.ImportExport = ImportExport;
    this.$timeout = $timeout;
    this.Util = Util;
    
    this.sectionsForExport = {};
    this.selectAllIndeterminate = false;
    this.indent = 3;
}

ImportExportPageController.prototype.$onInit = function() {
    this.ImportExport.list().then(function(sectionList) {
        this.sectionList = sectionList;
    }.bind(this));
};

ImportExportPageController.prototype.selectAllChanged = function() {
    for (var i = 0; i < this.sectionList.length; i++) {
        var sectionName = this.sectionList[i];
        this.sectionsForExport[sectionName] = this.selectAll;
    }
    this.selectAllIndeterminate = false;
};

ImportExportPageController.prototype.checkIndeterminate = function() {
    var allChecked = true;
    var anyChecked = false;
    for (var i = 0; i < this.sectionList.length; i++) {
        var sectionName = this.sectionList[i];
        var sectionSelected = !!this.sectionsForExport[sectionName];
        allChecked = allChecked && sectionSelected;
        anyChecked = anyChecked || sectionSelected;
    }
    this.selectAllIndeterminate = anyChecked && !allChecked;
    this.selectAll = anyChecked;
};

ImportExportPageController.prototype.doExport = function(download) {
    var sectionNames = [];
    for (var sectionName in this.sectionsForExport) {
        if (this.sectionsForExport[sectionName]) {
            sectionNames.push(sectionName);
        }
    }
    
    var options = {};
    if (download) {
        options.responseType = 'blob';
    }
    
    this.ImportExport.exportSections(sectionNames, options).then(function(exportedData) {
        if (download) {
            this.Util.downloadBlob(exportedData, 'export.json');
        } else {
            this.exportedData = exportedData;
            this.writeIndentedJson();
        }
    }.bind(this));
};

ImportExportPageController.prototype.doImport = function() {
    var data = angular.fromJson(this.jsonString);
    delete this.importStatus;
    this.ImportExport.importData(data).then(function(importStatus) {
        this.importStatus = importStatus;
        this.getImportStatus();
    }.bind(this));
};

ImportExportPageController.prototype.getImportStatus = function() {
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

ImportExportPageController.prototype.cancelImport = function() {
    if (this.importStatus) {
        this.importStatus.cancel();
    }
};

ImportExportPageController.prototype.writeIndentedJson = function() {
    if (this.exportedData) {
        this.jsonString = angular.toJson(this.exportedData, this.indent);
    }
};

ImportExportPageController.prototype.clear = function() {
    delete this.exportedData;
    this.jsonString = '';
};

ImportExportPageController.prototype.editorChanged = function() {
    delete this.exportedData;
};

ImportExportPageController.prototype.copyToClipboard = function() {
    this.doCopy = {};
};

return {
    controller: ImportExportPageController,
    templateUrl: require.toUrl('./importExportPage.html')
};

}); // define
