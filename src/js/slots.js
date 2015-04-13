"use strict";
var utils = require('./utils');
var Slot = require('./slot');

/**
* The Slots class defines an slots instance.
* the instance tracks all ad slots on the page
* @class
* @constructor
*/
function Slots() {
}

/**
* Given a slot name or an array of slot names will collapse the slots using the collapse method on the slot
*/
Slots.prototype.collapse = function (names) {
	if (!utils.isArray(names)){
		names = [names];
	}

	names.forEach(function(name){
		if(this[name] && utils.isFunction(this[name].collapse)) {
			this[name].collapse();
		} else {
			utils.log.warn('Attempted to collapse non-existant slot %s', name);
		}
	});
};

/**
* Given a slot name or an array of slot names will uncollapse the slots using the uncollapse method on the slot
*/
Slots.prototype.uncollapse = function (names) {
	if (!utils.isArray(names)){
		names = [names];
	}

	names.forEach(function(name){
		if(this[name] && utils.isFunction(this[name].collapse)) {
			this[name].collapse();
		} else {
			utils.log.warn('Attempted to uncollapse non-existant slot %s', name);
		}
	});
};

/**
* Given a slot name or an array of slot names of slotnames will refresh the slots using the refresh method on the slot
*/
Slots.prototype.refresh = function (names) {
	if (!utils.isArray(names)){
		names = [names];
	}

	names.forEach(function(name){
		if(this[name] && utils.isFunction(this[name].collapse)) {
			this[name].refresh();
		} else {
			utils.log.warn('Attempted to refresh non-existant slot %s', name);
		}
	});
};

/**
* Confirms a container in the page exists and creates a Slot object
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

	// if not an element or we can't find it in the DOM exit
	if (!utils.isElement(container)) {
		utils.log.error('slot container must be an element!', container);
		return false;
	}

	var slot = new Slot(container);
	if (slot){
		this[slot.name] = slot;
	}
	return slot;
};

Slots.prototype.init = function () {
};


module.exports = new Slots();
