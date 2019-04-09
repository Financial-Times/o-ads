/* globals QUnit: false, savePerformance: false */

'use strict'; //eslint-disable-line

const sandbox = sinon.sandbox.create();

QUnit.module('utils.events', {
	beforeEach: function () {
		window.performance = savePerformance;
		window.LUX = null;
	}
});

QUnit.test('We can broadcast an event to the body', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();

	document.body.addEventListener('oAds.ahoy', function(ev) {
		assert.strictEqual(ev.type, 'oAds.ahoy', 'the event type is set');
		assert.strictEqual(ev.detail.hello, 'there', 'details are added to the event object');
		done();
	});

	utils.broadcast('ahoy', {
		hello: 'there'
	});
});

QUnit.test('An event creates a performance mark', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();
	const performanceStub = sandbox.stub(window.performance, 'mark');

	document.body.addEventListener('oAds.ahoy', function() {
		assert.ok(performanceStub.calledWith('oAds.ahoy'));
		performanceStub.restore();
		done();
	});

	utils.broadcast('ahoy', {
		hello: 'there'
	});
});

QUnit.test('An event creates a perfMark using "name, size and pos" from event details', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();
	const performanceStub = sandbox.stub(window.performance, 'mark');

	document.body.addEventListener('oAds.ahoy', function() {
		assert.ok(performanceStub.calledWith('oAds.ahoy__thepos__thename__thesize'));
		performanceStub.restore();
		done();
	});

	utils.broadcast('ahoy', {
		pos: 'thepos',
		name: 'thename',
		size: 'thesize'
	});
});

QUnit.test('We can broadcast an from an element', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();

	const element = document.createElement('div');
	this.fixturesContainer.get().appendChild(element);
	element.addEventListener('oAds.ahoy', function(ev) {
		assert.strictEqual(ev.type, 'oAds.ahoy', 'the event type is set');
		assert.strictEqual(ev.detail.ahoy, 'hoy', 'details are added to the event object');
		done();
	});

	utils.broadcast('ahoy', {
		ahoy: 'hoy'
	}, element);
});

QUnit.test('We can broadcast from an element and it bubbles to the body', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();

	const element = document.createElement('div');
	function testFunc() {}

	this.fixturesContainer.get().appendChild(element);
	document.body.addEventListener('oAds.ahoy', function(ev) {
		assert.strictEqual(ev.type, 'oAds.ahoy', 'the event type is set');
		assert.strictEqual(ev.detail.there, 'matey', 'details are added to the event object');
		assert.strictEqual(ev.detail.func, testFunc, 'you can pass functions around!');
		done();
	});

	utils.broadcast('ahoy', {
		there: 'matey',
		func: testFunc
	}, element);
});

QUnit.test('We can subscribe to an event', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();
	const stub = sinon.stub();

	utils.on('ahoy', stub);

	setTimeout(function() {
		assert.ok(stub.calledTwice, 'We reacted to the events');
		stub.reset();
		done();
	}, 750);

	utils.broadcast('ahoy', {
		there: 'matey',
	});

	utils.broadcast('ahoy', {
		there: 'again',
	});
});

QUnit.test('We can unsubscribe from an event', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();
	const stub = sinon.stub();

	utils.on('ahoy', stub);

	setTimeout(function() {
		utils.off('ahoy', stub);
		utils.broadcast('ahoy', { there: 'arrr' });
		assert.ok(stub.calledTwice, 'We reacted to the events only before off');
		stub.reset();
		done();
	}, 750);

	utils.broadcast('ahoy', {
		there: 'matey',
	});

	utils.broadcast('ahoy', {
		there: 'again',
	});
});

QUnit.test('We can listen to a one time event', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();
	const stub = sinon.stub();

	utils.once('ahoy',stub);

	setTimeout(function() {
		assert.ok(stub.calledOnce, 'We only reacted to the first event');
		stub.reset();
		done();
	}, 750);

	utils.broadcast('ahoy', {
		there: 'matey',
	});

	utils.broadcast('ahoy', {
		there: 'again',
	});
});
