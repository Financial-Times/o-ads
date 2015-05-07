"use strict";
var utils = require('./utils');
var config = require('./config');
var Slot = require('./slot');
var elementvis = require('o-element-visibility');
var screensize = null;

/**
* The Slots class defines an slots instance.
* the instance tracks all ad slots on the page
* @class
* @constructor
*/
function Slots() {
}

/*
* Either run a method or fire an event on the named slot.
*/
function run(action, name){
	var slot = this[name];
	if(slot){
		if(utils.isFunction(slot[action])) {
			slot[action]();
		} else if(utils.isNonEmptyString(slot[action])) {
			slot.fire(action);
		}
	} else {
		utils.log.warn('Attempted to %s non-existant slot %s', action, name);
	}
}

/**
* Given a slot name or an array of slot names will collapse the slots using the collapse method on the slot
*/
Slots.prototype.collapse = function (names) {
	names = names || Object.keys(this);
	if (utils.isNonEmptyString(names)){
		run.call(this, 'uncollapse', names);
	} else if (utils.isArray(names)){
		names.forEach(run.bind(null, 'collapse'));
	}

	return this;
};

/**
* Given a slot name or an array of slot names will uncollapse the slots using the uncollapse method on the slot
*/
Slots.prototype.uncollapse = function (names) {
	names = names || Object.keys(this);
	if (!utils.isArray(names)){
		run.call(this, 'uncollapse', names);
	}

	names.forEach(run.bind(this, 'uncollapse'));
	return this;
};

/**
* Given a slot name or an array of slot names of slotnames will refresh the slots using the refresh method on the slot
*/
Slots.prototype.refresh = function (names) {
	names = names || Object.keys(this);
	if (!utils.isArray(names)){
		names = [names];
	}

	names.forEach(run.bind(this, 'refresh'));
	return this;
};

/**
* Confirms a container in the page exists and creates a Slot object
*/
Slots.prototype.initSlot = function (container) {
	// if container is a string this is a legacy implementation using ids
	// find the element and remove the ID in favour of a data attribute
	if (utils.isString(container)){
		container = document.getElementById(container) || document.querySelector('[data-o-ads-name="'+ container +'"]');
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

	var slot = new Slot(container, screensize);
	if (slot && !this[slot.name]){
		this[slot.name] = slot;
		slot.fire('ready');
		elementvis.track(slot.container);
	} else if (this[slot.name]) {
		utils.log.error('slot %s is already defined!', slot.name);
	}
	return slot;
};


Slots.prototype.initRefresh = function (){
	if(config('flags').refresh && config('refresh')){
		var data = config('refresh');
		if (data.time && !data.inview) {
			this.timers.refresh = utils.timers.create(data.time, this.refresh.bind(this), data.max || 0);
		}
	}
	return this;
};

Slots.prototype.initInview = function() {
	if(config('flags').inview){
		document.documentElement.addEventListener('oVisibility.inview', function (slots, event){
			var element = event.detail.element;
			var name = element.node.getAttribute('data-o-ads-name');
			if (slots[name]) {
				var slot = slots[name];

				slot.inviewport = event.detail.inviewport || event.detail.visible;
				slot.percentage = event.detail.percentage;
				if(slot.inviewport) {
					slot.fire('inview', event.detail);
				}
			}
		}.bind(null, this));
	}
	return this;
};

/*
*	listens for the rendered event from a slot and fires the complete event,
* after extending the slot with information from the server.
*/
Slots.prototype.initRendered = function(){
	utils.on('rendered', function(slots, event){
		var slot = slots[event.detail.name];
		if(slot) {
			utils.extend(slot[slot.server], event.detail[slot.server]);
			slot.fire('complete', event.detail);
		}
	}.bind(null, this));
	return this;
};

/*
* if responsive configuration exists listen for breakpoint changes
*/
Slots.prototype.initResponsive = function() {
	var breakpoints = config('responsive');
	if (utils.isObject(breakpoints) ) {
		screensize = utils.responsive(breakpoints, onBreakpointChange.bind(null, this));
	}
	return this;
};

/*
* called when a responsive breakpoint is crossed though window resizing or orientation change.
*/
function onBreakpointChange(slots, screensize) {
	Object.keys(slots).forEach(function(name){
		var slot = slots[name];
		if(slot) {
			slot.screensize = screensize;
			slot.fire('breakpoint', { screensize: screensize });
		}
	});
}

/*
* Initialise slots
*/
Slots.prototype.init = function () {
	this.initRefresh();
	this.initInview();
	this.initRendered();
	this.initResponsive();
};

module.exports = new Slots();
