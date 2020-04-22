/* globals QUnit: false: false */

'use strict'; //eslint-disable-line

const fetchMock = require('fetch-mock');

QUnit.module('Main', {
	beforeEach: function() {
		this.deleteCookie('FTConsent');
	}
});

QUnit.test('oAds is exposed on the window object', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');

	const ads = new this.adsConstructor(); //eslint-disable-line new-cap
	const done = assert.async();

	document.body.addEventListener('oAds.slotReady', function() {
		document.body.addEventListener('oAds.initialised', function() {
			assert.deepEqual(window.oAds, ads);
			done();
		});

		ads.init();
	});

	this.trigger(document, 'o.DOMContentLoaded');
});

QUnit.test('init All', function(assert) {
	const done = assert.async();
	this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');

	document.body.addEventListener('oAds.slotReady', function(event) {
		assert.equal(event.detail.name, 'banlb2', 'our test slot is requested');
		assert.deepEqual(event.detail.slot.sizes, [[300, 250]], 'with the correct sizes');
		done();
	});
	this.trigger(document, 'o.DOMContentLoaded');
});

QUnit.test("init fires an event when it's called", function(assert) {
	const done = assert.async();
	const ads = new this.adsConstructor(); //eslint-disable-line new-cap
	document.body.addEventListener('oAds.initialising', function() {
		assert.ok(true);
		done();
	});
	ads.init();
});

QUnit.test('init fires an event once done', function(assert) {

	const done = assert.async();
	const ads = new this.adsConstructor(); //eslint-disable-line new-cap
	assert.equal(ads.isInitialised, undefined);
	document.body.addEventListener('oAds.initialised', function(e) {
		assert.equal(e.detail, ads);
		assert.equal(ads.isInitialised, true);
		done();
	});
	ads.init();
});

QUnit.test('init all only is triggered once', function(assert) {
	const ads = new this.adsConstructor(); // eslint-disable-line new-cap
	const gptInit = this.spy(ads.gpt, 'init');

	assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called once via initAll');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once via multiple initAll calls');
});

QUnit.test('manual inits always trigger but DOM inits do not override', function (assert) {
	const ads = new this.adsConstructor(); //eslint-disable-line new-cap
	const gptInit = this.spy(ads.gpt, 'init');

	assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

	ads.init();
	assert.ok(gptInit.calledOnce, 'gpt init function is called once via manual init');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once despite subsequent DOMContentLoaded event');


	ads.init();
	assert.ok(gptInit.calledTwice, 'manual init call does re-initialise');
});

QUnit.test('ads.init().then will receive an object even if moat fails to load', function(assert) {
	const done = assert.async();
	const initSpy = this.spy(this.ads, 'init');
	this.ads.init({ validateAdsTraffic: true });
	this.trigger(document, 'o.DOMContentLoaded');
	const promise = initSpy.returnValues[0];
	promise.then( res => {
		assert.equal(typeof res, 'object');
		done();
	});
});


QUnit.test('ads.init() ads the targeting options to itself', function(assert) {
	const targetingSpy = this.spy(this.ads.targeting, 'add');
	const options = {
		targeting: {
			key: "value",
			anotherKey: "anotherValue"
		}
	};
	this.ads.init(options);
	assert.ok(targetingSpy.calledWith(options.targeting), 'targeting options added using targeting.add()');
});

QUnit.test('updateTargeting()', function(assert) {
	const done = assert.async();
	const ads = new this.adsConstructor(); //eslint-disable-line new-cap
	const updatePageTargetingStub = this.stub(this.ads.gpt, 'updatePageTargeting');
	const options = {
		gpt: {
			network: '1234',
			site: 'abc',
			zone: '123'
		},
		targeting: {
			key1: 'value1',
			key2: 'value2'
		}
	};

	document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';

	ads.init(options).then(() => {
		assert.equal(ads.targeting.get().key1, 'value1');
		assert.equal(ads.targeting.get().key2, 'value2');

		ads.updateTargeting({
			key1: 'updated-value',
			key3: 'new-value'
		});

		assert.equal(ads.targeting.get().key1, 'updated-value');
		assert.equal(ads.targeting.get().key3, 'new-value');
		assert.ok(updatePageTargetingStub.calledOnce, 'updates the GPT targeting');
		done();
	});
});

