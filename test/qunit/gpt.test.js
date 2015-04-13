
/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, googletag: false */
"use strict";
QUnit.module('gpt', {
	beforeEach: function () {
		this.cookies({});
	}
});

QUnit.test('init', function (assert) {
		this.ads.init();
		assert.ok(this.ads.utils.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true), 'google publisher tag library is attached to the page');
});

QUnit.test('set page targeting', function (assert) {
	this.ads.init({ dfp_targeting: ';some=test;targeting=params'});
	assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
	assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');
});

// QUnit.test('getUnitName', function (assert) {
// 	this.ads.init({network: '5887', dfp_site: 'some-dfp-site', dfp_zone: 'some-dfp-zone'});
// 	var result = this.ads.gpt.getUnitName();
// 	var expected = '/5887/some-dfp-site/some-dfp-zone';

// 	assert.strictEqual(result, expected, 'setting unit name with site and zone works');

// 	this.ads.init({network: '5887', dfp_site: 'some-dfp-site'});
// 	result = this.ads.gpt.getUnitName();
// 	expected = '/5887/some-dfp-site';

// 	assert.strictEqual(result, expected, 'setting unit name with site and no zone works');

// 	this.ads.init({network: '5887'});
// 	result = this.ads.gpt.getUnitName();
// 	expected = '/5887';

// 	assert.strictEqual(result, expected, 'setting unit name with empty site and empty zone  just returns network');

// 	this.ads.init({network: '5887', dfp_site: '', dfp_zone: ''});
// 	result = this.ads.gpt.getUnitName();
// 	expected = '/5887';

// 	assert.strictEqual(result, expected, 'setting unit name with empty string site and zone just returns network');

// 	this.ads.init({network: '5887', dfp_site: 'some-dfp-site', dfp_zone: ''});
// 	result = this.ads.gpt.getUnitName();
// 	expected = '/5887/some-dfp-site';

// 	assert.strictEqual(result, expected, 'setting unit name with site and empty string zone works');

// 	this.ads.init({gptUnitName: '/hello-there/stranger'});
// 	result = this.ads.gpt.getUnitName();
// 	expected = '/hello-there/stranger';

// 	assert.strictEqual(result, expected, 'unit name override works');
// });

// QUnit.test('refresh', function (assert) {
//     var clock = this.date();
//     this.ads.init({ refresh: { time: 1 }});
//     this.ads.gpt.startRefresh();
//     var GPTrefreshTimer = this.spy(this.ads.gpt.refreshTimer, 'fn');

//     clock.tick(1025);
//     assert.ok(GPTrefreshTimer.called);
// });

// QUnit.test('collapse empty', function (assert) {
// 	var result;
// 	this.ads.init({});

// 	result  = this.ads.gpt.setPageCollapseEmpty();
// 	assert.equal(result, 'ft', 'No config set defaults to ft');
// 	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith('ft'), 'the correct mode is set in gpt');

// 	googletag.pubads().collapseEmptyDivs.reset();
// 	this.ads.config('collapseEmpty', 'after');
// 	result  = this.ads.gpt.setPageCollapseEmpty();
// 	assert.equal(result, undefined, 'Config set to "after" mode is undefined!');
// 	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(undefined), 'the correct mode is set in gpt');

// 	googletag.pubads().collapseEmptyDivs.reset();
// 	this.ads.config('collapseEmpty', 'before');
// 	result  = this.ads.gpt.setPageCollapseEmpty();
// 	assert.equal(result, true, 'Config set to "before" mode is true!');

// 	googletag.pubads().collapseEmptyDivs.reset();
// 	this.ads.config('collapseEmpty', 'never');
// 	result  = this.ads.gpt.setPageCollapseEmpty();
// 	assert.equal(result, false, 'setting the value with false works');
// 	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(false), 'the correct mode is set in gpt');
// });

QUnit.test('define responsive slot', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="responsive-mpu"></div>');
	this.ads.init({
		responsive:{
			large: [1280, 800],
			medium: [970, 690],
			small: [0,0]
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

QUnit.test('define a basic slot', function (assert) {
	var html ='<div data-o-ads-name="no-responsive-mpu" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.insertAdjacentHTML('beforeend', html);
	this.ads.init();


	this.ads.slots.initSlot('no-responsive-mpu');
	var gptSlot = this.ads.slots['no-responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
	assert.equal(gptSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is called');
});


QUnit.test('update correlator', function (assert) {
	this.ads.init();
	this.ads.gpt.updateCorrelator();
	assert.ok(googletag.pubads().updateCorrelator.calledOnce, 'the pub ads update correlator method is called when our method is called.');
});

QUnit.test('fix the url for ad requests', function (assert) {
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
