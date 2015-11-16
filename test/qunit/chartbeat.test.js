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
			var _push = window._cba.push;

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
	var config = this.basic;
	config.chartbeat = true;

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	var slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'advert', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('slot configuration', function(assert) {
	var config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = true;

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	var slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'advert', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('override name', function(assert) {
	var config = this.basic;
	config.chartbeat = true;
	config.slots.advert.chartbeat = 'override';

	this.ads.init(config);
	this.ads.slots.initSlot(this.node);
	var slot = this.ads.slots.advert;
	assert.equal(slot.container.getAttribute('data-cb-ad-id'), 'override', 'the chartbeat id attribute has been added to the slot');
});

QUnit.test('register gpt slots with the enaged refresh service', function(assert) {
	var done = assert.async();
	var config = this.basic;
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
	var done = assert.async();
	var config = this.basic;
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

QUnit.only('demographics configuration set', function(assert) {
	var config = {chartbeat : {'demographics' : {27 : 'PVT', 18 : 'TEST'} }};
	window._cbq.push = this.spy();
	this.ads.init(config);

	assert.ok(window._cbq.push.withArgs(["_demo", "18=TEST,27=PVT"]).calledOnce, 'demographic data has been queue on the chartbeat api');
});

QUnit.test('demographics configuration not set', function(assert) {
	var config = {};
	window._cbq.push = this.spy();
	this.ads.init(config);
	assert.ok((window._cbq.push.callCount === 0), 'no call has been made to chartbeat api');
});
