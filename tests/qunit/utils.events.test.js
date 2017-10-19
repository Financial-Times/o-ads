/* globals assert */

'use strict'; //eslint-disable-line

describe('utils.events', function () {

	it('We can broadcast an event to the body', function (done) {
		const utils = this.ads.utils;


		document.body.addEventListener('oAds.ahoy', function (ev) {
			assert.strictEqual(ev.type, 'oAds.ahoy', 'the event type is set');
			assert.strictEqual(ev.detail.hello, 'there', 'details are added to the event object');
			done();
		});

		utils.broadcast('ahoy', {
			hello: 'there'
		});
	});

	it('We can broadcast an from an element', function (done) {
		const utils = this.ads.utils;


		const element = document.createElement('div');
		this.fixturesContainer.appendChild(element);
		element.addEventListener('oAds.ahoy', function (ev) {
			assert.strictEqual(ev.type, 'oAds.ahoy', 'the event type is set');
			assert.strictEqual(ev.detail.ahoy, 'hoy', 'details are added to the event object');
			done();
		});

		utils.broadcast('ahoy', {
			ahoy: 'hoy'
		}, element);
	});

	it('We can broadcast from an element and it bubbles to the body', function (done) {
		const utils = this.ads.utils;


		const element = document.createElement('div');
		function testFunc() { }

		this.fixturesContainer.appendChild(element);
		document.body.addEventListener('oAds.ahoy', function (ev) {
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

	it('We can listen to a one time event', function (done) {
		const utils = this.ads.utils;

		let listened = 0;

		utils.once('ahoy', function () {
			listened++;
		});

		setTimeout(function () {
			assert.equal(listened, 1, 'We only reacted to the first event');
			done();
		}, 750);

		utils.broadcast('ahoy', {
			there: 'matey',
		});

		utils.broadcast('ahoy', {
			there: 'again',
		});
	});
});