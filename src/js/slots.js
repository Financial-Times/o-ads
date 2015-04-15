"use strict";
var utils = require('./utils');
var config = require('./config');
var Slot = require('./slot');
var oViewport = require('o-viewport');

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
	names = names || Object.keys(this);
	if (!utils.isArray(names)){
		names = [names];
	}

	names.forEach(function(slots, name){
		var slot = slots[name];
		if(slot && utils.isFunction(slot.refresh)) {
			slot.refresh();
		} else {
			utils.log.warn('Attempted to refresh non-existant slot %s', name);
		}
	}.bind(null, this));
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
		oViewport.trackElements('[data-o-ads-name="' + slot.name + '"]');
	}
	return slot;
};


function setupRefresh(slots){
	if(config('flags').refresh && config('refresh')){
		var data = config('refresh');
		if (data.time && !data.inview) {
			slots.timers.refresh = utils.timers.create(data.time, slots.fire.bind(slots, 'refresh'), data.max || 0);
		}
	}
}

function setupInview(slots){
	if(config('flags').inview){
		document.documentElement.addEventListener('oViewport.inView', function (event){
			var element = event.detail.element;
			var name = element.getAttribute('data-o-ads-name');
			if (name) {
				var slot = slots[name];
				slot.inview = event.detail.inViewPercentage;
				slots[name].fire('inview');
			}
		});
	}
}


Slots.prototype.init = function () {
	setupRefresh(this);
	setupInview(this);
};

Slots.prototype.timers = {};

module.exports = new Slots();
