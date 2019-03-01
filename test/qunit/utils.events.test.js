/* globals QUnit: false */

'use strict'; //eslint-disable-line

QUnit.module('utils.events');


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

QUnit.test('We can broadcast an from an element', function(assert) {
	const utils = this.ads.utils;
	const done = assert.async();

	const element = document.createElement('div');
	this.fixturesContainer.appendChild(element);
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

	this.fixturesContainer.appendChild(element);
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
