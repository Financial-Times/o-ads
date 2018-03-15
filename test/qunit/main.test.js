/* globals QUnit: false: false */

'use strict'; //eslint-disable-line

const fetchMock = require('fetch-mock');

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

QUnit.test('init fires an event once done', function(assert) {

	const done = assert.async();
	const ads = new this.adsConstructor();
	assert.equal(ads.isInitialised, undefined);
	document.body.addEventListener('oAds.initialised', function(e) {
		assert.equal(e.detail, ads);
		assert.equal(ads.isInitialised, true);
		done();
	});
	ads.init();
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

QUnit.test('updateContext updates the config and redoes the API calls', function(assert) {
	const done = assert.async();
	const ads = new this.adsConstructor();
	const gptInit = this.spy(this.ads.gpt, 'init');
	const userDataStub = this.stub(this.ads.api, 'getUserData');
	const kruxPixelStub = this.stub(this.ads.krux, 'sendNewPixel');
	const kruxAttributesStub = this.stub(this.ads.krux, 'setAllAttributes');
	const updatePageTargetingStub = this.stub(this.ads.gpt, 'updatePageTargeting');

	userDataStub.returns(Promise.resolve({ dfp: { targeting: [{key: 'a', value: '1'}, { key: 'b', value: '2'}]}}));
	ads.init({ gpt: {  network: '1234', site: 'abc', zone: '123' }, targetingApi:{ user: 'https://www.google.com'}, krux: { id: 'hello' }})
	.then(function() {
			assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '123' });
			assert.equal(ads.targeting.get().a, '1');
			assert.equal(ads.targeting.get().b, '2');

			//change the user
			userDataStub.returns(Promise.resolve({ dfp: { targeting: [{key: 'b', value: '1'}, { key: 'c', value: '2'}]}}));
			kruxAttributesStub.reset();

			ads.updateContext({ gpt: { zone: '456' }, targetingApi: { user: 'https://www.google.com' }}, true)
			.then(function() {
				assert.ok(kruxPixelStub.calledOnce, 'krux pixel send for new page view');	
				assert.ok(kruxAttributesStub.calledOnce, 'resets the krux attributes');	
				assert.ok(updatePageTargetingStub.calledOnce, 'updates the GPT targeting');	
				assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '456' });
				assert.equal(ads.targeting.get().a, undefined);
				assert.equal(ads.targeting.get().b, '1');
				assert.equal(ads.targeting.get().c, '2');
				done();
			}.bind(this));

	}.bind(this));


});

QUnit.test("debug calls modules' debug functions", function(assert) {
	const gptDebug = this.spy(this.ads.gpt, 'debug');
	const kruxDebug = this.spy(this.ads.krux, 'debug');
	const slotsDebug = this.spy(this.ads.slots, 'debug');
	const targetingDebug = this.spy(this.ads.targeting, 'debug');

	this.ads.debug();

	assert.ok(gptDebug.called, 'gpt debug function is called');
	assert.ok(kruxDebug.called, 'Krux debug function is called');
	assert.ok(slotsDebug.called, 'Slots debug function is called');
	assert.ok(targetingDebug.called, 'Targeting debug function is called');

});

QUnit.test('updateContext updates the config only if no API calls', function(assert) {
	const done = assert.async();
	const ads = new this.adsConstructor();
	const gptInit = this.spy(this.ads.gpt, 'init');
	const userDataStub = this.stub(this.ads.api, 'getUserData');
	userDataStub.returns(Promise.resolve({ dfp: { targeting: [{key: 'a', value: '1'}, { key: 'b', value: '2'}]}}));
	ads.init({ gpt: {  network: '1234', site: 'abc', zone: '123' }, targetingApi:{ user: 'https://www.google.com'}})
	.then(function() {
			assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '123' });
			assert.equal(this.ads.targeting.get().a, '1');
			assert.equal(this.ads.targeting.get().b, '2');

			//change the user
			ads.updateContext({ gpt: { zone: '456' }})
			.then(function() {
				
				assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '456' });
				assert.equal(this.ads.targeting.get().a, '1');
				assert.equal(this.ads.targeting.get().b, '2');
				done();
			}.bind(this));

	}.bind(this));


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

QUnit.test("init() calls initLibrary() if no targeting or bot APIs are set", function(assert) {
	const initLibrarySpy = this.spy(this.ads, 'initLibrary');
	this.ads.init();
	assert.ok(initLibrarySpy.called, 'initLibrary() function is called');
	
});


QUnit.test("oAds library is NOT initialised if a botVsHumanAPI decides the user is a robot", function(assert) {
	const done = assert.async();
	const initLibrarySpy = this.spy(this.ads, 'initLibrary');
	
	fetchMock.get('http://ads-api.ft.com/v1/validate-traffic', { isRobot: true });
	
	this.ads.init({
		botVsHumanApi: 'http://ads-api.ft.com/v1/validate-traffic'
	}).then(() => {
		assert.notOk(initLibrarySpy.called, 'initLibrary() shouldn\'t be called');
		done();
	}).catch(e => {
		assert.equal(e.message, 'Invalid traffic detected');
		done();
	});
	
	fetchMock.restore();
});

QUnit.test("oAds library is initialised if a botVsHumanAPI decides the user is NOT a robot", function(assert) {
	const done = assert.async();
	const initLibrarySpy = this.spy(this.ads, 'initLibrary');
	
	fetchMock.get('http://ads-api.ft.com/v1/validate-traffic', { isRobot: false });
	fetchMock.get('http://ads-api.ft.com/v1/user', 200);
	fetchMock.get('http://ads-api.ft.com/v1/page', 200);
	
	this.ads.init({
		targetingApi: {
			user: 'http://ads-api.ft.com/v1/user',
			page: 'http://ads-api.ft.com/v1/page'
		},
		botVsHumanApi: 'http://ads-api.ft.com/v1/validate-traffic'
	}).then(() => {
		assert.ok(initLibrarySpy.called, 'initLibrary() was called');
		done();
	});
	
	fetchMock.restore();
});

QUnit.test("oAds library is initialised by default, even if there are API errors", function(assert) {
	const done = assert.async();
	const initLibrarySpy = this.spy(this.ads, 'initLibrary');
	
	fetchMock.get('http://ads-api.ft.com/v1/validate-traffic', 500);
	fetchMock.get('http://ads-api.ft.com/v1/user', 500);
	fetchMock.get('http://ads-api.ft.com/v1/page', 500);
	
	this.ads.init({
		targetingApi: {
			user: 'http://ads-api.ft.com/v1/user',
			page: 'http://ads-api.ft.com/v1/page'
		},
		botVsHumanApi: 'http://ads-api.ft.com/v1/validate-traffic'
	}).then(() => {
		assert.ok(initLibrarySpy.called, 'initLibrary() was called');
		done();
	});
	
	fetchMock.restore();
});
