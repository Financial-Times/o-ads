/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
'use strict';

QUnit.module('Slots - post message', {
	beforeEach: function() {
		window.scrollTo(0, 0);
		var eventListeners = this.eventListeners = [];
		eventListeners;
		var _addEventListener = window.addEventListener;
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
	var done = assert.async();
	var slotName = 'whoami-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function (message, source) {
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
	var slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message whoami message with collapse will call slot collapse', function (assert) {
	var done = assert.async();
	var slotName = 'whoami-collapse-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function (message, source) {
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
	var slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message collapse calls the collapse method on the slot', function (assert) {
	var done = assert.async();
	var slotName = 'collapse-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	document.body.addEventListener('oAds.complete', function () {
		window.postMessage('{ "type": "oAds.collapse", "name": "' + slotName + '"}', '*');
	});

	this.ads.init();
	var slot = this.ads.slots.initSlot(container);
	this.stub(slot, 'collapse', function () {
		assert.ok(slot.collapse.called, 'the collapse method is called');
		done();
	});
});

QUnit.test('Post message responsive tells the slot a responsive creative is loaded', function (assert) {
	var done = assert.async();
	var slotName = 'responsive-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.responsive", "name": "' + slotName + '"}', '*');
	});

	this.ads.init();
	var slot = this.ads.slots.initSlot(container);
	this.stub(slot, 'setResponsiveCreative', function () {
		assert.ok(slot.setResponsiveCreative.calledWith(true), 'the setResponsiveCreative method is called');
		done();
	});
});


QUnit.test('Post message resize message fire the resize event', function (assert) {
	var done = assert.async();
	var slotName = 'resize-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

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
