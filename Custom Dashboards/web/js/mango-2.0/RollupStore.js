/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Terry Packer
 */

define(['jquery', 'dstore/Memory'], function($, Memory) {
'use strict';

function RollupStore(dataType) {

	if(dataType === 'NUMERIC'){
		this.data = this.defaultOptions;
    }else{
    	this.data = [];
    	for(var i=0; i<this.defaultOptions.length; i++){
            var option = this.defaultOptions[i];
            if(option.nonNumericSupport === true){
                this.data.push(option);
            }
        }
    }
	
	Memory.apply(this, arguments);
}

RollupStore.prototype = Object.create(Memory.prototype);

RollupStore.prototype.defaultOptions = [
    //TODO change text to use: tr('datapointdetailsview.rollup.none')
    {id:'NONE', text: 'None', disabled: false, nonNumericSupport: true},
    {id:'AVERAGE', text: 'Average', disabled: false, nonNumericSupport: false},
    //{id:'ACCUMULATOR', text: 'Accumulator', disabled: false, nonNumericSupport: false},
    {id:'COUNT', text: 'Count', disabled: false, nonNumericSupport: true},
    {id:'DELTA', text: 'Delta', disabled: false, nonNumericSupport: false},
    {id:'INTEGRAL', text: 'Integral', disabled: false, nonNumericSupport: false},
    {id:'MAXIMUM', text: 'Maximum', disabled: false, nonNumericSupport: false},
    {id:'MINIMUM', text: 'Minimum', disabled: false, nonNumericSupport: false},
    {id:'SUM', text: 'Sum', disabled: false, nonNumericSupport: false},
    {id:'FIRST', text: 'First', disabled: false, nonNumericSupport: true},
    {id:'LAST', text: 'Last', disabled: false, nonNumericSupport: true}
];


return RollupStore;

}); // define
