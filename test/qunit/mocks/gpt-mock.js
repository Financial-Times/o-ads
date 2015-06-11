/* globals sinon: false, $: false */

'use strict';

var googletag = {};
var handler;
var slotRenderEnded;
var slots = {};
var isArray = require('lodash/lang/isArray');
var stubs = sinon.sandbox.create();

googletag.defineSizeMapping = stubs.stub();
googletag.companionAds = stubs.stub();
googletag.enableServices = stubs.stub();

function Slot(name, sizes, id) {
	this.name = name;
	if (typeof sizes === 'string') {
		// out of page slot
		id = sizes;
		this.sizes = [[1, 1]];
	} else {
		this.sizes = sizes;
	}

	this.id = id;
	this.addService = stubs.stub().returns(this);
	this.setCollapseEmptyDiv = stubs.stub().returns(this);
	this.renderEnded = stubs.stub().returns(this);
	this.setTargeting = stubs.stub().returns(this);
	this.defineSizeMapping = stubs.stub().returns(this);
	this.set = stubs.stub().returns(this);
	this.getId = function() { return name + '/' + id; };

	this.getDomId = function() { return id; };

	this.getSlotId = function() { return {getDomId: this.getDomId, getId: this.getId};};

	slots[id] = this;
}

function slotRender(slot) {
	var size;
	/* jshint -W107 */
	/* needs this to mock iframes */
	var html = 'javascript:\'<html><body style="background:#800037;"></body></html>\'';
	slot = slots[slot];

	if (isArray(slot.sizes)) {
		size = slot.sizes[0];
	} else {
		var screens = Object.keys(slot.sizes);
		size = slot.sizes[screens[0]][0];
	}

	var iframe = document.createElement('iframe');
	iframe.width = size[0];
	iframe.height = size[1];
	iframe.id = 'google_ads_iframe_' + slot.getId();
	iframe.src = html;
	document.getElementById(slot.id).appendChild(iframe);
}

function slotRenderEnded(slot) {
	slot = slots[slot];
	var size = slot.sizes[0];
	var event = {
		isEmpty: false,
		creativeId: 53576339449,
		lineItemId: 236265289,
		serviceName: "publisher_ads",
		size: size,
		slot: slot
	};
	handler(event);
}

googletag.defineSlot = function() {};

googletag.defineOutOfPageSlot = function() {};

stubs.stub(googletag, 'defineSlot', function(name, sizes, id) {
	return new Slot(name, sizes, id);
});

stubs.stub(googletag, 'defineOutOfPageSlot', function(name, id) {
	return new Slot(name, id);
});

googletag.display = function() {};

stubs.stub(googletag, 'display', function(slot) {
	slotRender(slot);
	slotRenderEnded(slot);
});

googletag.sizeMapping = stubs.stub().returns({
	addSize: stubs.stub(),
	build: stubs.stub()
});

var pubads = {
	disableInitialLoad: stubs.stub(),
	enableSingleRequest: stubs.stub(),
	enableAsyncRendering: stubs.stub(),
	refresh: function() {},
	collapseEmptyDivs: stubs.stub(),
	clear: stubs.stub(),
	clearSlotTargeting: stubs.stub(),
	definePassback: stubs.stub(),
	enableSyncRendering: stubs.stub(),
	enableVideoAds: stubs.stub(),
	setTargeting: stubs.stub(),
	clearTargeting: stubs.stub(),
	addEventListener: function() {},
	updateCorrelator: stubs.stub()
};

stubs.stub(pubads, 'addEventListener', function(eventName, fn) {
	if (eventName === 'slotRenderEnded') {
		handler = fn;
	}
});

stubs.stub(pubads, 'refresh', function(slots) {
	return slots;
});

googletag.pubads = stubs.stub().returns(pubads);

googletag.cmd =  googletag.cmd || [];
googletag.cmd.push = function(fn) {
	if ($.isFunction(fn)) {
		fn.call(googletag);
		googletag.cmd.shift();
	}
};

window.googletag = module.exports.mock = googletag;
module.exports.restore = function() {
	(stubs.fakes || []).forEach(function(fake) {
		if (typeof fake.reset === 'function') {
			fake.reset();
		}
	});
};
