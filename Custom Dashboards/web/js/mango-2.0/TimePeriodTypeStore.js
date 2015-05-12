/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Terry Packer
 */

define(['jquery', 'dstore/Memory'], function($, Memory) {
'use strict';

function TimePeriodTypeStore() {
	this.data = this.defaultOptions;
	Memory.apply(this, arguments);
}

TimePeriodTypeStore.prototype = Object.create(Memory.prototype);

TimePeriodTypeStore.prototype.defaultOptions = [
    //TODO change text to use: tr('datapointdetailsview.rollup.none')
    {id:'SECONDS', text: 'Seconds'},
    {id:'MINUTES', text: 'Minutes'},
    {id:'HOURS', text: 'Hours'},
    {id:'DAYS', text: 'Days'},
    {id:'WEEKS', text: 'Weeks'},
    {id:'MONTHS', text: 'Months'},
    {id:'YEARS', text: 'Years'}
    
];


return TimePeriodTypeStore;

}); // define
