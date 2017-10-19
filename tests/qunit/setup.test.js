/* globals assert, $, jQuery, sinon */

'use strict'; //eslint-disable-line

describe('Test setup', function () {

	it('Global Dependencies', function () {
		assert.ok(sinon, 'sinon is available');
		assert.ok($ && jQuery, 'jQuery is available');
	});

	it('Local Dependencies', function () {
		this.ads.unique = false; // this isn't part of this test but is used in the next test
		assert.ok(this.ads, 'The ads module is available');
	});

	it('Tests are atomic', function () {
		assert.strictEqual(this.ads.unique, undefined, 'The ads module is a unique instance');
	});

	it('The fixtures container is available and we can append HTML', function () {
		this.fixturesContainer.insertAdjacentHTML('beforeend', '<div id="something-something"></div>');
		assert.ok($('#something-something').size(), 'the element was attached to the container');
	});

	it('The fixtures container emptied after each test', function () {
		assert.equal($('#something-something').size(), 0, 'the element is gone');
	});

	it('Basic Sinon methods are available via this', function () {
		assert.ok(this.spy, 'Sinon spy');
		assert.ok(this.stub, 'Sinon stub');
		assert.ok(this.mock, 'Sinon mock');
	});

	it('Sinon fake timers are available', function () {
		const clock = this.date(1);
		assert.equal((new Date()).valueOf(), 1, 'the date object is now mocked');
		clock.tick(1);
		assert.equal((new Date()).valueOf(), 2, 'a tick of the clock now pushes the date forward');
	});

	const _XMLHttpRequest = window.XMLHttpRequest;
	it('Sinon fake server is available', function () {
		this.server();
		assert.notEqual(window.XMLHttpRequest, _XMLHttpRequest, 'XMLHttpRequest is mocked');
	});

	it('Sinon fake server is restored automatically', function () {
		assert.equal(window.XMLHttpRequest, _XMLHttpRequest, 'XMLHttpRequest is not mocked');
	});

	it('Meta data mock adds tags to the page', function () {
		this.meta({
			basic: 'tag',
			complex: {
				content: 'tag',
				with: 'attribute'
			}
		});

		assert.ok($('meta[name="basic"][content="tag"]').size(), 'basic tag');
		assert.ok($('meta[name="complex"][content="tag"][with="attribute"]').size(), 'complex tag');
	});

	it('Meta data mocks are removed after the test', function () {
		assert.equal($('meta[name="basic"][content="tag"').size(), 0, 'basic tag gone');
		assert.equal($('meta[name="complex"][content="tag"][with="attribute"]').size(), 0, 'complex tag gone');
	});

	const _localStorage = window.localStorage;
	it('localStorage mocking', function () {
		const localMocked = this.localStorage({
			Brandon: 'Bernier'
		});

		if (localMocked) {
			assert.notEqual(window.localStorage, _localStorage, 'localStorage is mocked');

			assert.equal(localStorage.getItem('Brandon'), 'Bernier', 'Can retieve an item from mock data');

			localStorage.setItem('Papa', 'Bear');
			assert.equal(localStorage.getItem('Papa'), 'Bear', 'Can set and retieve new items');

			localStorage.removeItem('Papa');
			assert.strictEqual(localStorage.getItem('Papa'), null, 'Can delete an item from mock data');

			assert.ok(localStorage.getItem.calledWith('Brandon'), 'getItem Stub can be used');
			assert.ok(localStorage.setItem.calledWith('Papa', 'Bear'), 'setItem stub can be used');
			assert.ok(localStorage.removeItem.calledWith('Papa'), 'removeItem stub can be used');
		} else {
			assert.ok(true, 'localStorage is unavailabe or unmockable in this browser');
			this.warn('local storage cannot be mocked in this browser!');
		}
	});

	it('localStorage is restored after test', function () {
		assert.equal(window.localStorage, _localStorage, 'localStorage is not mocked');
		assert.strictEqual(localStorage.getItem('Brandon'), null, 'Mock data is not in localStorage');
	});
});
