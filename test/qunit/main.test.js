/* globals QUnit: false: false */

'use strict'; //eslint-disable-line

QUnit.module('Main');

QUnit.test('init All', function(assert) {
	const done = assert.async();
	this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function(event) {
		assert.equal(event.detail.name, 'banlb2', 'our test slot is requested');
		assert.deepEqual(event.detail.slot.sizes, [[300, 250]], 'with the correct sizes');
		done();
	});
	this.trigger(document, 'o.DOMContentLoaded');
});

QUnit.test('init all only is triggered once', function(assert) {
	const ads = new this.adsConstructor();
	const gptInit = this.spy(ads.gpt, 'init');

	assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called once via initAll');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once via multiple initAll calls');
});

QUnit.test('manual inits always trigger but DOM inits do not override', function (assert) {
	const ads = new this.adsConstructor();
	const gptInit = this.spy(ads.gpt, 'init');

	assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

	ads.init();
	assert.ok(gptInit.calledOnce, 'gpt init function is called once via manual init');

	this.trigger(document, 'o.DOMContentLoaded');
	assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once despite subsequent DOMContentLoaded event');

	ads.init();
	assert.ok(gptInit.calledTwice, 'manual init call does re-initialise');
});

QUnit.test("debug calls modules' debug functions", function(assert) {
	const admantxDebug = this.spy(this.ads.admantx, 'debug');
	const gptDebug = this.spy(this.ads.gpt, 'debug');
	const kruxDebug = this.spy(this.ads.krux, 'debug');
	const slotsDebug = this.spy(this.ads.slots, 'debug');
	const targetingDebug = this.spy(this.ads.targeting, 'debug');

	this.ads.debug();

	assert.ok(admantxDebug.called, 'Admantx debug function is called');
	assert.ok(gptDebug.called, 'gpt debug function is called');
	assert.ok(kruxDebug.called, 'Krux debug function is called');
	assert.ok(slotsDebug.called, 'Slots debug function is called');
	assert.ok(targetingDebug.called, 'Targeting debug function is called');

});

QUnit.test("debug doesn't unset oAds if it was set", function(assert) {
	const admantxDebug = this.spy(this.ads.admantx, 'debug');

	this.localStorage({'oAds': true});
	this.ads.debug();

assert.ok(admantxDebug.called, 'Admantx debug function is called');
	assert.ok(localStorage.getItem('oAds'), "oAds value in local storage wasn't removed");
});

QUnit.test("debug sets and unsets oAds in local storage if it wasn't set", function(assert) {
	const admantxDebug = this.spy(this.ads.admantx, 'debug');

	this.ads.debug();

	assert.ok(admantxDebug.called, 'Admantx debug function is called');
	assert.notOk(localStorage.getItem('oAds'), 'oAds value in local storage was removed');
});
