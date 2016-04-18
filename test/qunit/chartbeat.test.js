/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
'use strict';

QUnit.module('Chartbeat', {
	beforeEach: function() {
		window.pSUPERFLY = {
			refreshAd: this.stub(),
			registerGptSlot: this.stub()
		};

		function process(item) {
			item.call();
		}

		if (window._cba && window._cba.push) {
			const _push = window._cba.push;

			window._cba.forEach(process);
			window._cba.push = function(item) {
				process(item);
				_push(item);
			};
		}

		window._cbq = [];

		this.node = this.fixturesContainer.add('<div data-o-ads-name="advert"></div>');
		this.basic = {
			slots: {
				advert: { formats: ['Rectangle'] }
			}
		};
	},
	afterEach: function() {
		delete window.pSUPERFLY;
		delete window._cbq;
	}
});

QUnit.test('global configuration', function(assert) {
	const config = this.basic;
	config.chartbeat = true;

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	const slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'advert', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('slot configuration', function(assert) {
	const config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = true;

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	const slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'advert', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('loads chartbeat js file if configured', function(assert) {
	this.stub(this.utils, 'isScriptAlreadyLoaded').returns(false);
	this.ads.init({chartbeat: {loadsJS: true}});
	assert.ok(this.attach.calledWith('//static.chartbeat.com/js/chartbeat_pub.js', true), 'loads chartbeat script if one is not loaded yet');
});

QUnit.test('override name', function(assert) {
	const config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = 'override';

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	const slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'override', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('register gpt slots with the enaged refresh service', function(assert) {
	const done = assert.async();
	const config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = true;

	document.body.addEventListener('oAds.complete', function(event) {
		// assertions on next tick to make sure the refresh event has run
		setTimeout(function() {
			assert.equal(window._cba.length, 1, 'the gpt slot is queued with chartbeat.');
			done();
		}, 0);
	});

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
});

QUnit.test('the refreshAd method is called when refreshing the ad', function(assert) {
	const done = assert.async();
	const config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = true;

	document.body.addEventListener('oAds.refresh', function(event) {
		// assertions on next tick to make sure the refresh event has run
		setTimeout(function() {
			assert.ok(window.pSUPERFLY.refreshAd.called, 'the refreshAd method is called on refresh.');
			done();
		}, 0);
	});

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	this.ads.slots.advert.fire('refresh');
});

QUnit.test('demographics configuration set', function(assert) {
	const config = {chartbeat : {'demographics' : {27 : 'PVT', 18 : 'TEST'} }};
	window._cbq.push = this.spy();
	this.ads.init(config);

	assert.ok(window._cbq.push.withArgs(["_demo", "18=TEST,27=PVT"]).calledOnce, 'demographic data has been queue on the chartbeat api');
});

QUnit.test('demographics configuration not set', function(assert) {
	const config = {};
	window._cbq.push = this.spy();
	this.ads.init(config);
	assert.ok((window._cbq.push.callCount === 0), 'no call has been made to chartbeat api');
});

QUnit.test('sets global cbq if one is not available yet', function(assert) {
	const config = {chartbeat : {'demographics' : {27 : 'PVT', 18 : 'TEST'} }};
	delete window._cbq;
	this.ads.init(config);
	assert.ok((window._cbq), 'cbq is set in the init');
});

QUnit.test('debug returns early if no config is set', function(assert) {
	this.ads.init();
	const start = this.spy(this.utils.log, "start");

	this.ads.cb.debug();
	assert.notOk(start.called, "`utils.start` wasn't called");
});

QUnit.test('debug starts logging Chartbeat data', function(assert) {
	this.ads.init({chartbeat: {uid: '123'}});
	const start = this.spy(this.utils.log, 'start');
	const log = this.spy(this.utils, 'log');

	this.ads.cb.debug();

	assert.ok(start.calledWith('ChartBeat'), "`utils.start` was called for 'Chartbeat'");
	assert.ok(start.calledWith('Superfly Async Config'), "`utils.start` was called for 'Superfly Async Config'");
	assert.ok(log.calledWith('%c uid:'), "`utils.log` was called for 'uid'");
});

QUnit.test("debug doesn't log demographic data if not set", function(assert) {
	this.ads.init({chartbeat: {}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.cb.debug();

	assert.ok(start.calledWith('ChartBeat'), "`utils.start` was called for 'Chartbeat'");
	assert.notOk(start.calledWith('Demographic Codes'), "`utils.start` wasn't called for 'Demographic Codes'");
});

QUnit.test('debug logs demographic data if set', function(assert) {
	this.ads.init({chartbeat: {}});
	const start = this.spy(this.utils.log, 'start');

	this.ads.cb.demographicCodes = {};
	this.ads.cb.debug();

	assert.ok(start.calledWith('ChartBeat'), "`utils.start` was called for 'Chartbeat'");
	assert.ok(start.calledWith('Demographic Codes'), "`utils.start` was called for 'Demographic Codes'");
});
