/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, googletag: false */

'use strict';
var htmlstart = '<div data-o-ads-name="';
var htmlend = '" data-o-ads-formats="MediumRectangle"></div>';

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
	assert.ok(window.googletag.cmd.length, 'library setup is added to the command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('set page targeting', function(assert) {
	this.ads.init({ dfp_targeting: ';some=test;targeting=params'});
	assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
	assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');
});

QUnit.test('override page targeting', function(assert) {
	this.ads.init({ dfp_targeting: ';some=test;targeting=params'});
	assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
	assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');

	this.ads.gpt.updatePageTargeting({overrideKey: 'overrideValue'});
	assert.ok(googletag.pubads().setTargeting.calledWith('overrideKey', 'overrideValue'), 'the params are queued with GPT');

	this.ads.gpt.updatePageTargeting('anotherOverrideKey=anotherOverrideValue');
	assert.ok(googletag.pubads().setTargeting.neverCalledWith('anotherOverrideKey', 'anotherOverrideValue'), 'overreide paramerters passed as a string are not queued with GPT');

});

QUnit.test('override page targetting catches and warns when googletag is not available', function(assert) {
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.ads.init();
	// delete mock
	delete window.googletag;
	this.ads.gpt.updatePageTargeting({overrideKey: 'overrideValue'});
	assert.ok(errorSpy.calledWith('Attempting to set page targeting before the GPT library has initialized'), 'warns that googletag is not available');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('override page targeting', function(assert) {
	this.ads.init({ dfp_targeting: ';some=test;targeting=params'});
	assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
	assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');

	this.ads.gpt.updatePageTargeting({overrideKey: 'overrideValue'});
	assert.ok(googletag.pubads().setTargeting.calledWith('overrideKey', 'overrideValue'), 'the params are queued with GPT');

	this.ads.gpt.updatePageTargeting('anotherOverrideKey=anotherOverrideValue');
	assert.ok(googletag.pubads().setTargeting.neverCalledWith('anotherOverrideKey', 'anotherOverrideValue'), 'the params are queued with GPT');
});

QUnit.test('catches and warns when targeting is not set', function(assert) {
	this.stub(this.utils, 'isPlainObject', function(url, async, fn) {
		return false;
	});
	var warnSpy = this.spy(this.utils.log, 'warn');
	this.ads.init();
	assert.ok(warnSpy.calledOnce, 'logs a warning for invalid targeting');
});


QUnit.test('set sync rendering', function(assert) {
	this.ads.init({ gpt: {rendering: 'sync'}});
	assert.ok(googletag.pubads().enableSyncRendering.calledOnce, 'sync rendering has been enabled');
});


QUnit.test('enabled single request', function(assert) {
	this.ads.init({ gpt: {rendering: 'sra'}});
	assert.ok(googletag.pubads().enableSingleRequest.calledOnce, 'single request has been enabled');
});

QUnit.test('default to async rendering', function(assert) {
	this.ads.init({ gpt: {rendering: 'random'}});
	assert.ok(googletag.pubads().enableAsyncRendering.calledOnce, 'async rendering has been enabled by default');
});

QUnit.test('enables companion ads', function(assert) {
	this.ads.init({ gpt: {companions: true}});
	assert.ok(googletag.pubads().disableInitialLoad.calledOnce, 'disabled the initial load');
	assert.ok(googletag.companionAds.calledOnce, 'companion ads called');
	assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledOnce, 'companion ads api called');
	assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledWith(true), 'companion ads api called with correct param');
});


QUnit.test('set correct collapse mode when collapseEmpty is true', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: true});
	var slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true), 'call collapse empty slot gpt api with correct parameters');
});


QUnit.test('set correct collapse mode when collapseEmpty is after', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: true});
	var slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('set correct collapse mode when collapseEmpty is before', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: 'before'});
	var slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true, true), 'call collapse empty slot gpt api with correct parameters');
});


QUnit.test('set correct collapse mode when collapseEmpty is false', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: false});
	var slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(false), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('set correct collapse mode when collapseEmpty is never', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: 'never'});
	var slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(false), 'call collapse empty slot gpt api with correct parameters');
});


QUnit.test('catches slot in view render event and display it if method is ready', function(assert) {
	var slotHTML = '<div data-o-ads-formats="MediumRectangle"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	var slot = this.ads.slots.initSlot(node);
	var displaySpy = this.spy(slot, 'display');
	slot.fire('render');
	assert.ok(displaySpy.calledOnce, 'slot dislpay method has been triggered');
});

