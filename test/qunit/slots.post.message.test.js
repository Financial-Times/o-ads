/* globals QUnit: false */

'use strict'; //eslint-disable-line

QUnit.module('Slots - post message', {
	beforeEach: function() {
		window.scrollTo(0, 0);
		const eventListeners = this.eventListeners = [];
		eventListeners;
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
	}
});

QUnit.test('Post message whoami message reply is sent', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function(message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.deepEqual(message.sizes, [[300, 250]], 'the correct sizes are supplied');
		assert.notOk(slot.collapse.called, 'the collapse method is not called');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', 	function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
 	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message whoami message with collapse will call slot collapse', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-collapse-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function(message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.deepEqual(message.sizes, [[300, 250]], 'the sizes are returned');
		assert.ok(slot.collapse.called, 'the collapse method is called');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami", "collapse": true}', '*');
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message from unknown slot logs an error and sends a repsonse', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'unknown-slot';
	});

	const errorStub = this.stub(this.utils.log, 'error');

	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.ok(errorStub.calledWith('Message received from unidentified slot'), 'the error is logged');
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, undefined, 'the name is undefined');
		assert.deepEqual(message.sizes, undefined, 'no sizes are supplied');
		assert.notOk(slot.collapse.called, 'the collapse method is not called');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	});

	document.body.addEventListener('oAds.ready', 	function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
 	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message collapse calls the collapse method on the slot', function (assert) {
	const done = assert.async();
	const slotName = 'collapse-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	document.body.addEventListener('oAds.complete', function () {
		window.postMessage('{ "type": "oAds.collapse", "name": "' + slotName + '"}', '*');
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.stub(slot, 'collapse', function () {
		assert.ok(slot.collapse.called, 'the collapse method is called');
		done();
	});
});

QUnit.test('Post message responsive tells the slot a responsive creative is loaded', function (assert) {
	const done = assert.async();
	const slotName = 'responsive-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.responsive", "name": "' + slotName + '"}', '*');
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.stub(slot, 'setResponsiveCreative', function () {
		assert.ok(slot.setResponsiveCreative.calledWith(true), 'the setResponsiveCreative method is called');
		done();
	});
});


QUnit.test('Post message resize message fire the resize event', function (assert) {
	const done = assert.async();
	const slotName = 'resize-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.resize", "name": "' + slotName + '", "size": [300, 250]}', '*');
	});

	document.body.addEventListener('oAds.resize', function () {
		assert.ok(event.detail.slot, 'The resize event is fired ');
		assert.equal(event.detail.name, slotName, 'the name is ' + slotName);
		assert.deepEqual(event.detail.size, [300, 250], 'the correct size is passed');
		done();
	});

	this.ads.init();
	this.ads.slots.initSlot(container);
});

QUnit.test('Passed touch fires an event', function (assert) {
	const done = assert.async();
	const slotName = 'touch-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function () {
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
