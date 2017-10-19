/* globals assert */

'use strict'; //eslint-disable-line

describe('Main', function () {

	it('init All', function (done) {

		this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');

		document.body.addEventListener('oAds.ready', function (event) {
			assert.equal(event.detail.name, 'banlb2', 'our test slot is requested');
			assert.deepEqual(event.detail.slot.sizes, [[300, 250]], 'with the correct sizes');
			done();
		});
		this.trigger(document, 'o.DOMContentLoaded');
	});

	it('init fires an event once done', function (done) {


		const ads = new this.adsConstructor(); // eslint-disable-line new-cap
		assert.equal(ads.isInitialised, undefined);
		document.body.addEventListener('oAds.initialised', function (e) {
			assert.equal(e.detail, ads);
			assert.equal(ads.isInitialised, true);
			done();
		});
		ads.init();
	});

	it('init all only is triggered once', function () {
		const ads = new this.adsConstructor(); // eslint-disable-line new-cap
		const gptInit = this.spy(ads.gpt, 'init');

		assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

		this.trigger(document, 'o.DOMContentLoaded');
		assert.ok(gptInit.calledOnce, 'gpt init function is called once via initAll');

		this.trigger(document, 'o.DOMContentLoaded');
		assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once via multiple initAll calls');
	});

	it('manual inits always trigger but DOM inits do not override', function () {
		const ads = new this.adsConstructor(); // eslint-disable-line new-cap
		const gptInit = this.spy(ads.gpt, 'init');

		assert.equal(gptInit.callCount, 0, 'gpt init function is not called on construction');

		ads.init();
		assert.ok(gptInit.calledOnce, 'gpt init function is called once via manual init');

		this.trigger(document, 'o.DOMContentLoaded');
		assert.ok(gptInit.calledOnce, 'gpt init function is called exactly once despite subsequent DOMContentLoaded event');


		ads.init();
		assert.ok(gptInit.calledTwice, 'manual init call does re-initialise');
	});

	it('updateContext updates the config and redoes the API calls', function (done) {

		const ads = new this.adsConstructor(); // eslint-disable-line new-cap
		this.spy(this.ads.gpt, 'init');
		const userDataStub = this.stub(this.ads.api, 'getUserData');
		const kruxPixelStub = this.stub(this.ads.krux, 'sendNewPixel');
		const kruxAttributesStub = this.stub(this.ads.krux, 'setAllAttributes');
		const updatePageTargetingStub = this.stub(this.ads.gpt, 'updatePageTargeting');

		userDataStub.returns(Promise.resolve({ dfp: { targeting: [{ key: 'a', value: '1' }, { key: 'b', value: '2' }] } }));
		ads.init({ gpt: { network: '1234', site: 'abc', zone: '123' }, targetingApi: { user: 'https://www.google.com' }, krux: { id: 'hello' } })
			.then(function () {
				assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '123' });
				assert.equal(ads.targeting.get().a, '1');
				assert.equal(ads.targeting.get().b, '2');

				//change the user
				userDataStub.returns(Promise.resolve({ dfp: { targeting: [{ key: 'b', value: '1' }, { key: 'c', value: '2' }] } }));
				kruxAttributesStub.reset();

				ads.updateContext({ gpt: { zone: '456' }, targetingApi: { user: 'https://www.google.com' } }, true)
					.then(function () {
						assert.ok(kruxPixelStub.calledOnce, 'krux pixel send for new page view');
						assert.ok(kruxAttributesStub.calledOnce, 'resets the krux attributes');
						assert.ok(updatePageTargetingStub.calledOnce, 'updates the GPT targeting');
						assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '456' });
						assert.equal(ads.targeting.get().a, undefined);
						assert.equal(ads.targeting.get().b, '1');
						assert.equal(ads.targeting.get().c, '2');
						done();
					});

			});


	});

	it("debug calls modules' debug functions", function () {
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

	it('updateContext updates the config only if no API calls', function (done) {

		const ads = new this.adsConstructor(); // eslint-disable-line new-cap
		this.spy(this.ads.gpt, 'init');
		const userDataStub = this.stub(this.ads.api, 'getUserData');
		userDataStub.returns(Promise.resolve({ dfp: { targeting: [{ key: 'a', value: '1' }, { key: 'b', value: '2' }] } }));
		ads.init({ gpt: { network: '1234', site: 'abc', zone: '123' }, targetingApi: { user: 'https://www.google.com' } })
			.then(function () {
				assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '123' });
				assert.equal(this.ads.targeting.get().a, '1');
				assert.equal(this.ads.targeting.get().b, '2');

				//change the user
				ads.updateContext({ gpt: { zone: '456' } })
					.then(function () {

						assert.deepEqual(ads.config('gpt'), { network: '1234', site: 'abc', zone: '456' });
						assert.equal(this.ads.targeting.get().a, '1');
						assert.equal(this.ads.targeting.get().b, '2');
						done();
					}.bind(this));

			}.bind(this));


	});
	it("debug doesn't unset oAds if it was set", function () {

		const gptDebug = this.spy(this.ads.gpt, 'debug');
		this.localStorage({ 'oAds': true });
		this.ads.debug();

		assert.ok(gptDebug.called, 'gpt debug function is called');
		assert.ok(localStorage.getItem('oAds'), "oAds value in local storage wasn't removed");
	});

	it("debug sets and unsets oAds in local storage if it wasn't set", function () {
		const gptDebug = this.spy(this.ads.gpt, 'debug');
		this.ads.debug();
		assert.ok(gptDebug.called, 'gpt debug function is called');
		assert.notOk(localStorage.getItem('oAds'), 'oAds value in local storage was removed');
	});
});
