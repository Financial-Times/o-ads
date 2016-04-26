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

QUnit.test('Post message whoami message with isMaster will fire event on companion slots', function (assert) {
	var done = assert.async();
	var callCount = 0;
	var master = this.fixturesContainer.add('<div data-o-ads-name="master" data-o-ads-formats="Leaderboard"></div>');
	var companion = this.fixturesContainer.add('<div data-o-ads-name="companion" data-o-ads-companion="true" data-o-ads-formats="MediumRectangle"></div>');
	var notCompanion = this.fixturesContainer.add('<div data-o-ads-name="not-companion" data-o-ads-formats="MediumRectangle" data-o-ads-companion="false"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'master';
	});

	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.ok(companionSlot.fire.called, 'the event is is called on the companion');
		assert.equal(companionSlot.container.getAttribute('data-o-ads-master-loaded'), 'Leaderboard');
		assert.notOk(masterSlot.fire.called, 'the event method is not called on the master');
		assert.notOk(notCompanionSlot.fire.called, 'the collapse method is not called on a non companion');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', function (slot) {
		if(slot.detail.name === 'master') {
			window.postMessage('{ "type": "oAds.whoami", "mastercompanion": true}', '*');
		}
	});

	this.ads.init();
	var masterSlot = this.ads.slots.initSlot(master);
	var companionSlot = this.ads.slots.initSlot(companion);
	var notCompanionSlot = this.ads.slots.initSlot(notCompanion);
	this.spy(masterSlot, 'fire');
	this.spy(companionSlot, 'fire');
	this.spy(notCompanionSlot, 'fire');
});
QUnit.test('Post message from unknown slot logs an error and sends a repsonse', function (assert) {
	var done = assert.async();
	var slotName = 'whoami-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'unknown-slot';
	});

	var errorStub = this.stub(this.utils.log, 'error');

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

QUnit.test('Passed touch fires an event', function (assert) {
	var done = assert.async();
	var slotName = 'touch-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');

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


QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present on attribute', function (assert) {
	var done = assert.async();
	var slotName = 'whoami-collapse-ad';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle" data-o-ads-disable-swipe-default="true"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefault, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});

	this.ads.init();
	var slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present in slot config', function (assert) {
	var done = assert.async();
	var slotName = 'test';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefault, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});
	this.ads.init({slots: {test: {disableSwipeDefault: true}}});
	var slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});


QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present in global config', function (assert) {
	var done = assert.async();
	var slotName = 'test';
	var container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefault, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	}.bind(this));

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});
	this.ads.init({disableSwipeDefault: true});
	var slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});