QUnit.test('on slot refresh event updates targeting', function(assert) {
	var slotHTML = '<div data-o-ads-formats="MediumRectangle" data-o-ads-targeting="random=1"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	var slot = this.ads.slots.initSlot(node);
	slot.fire('refresh', {targeting: {test: true}});
	assert.ok(googletag.pubads().refresh.calledOnce, 'googletag refresh method has been called');
	assert.ok(slot.gpt.slot.setTargeting.calledTwice, 'setTargeting has been called on the slot');
	assert.ok(slot.gpt.slot.setTargeting.calledWith('random', '1'), 'setTargeting has been passed correct argument');
	assert.ok(slot.gpt.slot.setTargeting.calledWith('test', true), 'setTargeting has been passed correct argument');
});

QUnit.test('provides api to clear the slot', function(assert) {
	var slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(slotHTML);
	this.ads.init();
	var slot = this.ads.slots.initSlot('test1');
	slot.clearSlot();
	assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
	assert.ok(googletag.pubads().clear.calledWith(slot.gpt.slot), 'defaults to slot that the method has been invoked on');
});

QUnit.test('provides api to clear another slot', function(assert) {
	var slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div><div data-o-ads-name="test2" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(slotHTML);
	this.ads.init();
	var slot = this.ads.slots.initSlot('test1');
	var slot2 = this.ads.slots.initSlot('test2');
	slot.clearSlot(slot2.gpt.slot);
	assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
	assert.ok(googletag.pubads().clear.calledWith(slot2.gpt.slot), 'one slot can clear ');
});

QUnit.test('companion service is enabled globally on slots', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="test" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('test');
	assert.ok(slot.gpt.slot.addService.calledWith(googletag.companionAds()), 'add companionAds service has been called on slot');
});

QUnit.test('companion service can be switched off per format', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="TestFormat" data-o-ads-formats="TestFormat"></div>');
	this.ads.init({
		slots: {
			TestFormat: {
				companion: false,
				formats: ['Rectangle']
			}
		},
		gpt: {
			companions: true
		}
	});
	var slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on format');
});

QUnit.test('companion service can be switched off per slot', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
});

QUnit.test('set unit name', function(assert) {
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
			assert.strictEqual(slot.gpt.unitName, expected, 'global override works');
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

QUnit.test('set unit name with attribute', function(assert) {
	var done = assert.async();
	var expected = '/this-works';
	var container = this.fixturesContainer.add(htmlstart + 'unit-name-attr" data-o-ads-gpt-unit-name="' + expected + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		var name = event.detail.name;
		var slot = event.detail.slot;
		if (name === 'unit-name-attr') {
			assert.strictEqual(slot.gpt.unitName, expected, 'attribute override works');
			done();
		}
	});

	this.ads.init({});
	this.ads.slots.initSlot(container);
});

QUnit.test('collapse empty', function(assert) {

	this.ads.init({gpt: {collapseEmpty: 'after'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true), 'after mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({gpt: {collapseEmpty: 'before'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true, true), 'before mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({gpt: {collapseEmpty: 'never'}});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(false), 'never mode is set in gpt');
});

QUnit.test('define a basic slot', function(assert) {
	var html = '<div data-o-ads-name="no-responsive-mpu" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init();

	this.ads.slots.initSlot('no-responsive-mpu');
	var gptSlot = this.ads.slots['no-responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
	assert.equal(gptSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is called');
});

QUnit.test('define responsive slot', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="responsive-mpu"></div>');
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
	this.fixturesContainer.add(html);
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

QUnit.test('fixed url for ad requests', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="url-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({
		canonical: 'http://www.ft.com'
	});
	this.ads.slots.initSlot('url-slot');

	var gptSlot = this.ads.slots['url-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.ft.com'), 'page url set via config');

	document.head.insertAdjacentHTML('beforeend', '<link href="http://www.random-inc.com/" rel="canonical" remove />');
	this.fixturesContainer.add('<div data-o-ads-name="canonical-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();

	this.ads.slots.initSlot('canonical-slot');

	gptSlot = this.ads.slots['canonical-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.random-inc.com/'), 'page url set via canonical link tag');
});


QUnit.test('pick up the slot URL from page address if config or canonical not available', function(assert) {
	var urlUtilSpy = this.spy(this.utils, 'getLocation');
	this.fixturesContainer.add('<div data-o-ads-name="url-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();
	this.ads.slots.initSlot('url-slot');
	assert.ok(urlUtilSpy.calledOnce, 'page url set via utils');
});


QUnit.test('creatives with size 100x100 expand the iframe to 100%', function(assert) {
	var done = assert.async();
	document.body.addEventListener('oAds.complete', function(event) {
		var iframe = event.detail.slot.gpt.iframe;
		var iframeSize = [iframe.width, iframe.height];
			assert.deepEqual(iframeSize, ['100%', '100%'], 'size of iframe is 100% by 100%.');
			done();
	});

	var slotHTML = '<div data-o-ads-name="fullpage" data-o-ads-sizes="100x100"></div>';
	var node = this.fixturesContainer.add(slotHTML);
	this.ads.init({});
	this.ads.slots.initSlot(node);
	this.ads.slots.fullpage;
});

QUnit.test('debug returns early if no config is set', function(assert) {
	this.ads.init();
	var start = this.spy(this.utils.log, "start");

	this.ads.gpt.debug();
	assert.notOk(start.called, "`utils.start` wasn't called for 'gpt'");
});

QUnit.test('debug logs info when config is set', function(assert) {
	this.ads.init({gpt: true});
	var start = this.spy(this.utils.log, "start");

	this.ads.gpt.debug();
	assert.ok(start.calledWith('gpt'), "`utils.start` was called for 'gpt'");
});

QUnit.test('enables companion ads', function(assert) {
	this.ads.init({ gpt: {companions: true}});
	assert.ok(googletag.pubads().disableInitialLoad.calledOnce, 'disabled the initial load');
	assert.ok(googletag.companionAds.calledOnce, 'companion ads called');
	assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledOnce, 'companion ads api called');
	assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledWith(true), 'companion ads api called with correct param');
});
QUnit.test('companion service is enabled globally on slots', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="test" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('test');
	assert.ok(slot.gpt.slot.addService.calledWith(googletag.companionAds()), 'add companionAds service has been called on slot');
});

