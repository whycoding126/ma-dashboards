/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';

accordion.$inject = [];
function accordion() {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, attrs, controller) {
            // jshint eqnull:true
            $scope[attrs.maAccordion] = controller;
            if (attrs.maAccordionSingle != null) {
                controller.single = true;
            }
            
            $element.find('[ma-accordion-section]').each(function() {
                var $this = angular.element(this);
                var id = $this.attr('ma-accordion-section');
                var open = $this.attr('ma-accordion-open');
                if (open != null) {
                    controller.open(id, false);
                } else {
                    controller.close(id, false);
                }
            });
        },
        controller: AccordionController
    };
}

AccordionController.$inject = ['$animate', '$element'];
function AccordionController($animate, $element) {
    this.$animate = $animate;
    this.$element = $element;
    
    this.section = {};
    this.animations = {};
}

AccordionController.prototype.open = function open(id, animate) {
    // jshint eqnull:true
    if (animate == null) {
        animate = true;
    }
    
    if (this.single) {
        for (var sectionId in this.section) {
            if (sectionId !== id && this.section[sectionId]) {
                this.close(sectionId);
            }
        }
    }
    
    if (this.section[id] === true) {
        return;
    }
    this.section[id] = true;
    
    var $sectionElement = this.$element.find('[ma-accordion-section="' + id + '"]');
    if (this.animations[id]) {
        this.animations[id].cancel();
    }
    if (animate) {
        $sectionElement.removeClass('ma-accordion-section-hide');
        $sectionElement.css('height', $sectionElement.prop('clientHeight') + 'px');
        $sectionElement.addClass('ma-accordion-section-hide');
        
        this.animations[id] = this.$animate.removeClass($sectionElement, 'ma-accordion-section-hide');
        this.animations[id].done(function() {
            $sectionElement.css('height', '');
        });
    } else {
        $sectionElement.removeClass('ma-accordion-section-hide');
    }
};

AccordionController.prototype.close = function close(id, animate) {
    // jshint eqnull:true
    if (animate == null) {
        animate = true;
    }
    
    if (this.section[id] === false) {
        return;
    }
    this.section[id] = false;

    var $sectionElement = this.$element.find('[ma-accordion-section="' + id + '"]');
    if (this.animations[id]) {
        this.animations[id].cancel();
    }
    if (animate) {
        $sectionElement.css('height', $sectionElement.prop('clientHeight') + 'px');
        
        this.animations[id] = this.$animate.addClass($sectionElement, 'ma-accordion-section-hide');
        this.animations[id].done(function() {
            $sectionElement.css('height', '');
        });
    } else {
        $sectionElement.addClass('ma-accordion-section-hide');
    }
};

AccordionController.prototype.toggle = function toggle(id) {
    if (this.section[id]) {
        this.close(id);
    } else {
        this.open(id);
    }
};

return accordion;

}); // define
