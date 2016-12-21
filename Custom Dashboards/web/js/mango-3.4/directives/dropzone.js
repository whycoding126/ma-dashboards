/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

dropzone.$inject = [];
function dropzone() {
    return {
        restrict: 'A',
        scope: false,
        bindToController: {
            dragEnter: '&?maDragEnter',
            dragOver: '&?maDragOver',
            dragLeave: '&?maDragLeave',
            drop: '&?maDrop'
        },
        controller: DropzoneController
    };
}

DropzoneController.$inject = ['$scope', '$element'];
function DropzoneController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
}

DropzoneController.prototype.$onInit = function() {
    var $ctrl = this;
    var $element = this.$element;
    var $scope = this.$scope;
    
    $element.on('dragenter', function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($ctrl.dragEnter) {
            $scope.$apply(function() {
                $ctrl.dragEnter({$event: $event, $data: $ctrl.getData($event), $coordinates: $ctrl.getCoordinates($event)});
            });
        }
    });
    $element.on('dragover', function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($ctrl.dragOver) {
            $scope.$apply(function() {
                $ctrl.dragOver({$event: $event, $coordinates: $ctrl.getCoordinates($event)});
            });
        }
    });
    $element.on('dragleave', function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($ctrl.dragLeave) {
            $scope.$apply(function() {
                $ctrl.dragLeave({$event: $event, $data: $ctrl.getData($event), $coordinates: $ctrl.getCoordinates($event)});
            });
        }
    });
    $element.on('drop', function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($ctrl.drop) {
            $scope.$apply(function() {
                $ctrl.drop({$event: $event, $data: $ctrl.getData($event), $coordinates: $ctrl.getCoordinates($event)});
            });
        }
    });
};

DropzoneController.prototype.getData = function getData($event) {
    var event = $event.originalEvent || $event;
    var json = event.dataTransfer.getData('application/json');
    if (json) {
        try {
            return angular.fromJson(json);
        } catch (e) {
        }
    }
    return event.dataTransfer.getData('text/plain');
};

DropzoneController.prototype.getCoordinates = function getCoordinates($event) {
    return {
        left: Math.round($event.pageX - this.$element.offset().left),
        top: Math.round($event.pageY - this.$element.offset().top)
    };
};

return dropzone;

}); // define
