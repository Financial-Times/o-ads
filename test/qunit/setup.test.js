/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, sinon: false, $: false, jQuery: false */

'use strict'; //eslint-ignore-line

QUnit.module('Test setup');

QUnit.test('Global Dependencies', function(assert) {
	assert.ok(sinon, 'sinon is available');
	assert.ok($ && jQuery, 'jQuery is available');
});

QUnit.test('Local Dependencies', function(assert) {
	this.ads.unique = false; // this isn't part of this test but is used in the next test
	assert.ok(this.ads, 'The ads module is available');
});

QUnit.test('Tests are atomic', function(assert) {
	assert.strictEqual(this.ads.unique, undefined, 'The ads module is a unique instance');
});

QUnit.test('The fixtures container is available and we can append HTML', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div id="something-something"></div>');
	assert.ok($('#something-something').size(), 'the element was attached to the container');
});

QUnit.test('The fixtures container emptied after each test', function(assert) {
	assert.equal($('#something-something').size(), 0, 'the element is gone');
});

QUnit.test('Basic Sinon methods are available via this', function(assert) {
	assert.ok(this.spy, 'Sinon spy');
	assert.ok(this.stub, 'Sinon stub');
	assert.ok(this.mock, 'Sinon mock');
});

QUnit.test('Sinon fake timers are available', function(assert) {
	const clock = this.date(1);
	assert.equal((new Date()).valueOf(), 1, 'the date object is now mocked');
	clock.tick(1);
	assert.equal((new Date()).valueOf(), 2, 'a tick of the clock now pushes the date forward');
});

const _XMLHttpRequest = window.XMLHttpRequest;
QUnit.test('Sinon fake server is available', function(assert) {
	this.server();
	assert.notEqual(window.XMLHttpRequest, _XMLHttpRequest, 'XMLHttpRequest is mocked');
});

QUnit.test('Sinon fake server is restored automatically', function(assert) {
	assert.equal(window.XMLHttpRequest, _XMLHttpRequest, 'XMLHttpRequest is not mocked');
});

QUnit.test('Meta data mock adds tags to the page', function(assert) {
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

QUnit.test('Meta data mocks are removed after the test', function(assert) {
	assert.equal($('meta[name="basic"][content="tag"').size(), 0, 'basic tag gone');
	assert.equal($('meta[name="complex"][content="tag"][with="attribute"]').size(), 0, 'complex tag gone');
});

const _localStorage = window.localStorage;
QUnit.test('localStorage mocking', function(assert) {
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

QUnit.test('localStorage is restored after test', function(assert) {
	assert.equal(window.localStorage, _localStorage, 'localStorage is not mocked');
	assert.strictEqual(localStorage.getItem('Brandon'), null, 'Mock data is not in localStorage');
});

QUnit.test('Cookies mocking', function(assert) {
	$.cookie('monkey', 'see');
	this.cookies({monkey: 'do'});
	assert.equal(this.ads.utils.cookie('monkey'), 'do', 'Mocked cookie value is returned');
});

QUnit.test('Cookies restored', function(assert) {
	assert.strictEqual($.cookie('monkey'), 'see', 'Real cookie value is returned');
	$.removeCookie('monkey');
});
