/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'angular'], function(require, angular) {
'use strict';

ImportExportFactory.$inject = ['$http', '$q', '$timeout', 'Util'];
function ImportExportFactory($http, $q, $timeout, Util) {
    var importExportUrl = '/rest/v1/json-emport';
    
    function ImportStatus(location) {
        this.location = location;
    }
    
    ImportStatus.prototype.getStatus = function() {
        return $http({
            method: 'GET',
            url: this.location,
            headers: {
                'Accept': 'application/json'
            },
            cache: false
        }).then(function(response) {
            angular.extend(this, response.data);
            return this;
        }.bind(this));
    };
    
    ImportStatus.prototype.cancel = function() {
        return $http({
            method: 'PUT',
            data: {cancel: true},
            url: this.location,
            headers: {
                'Accept': 'application/json'
            },
            cache: false
        }).then(function(response) {
            angular.extend(this, response.data);
            return this;
        }.bind(this));
    };
    
    function ImportExport() {
    }
    
    ImportExport.list = function() {
        return $http({
            method: 'GET',
            url: importExportUrl + '/list',
            headers: {
                'Accept': 'application/json'
            },
            cache: true
        }).then(function(response) {
            return response.data;
        });
    };
    
    ImportExport.exportSections = function(sections, options) {
        try {
            if (!angular.isArray(sections)) throw new Error('Requires sections parameter');

            var canceler = $q.defer();
            var cancelOrTimeout = Util.cancelOrTimeout(canceler.promise, options.timeout);
            
            return $http({
                method: 'GET',
                url: importExportUrl,
                timeout: cancelOrTimeout,
                params: {
                    exportElements: sections
                },
                headers: {
                    'Accept': 'application/json'
                },
                cache: false,
                responseType: options.responseType
            }).then(function(response) {
                return response.data;
            });
        } catch (error) {
            return $q.reject(error).setCancel(angular.noop);
        }
    };

    ImportExport.importData = function(data) {
        return $http({
            method: 'POST',
            url: importExportUrl,
            data: data,
            headers: {
                'Accept': 'application/json'
            },
            cache: true
        }).then(function(response) {
            return new ImportStatus(response.headers('Location'));
        });
    };

    return ImportExport;
}

return ImportExportFactory;

});
