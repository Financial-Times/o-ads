/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
'use strict';

QUnit.module('Chartbeat', {
	beforeEach: function() {
		window.pSUPERFLY = {refreshAd: this.stub() };
		this.node = this.fixturesContainer.add('<div data-o-ads-name="advert"></div>');
		this.basic = {
			slots: {
				advert: { formats: ['Rectangle'] }
			}
		};
	},
	afterEach: function() {
		delete window.pSUPERFLY;
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
