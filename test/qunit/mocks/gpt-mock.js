/* globals sinon: false, $: false*/

'use strict'; //eslint-disable-line

const googletag = {};
let handler;
const slots = {};
const stubs = sinon.sandbox.create();
const oViewport = require('o-viewport');

function getResponsiveSizes(mapping) {
	let winner;
	const dims = oViewport.getSize();
	function findCurrentBreakpoint(breakpoint) {
		const breakpointDims = breakpoint[0];
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
	let size;
	color = color || '#800037';
	/* jshint -W107 */
	/* needs this to mock iframes */

	slot = slots[slot];

	const trackingDiv = slot.hasOwnProperty('outOfPage') && slot.id !== 'delayedimpression-missing-tracking-div-gpt' ? '<div id="tracking" data-o-ads-impression-url="https://www.ft.com"></div>' : '';
	const html = 'javascript:\'<html><body style="background:' + color + ';">'+trackingDiv+'</body></html>\''; //eslint-disable-line no-script-url
	if (slot.responsive) {
		size = getResponsiveSizes(slot.sizes)[0];
	} else {
		size = slot.sizes[0] || [];
	}

	if(size[0] === 970 && size[1] === 250) {
		//For testing, make billboard sizes empty
		size = [0,0];
	}

	if (!slot.iframe) {
		slot.iframe = document.createElement('iframe');
		slot.iframe.id = 'google_ads_iframe_' + slot.getId();
		document.getElementById(slot.id).appendChild(slot.iframe);
	}

	if(size) {
		slot.iframe.width = size[0] || 0;
		slot.iframe.height = size[1] || 0;
	}

	// this gets here from this file, not from Slot.ks, slot is an instance of GPTSlot
	slot.iframe.src = html;
}

function slotRenderEnded(slot) {
	slot = slots[slot];
	const size = [slot.iframe.width, slot.iframe.height];
	const event = {
		isEmpty: Boolean(slot.iframe.width),
		creativeId: Math.floor(Math.random() * 1e11),
		lineItemId: Math.floor(Math.random() * 1e9),
		serviceName: 'publisher_ads',
		size: slot.iframe.width > 0 ? size : null,
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
	const gptSlot = new GPTSlot(name, id);
	gptSlot.outOfPage = true;
	return gptSlot;
});

googletag.display = function() {};

stubs.stub(googletag, 'display', function(slot) {
	slotRender(slot);
	slotRenderEnded(slot);
});

googletag.sizeMapping = function() {
	const mapping = [];
	return {
		addSize: function() {
			mapping.push([].slice.call(arguments));
		},
		build: function() {
			return mapping;
		}
	};
};

const pubads = {
	disableInitialLoad: stubs.stub(),
	enableSingleRequest: stubs.stub(),
	enableAsyncRendering: stubs.stub(),
	refresh: function() {},
	collapseEmptyDivs: stubs.stub(),
	clear: stubs.stub().returns(true),
	clearSlotTargeting: stubs.stub(),
	definePassback: stubs.stub(),
	enableSyncRendering: stubs.stub(),
	setTargeting: stubs.stub(),
	clearTargeting: stubs.stub(),
	addEventListener: function() {},
	updateCorrelator: stubs.stub(),
	setRequestNonPersonalizedAds : stubs.stub()
};

stubs.stub(pubads, 'addEventListener', function(eventName, fn) {
	if (eventName === 'slotRenderEnded') {
		handler = fn;
	}
});

stubs.stub(pubads, 'refresh', function(slots) {
	slots.forEach(function(slot) {
		slotRender(slot.id, '#006D91');
		slotRenderEnded(slot.id);
	});
	return slots;
});

googletag.destroySlots = stubs.stub().returns(true);

googletag.pubads = stubs.stub().returns(pubads);
googletag.pubadsReady = true;

googletag.cmd = googletag.cmd || [];
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
