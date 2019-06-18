/* globals QUnit, sinon: false */

'use strict'; //eslint-disable-line
let errorStub;
QUnit.module('Slots - post message', {
	beforeEach: function() {
		errorStub = this.stub(this.utils.log, 'error');
		window.scrollTo(0, 0);
		const eventListeners = this.eventListeners = [];
		eventListeners; // eslint-disable-line no-unused-expressions
		const _addEventListener = window.addEventListener;
		window.addEventListener = function (type, handler) {
			if(type === 'message'){
		 		eventListeners.push({type: type, handler: handler});
			}
		 	_addEventListener.apply(window, arguments);
		 };
	},

	afterEach: function() {
		window.scrollTo(0, 0);
		this.eventListeners.forEach(function (item) {
			window.removeEventListener(item.type, item.handler);
		});
		errorStub.reset();
	}
});

QUnit.test('Post message oAds.adIframeLoaded from the iframe dispatches oAds.slotRenderEnded', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	const utils = this.ads.utils;
	const performanceStub = sinon.stub(window.performance, 'mark');
	this.spy(this.ads.utils, 'broadcast');

	window.addEventListener('message', 	function () {
		// Make sure this executes AFTER the other 'message' event listener
		// defined in slots.js
		setTimeout(function() {
			assert.ok(utils.broadcast.calledWith('slotRenderEnded'));
			assert.ok(performanceStub.called);
			performanceStub.restore();
			done();
		}, 0);
	 });

	document.body.addEventListener('oAds.slotReady', 	function () {
		window.postMessage('{ "type": "oAds.adIframeLoaded", "name": "' + slotName + '"}', '*');
 	});

	this.ads.init();
	this.ads.slots.initSlot(container);
});


QUnit.test('Post message from unknown slot logs an error and sends a repsonse', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'unknown-slot';
	});

	window.addEventListener('message', 	function () {
		// Make sure this executes AFTER the other 'message' event listener
		// defined in slots.js
		setTimeout(() => {
			assert.ok(errorStub.calledWith('Message received from unidentified slot'), 'the error is logged');
			done();
		}, 0);
	 });

	document.body.addEventListener('oAds.slotReady', 	function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
 	});

	this.ads.init();
	this.ads.slots.initSlot(container);
});


QUnit.test('Passed touch fires an event', function (assert) {
	const done = assert.async();
	const slotName = 'touch-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	document.body.addEventListener('oAds.slotReady', function () {
		window.postMessage('{ "type": "touchstart", "name": "' + slotName + '"}', '*');
	});

	document.body.addEventListener('oAds.touch', function () {
		assert.ok(event.detail.slot, 'The touch event is fired ');
		assert.ok(event.detail.type, 'touchstart', 'The correct type is set');
		assert.equal(event.detail.name, slotName, 'the name is ' + slotName);
		done();
	});

	this.ads.init();
	this.ads.slots.initSlot(container);
});


QUnit.test('Post message catches the event when the message comes from an unidentified slot', function (assert) {
	const done = assert.async();
	const slotName = 'responsive-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');
	document.body.addEventListener('oAds.slotReady', function () {
		window.postMessage('{ "type": "oAds.responsive", "name": "unknown"}', '*');
		// as there is no event fired when no slot available, we use timeout to let the error call execute
		setTimeout(function() {
			assert.ok(errorStub.calledWith('Message received from unidentified slot'), 'the error is logged');
			done();
		}, 500);
	});
	this.ads.init();
	this.ads.slots.initSlot(container);
});

QUnit.test('Post message "collapse" message will call slot.collapse()', function (assert) {
	const done = assert.async();
	const slotName = 'collapse-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	const utils = this.ads.utils;
	this.spy(utils, 'broadcast');

	document.body.addEventListener('oAds.slotReady', function () {
		window.postMessage('{ "type": "oAds.collapse", "collapse": true}', '*');
	});

	window.addEventListener('message', function () {
		// Make sure this executes AFTER the other 'message' event listener
		// defined in slots.js
		setTimeout(() => {
			assert.ok(slot.collapse.called, 'the collapse method is called');
			assert.ok(utils.broadcast.calledWith('slotCollapsed'), 'broadcast is called with "slotCollapsed" as parameter');
			done();
		}, 0);
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Unknown postMessage will log an error', function (assert) {
	const done = assert.async();
	const slotName = 'test-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	window.addEventListener('message', function () {
		// Make sure this executes AFTER the other 'message' event listener
		// defined in slots.js
		setTimeout(() => {
			assert.ok(errorStub.calledWith('Unknown message received from o-ads-embed'), 'the error is logged');
			done();
		}, 0);
	});

	document.body.addEventListener('oAds.slotReady', function () {
		window.postMessage('{ "type": "oAds.unknown" }', '*');
	});

	this.ads.init();
	this.ads.slots.initSlot(container);
});
