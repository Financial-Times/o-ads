/* globals sinon: false, $: false */

'use strict';

var googletag = {};
var handler;
var slotRenderEnded;
var slots = {};
var stubs = sinon.sandbox.create();
var oViewport = require('o-viewport');

function getResponsiveSizes(mapping) {
	var winner;
	var dims = oViewport.getSize();
	function findCurrentBreakpoint(breakpoint) {
		var breakpointDims = breakpoint[0];
		if (dims.width > breakpointDims[0] && dims.height > breakpointDims[1]) {
			if (!winner || breakpointDims[0] > winner[0][0]) {
				winner = breakpoint;
			}
		}
	}

	mapping.forEach(findCurrentBreakpoint);
	return winner[1];
}

googletag.defineSizeMapping = stubs.stub();
googletag.companionAds = stubs.stub().returns({setRefreshUnfilledSlots: stubs.stub()});
googletag.enableServices = stubs.stub();

function GPTSlot(name, sizes, id) {
	// @todo: we need to make sure the config flags from Slot get propagated here, as we are mocking slots and whole slot itself withing this mock
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
	this.set = stubs.stub().returns(this);
	this.defineSizeMapping = function() {};
	// add a mock outOfPage flag if the id contains -oop
	if(id.indexOf('-oop') !== -1){
		this._testAdTrackingDiv = true;
	}

	stubs.stub(this, 'defineSizeMapping', function(mapping) {
		this.sizes = mapping;
		this.responsive = true;
		return this;
	});

	this.getId = function() { return name + '/' + id; };

	this.getDomId = function() { return id; };

	this.getSlotId = function() { return {getDomId: this.getDomId, getId: this.getId};};

	slots[id] = this;
}

function slotRender(slot, color) {
	var size;
	color = color || '#800037';
	/* jshint -W107 */
	/* needs this to mock iframes */

	slot = slots[slot];

	var trackingDiv = slot.hasOwnProperty('_testAdTrackingDiv') ? '<div id="tracking" data-o-ads-impression-url="https://www.ft.com"></div>' : '';
	var html = 'javascript:\'<html><body style="background:' + color + ';">'+trackingDiv+'</body></html>\'';

	if (slot.responsive) {
		size = getResponsiveSizes(slot.sizes)[0];
	} else {
		size = slot.sizes[0] || [];
	}

	if (!slot.iframe) {
		slot.iframe = document.createElement('iframe');
		slot.iframe.id = 'google_ads_iframe_' + slot.getId();
		document.getElementById(slot.id).appendChild(slot.iframe);
	}

	slot.iframe.width = size[0] || 0;
	slot.iframe.height = size[1] || 0;

	// this gets here from this file, not from Slot.ks, slot is an instance of GPTSlot
	slot.iframe.src = html;
}

function slotRenderEnded(slot) {
	slot = slots[slot];
	var size = [slot.iframe.width, slot.iframe.height];
	var event = {
		isEmpty: false,
		creativeId: Math.floor(Math.random() * 1e11),
		lineItemId: Math.floor(Math.random() * 1e9),
		serviceName: 'publisher_ads',
		size: size,
		slot: slot
	};
	handler(event);
}

googletag.defineSlot = function() {};

googletag.defineOutOfPageSlot = function() {};

stubs.stub(googletag, 'defineSlot', function(name, sizes, id) {
	return new GPTSlot(name, sizes, id);
});

stubs.stub(googletag, 'defineOutOfPageSlot', function(name, id) {
	return new GPTSlot(name, id);
});

googletag.display = function() {};

stubs.stub(googletag, 'display', function(slot) {
	slotRender(slot);
	slotRenderEnded(slot);
});

googletag.sizeMapping = function() {
	var mapping = [];
	return {
		addSize: function() {
			mapping.push([].slice.call(arguments));
		},
		build: function() {
			return mapping;
		}
	};
};

var pubads = {
	disableInitialLoad: stubs.stub(),
	enableSingleRequest: stubs.stub(),
	enableAsyncRendering: stubs.stub(),
	refresh: function() {},
	collapseEmptyDivs: stubs.stub(),
	clear: stubs.stub().returns(true),
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
	slots.forEach(function(slot) {
		slotRender(slot.id, '#006D91');
	});
	return slots;
});

googletag.pubads = stubs.stub().returns(pubads);
googletag.pubadsReady = true;

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