QUnit.test('companion service can be switched off per format', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="TestFormat" data-o-ads-formats="TestFormat"></div>');
	this.ads.init({
		slots: {
			TestFormat: {
				companion: false,
				formats: ['Rectangle']
			}
		},
		gpt: {
			companions: true
		}
	});
	var slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on format');
});

QUnit.test('companion service can be switched off per slot', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
});


QUnit.test('setup added to command queue when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});
	this.ads.init({gpt: {companions: true}});

	assert.ok(window.googletag.cmd.length > 0, 'setup added to command queue when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});


QUnit.test('setup warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});
	this.ads.init({gpt: {companions: true}});

	window.googletag.cmd[0].call();
	assert.ok(errorSpy.calledWith('Attempting to setup before the GPT library has initialized'), 'setup warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('command queue empty when googletag is available', function (assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});

	assert.equal(window.googletag.cmd.length, 0, 'command queue empty when googletag is available');
});

QUnit.test('defineSlot warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.defineSlot();
	assert.ok(errorSpy.calledWith('Attempting to call defineSlot before the GPT library has initialized'), 'defineSlot warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('defineOutOfPage warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.defineOutOfPage();
	assert.ok(errorSpy.calledWith('Attempting to call defineOutOfPage before the GPT library has initialized'), 'defineOutOfPage warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('clearSlot warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});
	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.clearSlot();
	assert.ok(errorSpy.calledWith('Attempting to call clearSlot before the GPT library has initialized'), 'clearSlot warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('initResponsive warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.initResponsive();
	assert.ok(errorSpy.calledWith('Attempting to call initResponsive before the GPT library has initialized'), 'initResponsive warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('display warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.display();
	assert.ok(errorSpy.calledWith('Attempting to call display before the GPT library has initialized'), 'display warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('addServices warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.addServices();
	assert.ok(errorSpy.calledWith('Attempting to call addServices before the GPT library has initialized'), 'addServices warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setCollapseEmpty warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.setCollapseEmpty();
	assert.ok(errorSpy.calledWith('Attempting to call setCollapseEmpty before the GPT library has initialized'), 'setCollapseEmpty warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setURL warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.setURL();
	assert.ok(errorSpy.calledWith('Attempting to call setURL before the GPT library has initialized'), 'setURL warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setTargeting warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	var slot = this.ads.slots.initSlot('TestFormat');

	slot.setTargeting();
	assert.ok(errorSpy.calledWith('Attempting to call setTargeting before the GPT library has initialized'), 'setTargeting warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('updateCorrelator warns when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;
	var errorSpy = this.spy(this.utils.log, 'warn');
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');

	this.ads.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, callback, errorcb) {
		if (typeof errorcb === 'function') {
			errorcb();
		}
	});

	this.ads.init({gpt: {companions: true}});
	// var slot = this.ads.slots.initSlot('TestFormat');

	this.ads.gpt.updateCorrelator();
	assert.ok(errorSpy.calledWith('Attempting to call updateCorrelator before the GPT library has initialized'), 'updateCorrelator warned when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});
