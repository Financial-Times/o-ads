
/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, googletag: false */
"use strict";
QUnit.module('gpt', {
	beforeEach: function() {
		this.cookies({});
	}
});

QUnit.test('init', function(assert) {
	// delete the mock for this test
	delete window.googletag;

	this.ads.init();
	assert.ok(this.ads.utils.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true), 'google publisher tag library is attached to the page');
	assert.ok(window.googletag, 'placeholder googletag object is created');
	assert.ok(window.googletag.cmd.length, 'library setup is added tothe command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('set page targeting', function(assert) {
	this.ads.init({ dfp_targeting: ';some=test;targeting=params'});
	assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
	assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');
});

var htmlstart = '<div data-o-ads-name="';
var htmlend = '" data-o-ads-formats="MediumRectangle"></div>';
QUnit.test('set unit names', function(assert) {
	var done = assert.async();
	var expected = '/5887/some-dfp-site/some-dfp-zone';
	this.fixturesContainer.add(htmlstart + 'unit-name-full' + htmlend);
	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-full') {
			assert.strictEqual(slot.gpt.unitName, expected, 'setting unit name with site and zone works');
			done();
		}
	});

	this.ads.init({
		gpt: {
			network: '5887',
			site: 'some-dfp-site',
			zone: 'some-dfp-zone'
		}
	});
	this.ads.slots.initSlot('unit-name-full');
});

QUnit.test('set unit name site only', function(assert) {
	var done = assert.async();
	var expected = '/5887/some-dfp-site';
	this.fixturesContainer.add(htmlstart + 'unit-name-site-only' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-site-only') {
			assert.strictEqual(slot.gpt.unitName, expected, 'setting unit name with site and no zone works');
			done();
		}
	});

	this.ads.init({
		gpt: {
			network: '5887',
			site: 'some-dfp-site'
		}});
	this.ads.slots.initSlot('unit-name-site-only');
});

QUnit.test('set unit names network only', function(assert) {
	var done = assert.async();
	var expected = '/5887';
	this.fixturesContainer.add(htmlstart + 'unit-name-network-only' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-network-only') {
			assert.strictEqual(slot.gpt.unitName, expected, 'setting unit name with empty site and empty zone  just returns network');
			done();
		}
	});

	this.ads.init({
		gpt: {
			network: '5887'
		}
	});
	this.ads.slots.initSlot('unit-name-network-only');
});

QUnit.test('unit names with empty strings', function(assert) {

	var done = assert.async();
	var expected = '/5887';
	this.fixturesContainer.add(htmlstart + 'unit-name-empty-string' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-empty-string') {
			assert.strictEqual(slot.gpt.unitName, expected, 'setting unit name with empty string site and zone just returns network');
			done();
		}
	});

	this.ads.init({
		gpt: {
			network: '5887',
			site: '',
			zone:''
		}
	});
	this.ads.slots.initSlot('unit-name-empty-string');
});

QUnit.test('set unit name with override', function(assert) {
	var done = assert.async();
	var expected = '/hello-there/stranger';
	this.fixturesContainer.add(htmlstart + 'unit-name-custom' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-custom') {
			assert.strictEqual(slot.gpt.unitName, expected, 'unit name override works');
			done();
		}
	});

	this.ads.init({
		gpt: {
			unitName: '/hello-there/stranger'
		}
	});
	this.ads.slots.initSlot('unit-name-custom');
});

// QUnit.test('refresh', function (assert) {
//     var clock = this.date();
//     this.ads.init({ refresh: { time: 1 }});
//     this.ads.gpt.startRefresh();
//     var GPTrefreshTimer = this.spy(this.ads.gpt.refreshTimer, 'fn');

//     clock.tick(1025);
//     assert.ok(GPTrefreshTimer.called);
// });

QUnit.test('collapse empty', function(assert) {

	this.ads.init({gpt: {'collapseEmpty': 'after'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true), 'after mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({gpt: {'collapseEmpty': 'before'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true, true), 'before mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({gpt: {'collapseEmpty': 'never'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(false), 'never mode is set in gpt');
});

QUnit.test('define a basic slot', function(assert) {
	var html = '<div data-o-ads-name="no-responsive-mpu" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.insertAdjacentHTML('beforeend', html);
	this.ads.init();

	this.ads.slots.initSlot('no-responsive-mpu');
	var gptSlot = this.ads.slots['no-responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
	assert.equal(gptSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is called');
});

QUnit.test('define responsive slot', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="responsive-mpu"></div>');
	this.ads.init({
		responsive:{
			large: [1280, 800],
			medium: [970, 690],
			small: [0, 0]
		},
		slots: {
			'responsive-mpu': {
				formats: {
					small: false,
					medium: 'MediumRectangle',
					large: 'Leaderboard'
				}
			}
		}
	});

	this.ads.slots.initSlot('responsive-mpu');
	var gptSlot = this.ads.slots['responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define unit is called');
	assert.ok(gptSlot.defineSizeMapping.calledOnce, 'the GPT defineSizeMapping slot is called');
});

QUnit.test('rendered event fires on slot', function(assert) {
	var done = assert.async();
	var html = '<div data-o-ads-name="rendered-test" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.insertAdjacentHTML('beforeend', html);
	this.ads.init();

	document.body.addEventListener('oAds.rendered', function(event) {
		assert.equal(event.detail.name, 'rendered-test', 'our test slot fired the rendered event');
		done();
	});

	this.ads.slots.initSlot('rendered-test');
});

QUnit.test('update correlator', function(assert) {
	this.ads.init();
	this.ads.gpt.updateCorrelator();
	assert.ok(googletag.pubads().updateCorrelator.calledOnce, 'the pub ads update correlator method is called when our method is called.');
});

QUnit.test('fix the url for ad requests', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="url-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({
		canonical: 'http://www.ft.com'
	});
	this.ads.slots.initSlot('url-slot');

	var gptSlot = this.ads.slots['url-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.ft.com'), 'page url set via config');

	document.head.insertAdjacentHTML('beforeend', '<link href="http://www.random-inc.com/" rel="canonical" remove />');
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="canonical-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();

	this.ads.slots.initSlot('canonical-slot');

	gptSlot = this.ads.slots['canonical-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.random-inc.com/'), 'page url set via canonical link tag');
});
