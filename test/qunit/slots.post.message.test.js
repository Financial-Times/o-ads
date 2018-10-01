/* globals QUnit: false */

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
	});

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
	});

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami", "collapse": true}', '*');
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message whoami message with isMaster will fire event on companion slots', function (assert) {
	const done = assert.async();
	const master = this.fixturesContainer.add('<div data-o-ads-name="master" data-o-ads-formats="Leaderboard"></div>');
	const companion = this.fixturesContainer.add('<div data-o-ads-name="companion" data-o-ads-companion="true" data-o-ads-formats="MediumRectangle"></div>');
	const notCompanion = this.fixturesContainer.add('<div data-o-ads-name="not-companion" data-o-ads-formats="MediumRectangle" data-o-ads-companion="false"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'master';
	});

	this.stub(this.utils.messenger, 'post', function () {
		assert.ok(companionSlot.fire.called, 'the event is is called on the companion');
		assert.equal(companionSlot.container.getAttribute('data-o-ads-master-loaded'), 'Leaderboard');
		assert.notOk(masterSlot.fire.called, 'the event method is not called on the master');
		assert.notOk(notCompanionSlot.fire.called, 'the collapse method is not called on a non companion');
		done();
	});

	document.body.addEventListener('oAds.ready', function (slot) {
		if(slot.detail.name === 'master') {
			window.postMessage('{ "type": "oAds.whoami", "mastercompanion": true}', '*');
		}
	});

	this.ads.init();
	const masterSlot = this.ads.slots.initSlot(master);
	const companionSlot = this.ads.slots.initSlot(companion);
	const notCompanionSlot = this.ads.slots.initSlot(notCompanion);
	this.spy(masterSlot, 'fire');
	this.spy(companionSlot, 'fire');
	this.spy(notCompanionSlot, 'fire');
});

QUnit.test('Post message from unknown slot logs an error and sends a repsonse', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return 'unknown-slot';
	});


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


QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present on attribute', function (assert) {
	const done = assert.async();
	const slotName = 'whoami-collapse-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle" data-o-ads-disable-swipe-default="true"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});

	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefaultSwipeHandler, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	});

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});

	this.ads.init();
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});

QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present in slot config', function (assert) {
	const done = assert.async();
	const slotName = 'test';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefaultSwipeHandler, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	});

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});
	this.ads.init({slots: {test: {disableSwipeDefault: true}}});
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});


QUnit.test('Post message replies with correct disable default swipe handler parameter if config is present in global config', function (assert) {
	const done = assert.async();
	const slotName = 'test';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	this.stub(this.utils.messenger, 'post', function (message, source) {
		assert.equal(message.type, 'oAds.youare', 'the event type is oAds.youare');
		assert.equal(message.name, slotName, 'the name is ' + slotName);
		assert.equal(message.disableDefaultSwipeHandler, true, 'the default handler disable flag is present');
		assert.strictEqual(window, source, ' the source is the as expected');
		done();
	});

	document.body.addEventListener('oAds.ready', function () {
		window.postMessage('{ "type": "oAds.whoami"}', '*');
	});
	this.ads.init({disableSwipeDefault: true});
	const slot = this.ads.slots.initSlot(container);
	this.spy(slot, 'collapse');
});


QUnit.test('Post message catches the event when the message comes not from a slot that is does not exist', function (assert) {
	const done = assert.async();
	const slotName = 'responsive-ad';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="HalfPage,MediumRectangle"></div>');
	document.body.addEventListener('oAds.ready', function () {
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

QUnit.test('Post message collapse calls the collapse method on the slot', function (assert) {
	const done = assert.async();
	const slotName = 'custom-message';
	const container = this.fixturesContainer.add('<div data-o-ads-name="' + slotName + '" data-o-ads-formats="MediumRectangle"></div>');
	this.stub(this.utils, 'iframeToSlotName', function () {
		return slotName;
	});
	document.body.addEventListener('oAds.complete', function () {
		window.postMessage('{"collapse":false,"mastercompanion":false,"customMessages":{"arrow-buttons-disabled":"true"},"type":"oAds.whoami","name":"custom-message"}', '*');

	});
	document.body.addEventListener("oAds.customMessages", function() {
	 assert.equal(event.detail.name, 'custom-message', 'test slot fired the customMessages event');
	 	done();
	});
	this.ads.init();
	this.ads.slots.initSlot(container);
});
