/* jshint forin: false, boss: true */
//see line ~76 for explaination on for in
// boos mode used in this file, we should replace instaces with Array.map when polyfils are available


"use strict";
var ads;
var Slot = require('./slot');
/**
* The Slots class defines an FT.ads.slots instance.
* @class
* @constructor
*/
function Slots() {
}

Slots.prototype.init = function (impl){
	ads = impl;
	this.config = ;
	this.formats = ;
	this.responsive = ;
};



/**
* Given an array of slotnames will collapse the slots using the collapse method on the slot
* @name collapse
* @memberof Slots
* @lends Slots
*/
proto.collapse = function (slotNames) {
	var slotName, result = false;
	if (!ads.utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && ads.utils.isFunction(this[slotName].collapse)) {
			this[slotName].collapse();
			result = true;
		}
	}

	return result;
};

Slots.prototype.rendered = function(){

};

/**
* Given an array of slotnames will uncollapse the slots using the uncollapse method on the slot
* @name uncollapse
* @memberof Slots
* @lends Slots
*/
Slots.prototype.uncollapse = function (slotNames) {
	var slotName, result = false;
	if (!ads.utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && ads.utils.isFunction(this[slotName].uncollapse)) {
			this[slotName].uncollapse();
			result = true;
		}
	}
	return result;
};

/**
* creates a container for the ad in the page and gathers slot config then
* calls the GPT module to define the slot in the GPT service
* @name createSlot
* @memberof Slots
* @lends Slots
*/
Slots.prototype.initSlot = function (container) {
	// if container is a string this is a legacy implementation using ids
	// find the element and remove the ID in favour of a data attribute
	if (ads.utils.isString(container)){
		var container = document.getElementById(container) || container.querySelector('data-o-ads-name="' + container + '"');
		container.getAttribute('data-o-ads-name', container.id);
		container.removeAttribute('id');
	}

	//if not an element or we can't find it in the DOM exit
	if (!ads.utils.isElement(container)) {
		return false;
	}

	var name = container.getAttribute('data-o-ads-name') || 'o-ads-slot-' + (Object.keys(this).length + 1);
	var config = ads.config('slots') || {};
	var slot = new Slot(name, container, {
		formats: ads.config('formats'),
		responsive: ads.config('responsive'),
		slot: config[name] || {}
	});

	this[slot.name] = slot;
	return this[slotName];
};

module.exports = new Slots();