QUnit.test("debug calls modules' debug functions", function(assert) {
	const gptDebug = this.spy(this.ads.gpt, 'debug');
	const slotsDebug = this.spy(this.ads.slots, 'debug');
	const targetingDebug = this.spy(this.ads.targeting, 'debug');

	this.ads.debug();

	assert.ok(gptDebug.called, 'gpt debug function is called');
	assert.ok(slotsDebug.called, 'Slots debug function is called');
	assert.ok(targetingDebug.called, 'Targeting debug function is called');

});

QUnit.test("debug doesn't unset oAds if it was set", function(assert) {

	const gptDebug = this.spy(this.ads.gpt, 'debug');
	this.localStorage({'oAds': true});
	this.ads.debug();

	assert.ok(gptDebug.called, 'gpt debug function is called');
	assert.ok(localStorage.getItem('oAds'), "oAds value in local storage wasn't removed");
});

QUnit.test("debug sets and unsets oAds in local storage if it wasn't set", function(assert) {
	const gptDebug = this.spy(this.ads.gpt, 'debug');
	this.ads.debug();
	assert.ok(gptDebug.called, 'gpt debug function is called');
	assert.notOk(localStorage.getItem('oAds'), 'oAds value in local storage was removed');
});


QUnit.test("init() calls initLibrary()", function(assert) {
	const initLibrarySpy = this.spy(this.ads, 'initLibrary');
	this.ads.init();
	assert.ok(initLibrarySpy.called, 'initLibrary() function is called');

});

QUnit.test("No cc targeting parameter is set if the library is initialised with cookieconsent disabled", function(assert) {
	const done = assert.async();
	this.ads.init({disableConsentCookie: true}).then(() => {
		assert.equal(this.ads.targeting.get().cc, undefined);
		done();
	});
	fetchMock.restore();
});


QUnit.test("cc targeting parameter is set to 'y' when consentCookie is present and programmatic consent is true", function(assert) {
	const done = assert.async();
	document.cookie = 'FTConsent=behaviouraladsOnsite%3Aoff%2CprogrammaticadsOnsite%3Aon;';

	this.ads.init().then(() => {
		assert.equal(this.ads.targeting.get().cc, 'y');
		done();
	});
	document.cookie = ' ';
	fetchMock.restore();
});

QUnit.test("If validateAdsTraffic option is true, moat script runs before o-ads library initialises", function(assert) {
	const moatInitSpy = this.spy(this.ads.moat, 'init');
	this.ads.init({ validateAdsTraffic: true });
	assert.ok(moatInitSpy.called, 'moat.init() function is called');
});

QUnit.test("moat script loading check is eventually cleared if moat is loaded", function(assert) {
	const clearIntSpy = this.spy(window, 'clearInterval');
	window.moatPrebidApi = {};
	this.ads.moat.init();
	const done = assert.async();

	setTimeout( () => {
		assert.ok(clearIntSpy.called);
		done();
	}, 1000);
});

QUnit.test("moat script loading check is eventually cleared if moat is not loaded", function(assert) {
	this.spy(this.utils, 'broadcast');
	const clearIntSpy = this.spy(window, 'clearInterval');
	window.moatPrebidApi = null;
	this.ads.moat.init();
	const done = assert.async();

	setTimeout( () => {
		assert.ok(this.ads.utils.broadcast.calledWith('moatTimeout'));
		assert.ok(clearIntSpy.called);
		done();
	}, 1000);
});

QUnit.test("A 'IVTComplete' event is fired if moat IVT cannnot be checked", function(assert) {
	this.spy(this.utils, 'broadcast');
	window.moatPrebidApi = null;
	this.ads.moat.init();

	const done = assert.async();

	setTimeout( () => {
		assert.ok(this.ads.utils.broadcast.calledWith('IVTComplete'));
		done();
	}, 1000);
});

QUnit.test("A 'IVTComplete' event is fired if moat IVT can be checked", function(assert) {
	this.spy(this.utils, 'broadcast');
	window.moatPrebidApi = {};
	this.ads.moat.init();

	const done = assert.async();

	setTimeout( () => {
		assert.ok(this.ads.utils.broadcast.calledWith('IVTComplete'));
		done();
	}, 1000);
});

QUnit.test(".version logs the right format", function(assert) {
	const consoleSpy = this.spy(this.utils, 'log');
	this.ads.init({ validateAdsTraffic: true });
	this.ads.version();
	const loggedMessage = consoleSpy.args[0][0];
	assert.ok(/o-ads version: \d\d?\.\d\d?\.\d\d?/.test(loggedMessage));
});

