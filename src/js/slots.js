/* jshint forin: false, boss: true */
//see line ~76 for explaination on for in
// boos mode used in this file, we should replace instaces with Array.map when polyfils are available


"use strict";
var utils = require('./utils');
var Slot = require('./slot');

/**
* The Slots class defines an FT.ads.slots instance.
* @class
* @constructor
*/
function Slots() {
}

/**
* Given an array of slotnames will collapse the slots using the collapse method on the slot
* @name collapse
* @memberof Slots
* @lends Slots
*/
Slots.prototype.collapse = function (slotNames) {
	var slotName, result = false;
	if (!utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && utils.isFunction(this[slotName].collapse)) {
			this[slotName].collapse();
			result = true;
		}
	}

	return result;
};

/**
* Given an array of slotnames will uncollapse the slots using the uncollapse method on the slot
* @name uncollapse
* @memberof Slots
* @lends Slots
*/
Slots.prototype.uncollapse = function (slotNames) {
	var slotName, result = false;
	if (!utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && utils.isFunction(this[slotName].uncollapse)) {
			this[slotName].uncollapse();
			result = true;
		}
	}
	return result;
};

/**
* Given an array of slotnames will refresh the slots using the refresh method on the slot
* @name uncollapse
* @memberof Slots
* @lends Slots
*/
Slots.prototype.refresh = function (slotNames) {
	var slotName, result = false;
	if (!utils.isArray(slotNames)){
		slotNames = [slotNames];
	}

	while(slotName = slotNames.pop()) {
		if(this[slotName] && utils.isFunction(this[slotName].uncollapse)) {
			this[slotName].refresh();
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
	if (utils.isString(container)){
		container = document.getElementById(container) ||document.querySelector('[data-o-ads-name="'+ container +'"]');
		if (container && container.id) {
			container.setAttribute('data-o-ads-name', container.id);
			container.removeAttribute('id');
		}
	}
	//if not an element or we can't find it in the DOM exit
	if (!utils.isElement(container)) {
		return false;
	}
	var slot = new Slot(container);
	console.log(slot);
	if (slot.sizes.length){
		this[slot.name] = slot;
		return slot;
	} else {
		utils.log.error('slot %s has no configured sizes!', slot.name);
	}
};

module.exports = new Slots();
