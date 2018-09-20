/* globals QUnit: false, googletag: false, sinon: false */

'use strict'; //eslint-disable-line

const htmlstart = '<div data-o-ads-name="';
const htmlend = '" data-o-ads-formats="MediumRectangle"></div>';

QUnit.module('gpt', {
});

QUnit.test('init', function(assert) {
	// delete the mock for this test
	delete window.googletag;

	this.ads.init();
	assert.ok(this.ads.utils.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true, null, sinon.match.typeOf('function')), 'google publisher tag library is attached to the page');
	assert.ok(window.googletag, 'placeholder googletag object is created');
	assert.ok(window.googletag.cmd.length, 'library setup is added to the command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('broadcast an event when GPT fails to load', function(assert) {
	this.utils.attach.restore();
	this.stub(this.utils, 'attach', function(url, async, fn, errorFn) {
		errorFn('some error');
	});

	this.spy(this.utils, 'broadcast');

	this.ads.init();

	assert.ok(this.ads.utils.broadcast.calledWith('adServerLoadError', 'some error'));

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
	const errorSpy = this.spy(this.utils.log, 'warn');
	this.ads.init();
	// delete mock
	delete window.googletag;
	this.ads.gpt.updatePageTargeting({overrideKey: 'overrideValue'});
	assert.ok(errorSpy.calledWith('Attempting to set page targeting before the GPT library has initialized'), 'warns that googletag is not available');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('unset page targeting', function(assert) {
	this.ads.init();

	this.ads.gpt.clearPageTargetingForKey('test');
	assert.ok(googletag.pubads().clearTargeting.calledWith('test'), 'removals of custom params are queued with GPT');
});

QUnit.test('unsetting page targeting catches and warns when about to unset all or if googletag is not available', function(assert) {
	const errorSpy = this.spy(this.utils.log, 'warn');
	this.ads.init();

	this.ads.gpt.clearPageTargetingForKey();
	assert.ok(errorSpy.calledWith('Refusing to unset all keys - a key must be specified'), 'all params are not accidentally cleared');

	// delete mock
	delete window.googletag;
	this.ads.gpt.clearPageTargetingForKey('test');
	assert.ok(errorSpy.calledWith('Attempting to clear page targeting before the GPT library has initialized'), 'warns that googletag is not available');

	// reinstate mock
	window.googletag = this.gpt;
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

QUnit.test('set correct collapse mode when config collapseEmpty is after', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: 'after'});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('set correct collapse mode when config collapseEmpty is before', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: 'before'});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true, true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('set correct collapse mode when config collapseEmpty is never', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({collapseEmpty: 'never'});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(false), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('set collapse mode as "never" if no mode is specified', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(false), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('component specific mode overrides config set parameter', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle" data-o-ads-collapse-empty="before"></div>');
	this.ads.init({collapseEmpty: 'after'});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true, true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('component specific mode overrides default', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle" data-o-ads-collapse-empty="before"></div>');
	this.ads.init({});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true, true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('component specific mode is not set if attribute value is wrong, and the config set mode is set instead', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle" data-o-ads-collapse-empty="INVALID_PARAMETER"></div>');
	this.ads.init({collapseEmpty: 'after'});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.collapseEmpty === undefined, 'collapse empty is not set when attribute value is wrong');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('named component config overrides global config', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({ collapseEmpty: 'after', slots: { mpu: { collapseEmpty: 'before'}}});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true, true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('named component config overrides default', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({slots: { mpu: { collapseEmpty: 'before'}}});
	const slot = this.ads.slots.initSlot('mpu');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
	assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWithExactly(true, true), 'call collapse empty slot gpt api with correct parameters');
});

QUnit.test('catches slot in view render event and display it if method is ready', function(assert) {
	const slotHTML = '<div data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	const displaySpy = this.spy(slot, 'display');
	slot.fire('render');
	assert.ok(displaySpy.calledOnce, 'slot dislpay method has been triggered');
});

QUnit.test('on slot refresh event updates targeting', function(assert) {
	const slotHTML = '<div data-o-ads-formats="MediumRectangle" data-o-ads-targeting="random=1"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	slot.fire('refresh', {targeting: {test: true}});
	assert.ok(googletag.pubads().refresh.calledOnce, 'googletag refresh method has been called');
	assert.ok(slot.gpt.slot.setTargeting.calledTwice, 'setTargeting has been called on the slot');
	assert.ok(slot.gpt.slot.setTargeting.calledWith('random', '1'), 'setTargeting has been passed correct argument');
	assert.ok(slot.gpt.slot.setTargeting.calledWith('test', true), 'setTargeting has been passed correct argument');
});

QUnit.test('provides api to destroy the slot', function(assert) {
	const slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot('test1');
	assert.equal(slot.destroySlot(), true, 'a call to destroy slot returns a boolean');
	assert.ok(googletag.destroySlots.calledOnce, 'destroy api has been called');
	assert.ok(googletag.destroySlots.calledWith([slot.gpt.slot]), 'defaults to slot that the method has been invoked on');
});

QUnit.test('provides api to clear the slot', function(assert) {
	const slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot('test1');
	assert.equal(slot.clearSlot(), true, 'a call to clear slot returns a boolean');
	assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
	assert.ok(googletag.pubads().clear.calledWith([slot.gpt.slot]), 'defaults to slot that the method has been invoked on');
});

QUnit.test('provides api to clear another slot', function(assert) {
	const slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div><div data-o-ads-name="test2" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot('test1');
	const slot2 = this.ads.slots.initSlot('test2');
	slot.clearSlot(slot2.gpt.slot);
	assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
	assert.ok(googletag.pubads().clear.calledWith([slot2.gpt.slot]), 'one slot can clear ');
});

QUnit.test('companion service is enabled globally on slots', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="test" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('test');
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
	const slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on format');
});

QUnit.test('companion service can be switched off per slot', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
});

QUnit.test('set unit name', function(assert) {
	const done = assert.async();
	const expected = '/5887/some-dfp-site/some-dfp-zone';
	this.fixturesContainer.add(htmlstart + 'unit-name-full' + htmlend);
	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
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
	const done = assert.async();
	const expected = '/5887/some-dfp-site';
	this.fixturesContainer.add(htmlstart + 'unit-name-site-only' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
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
	const done = assert.async();
	const expected = '/5887';
	this.fixturesContainer.add(htmlstart + 'unit-name-network-only' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
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

	const done = assert.async();
	const expected = '/5887';
	this.fixturesContainer.add(htmlstart + 'unit-name-empty-string' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
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
	const done = assert.async();
	const expected = '/hello-there/stranger';
	this.fixturesContainer.add(htmlstart + 'unit-name-custom' + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
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
	const done = assert.async();
	const expected = '/this-works';
	const container = this.fixturesContainer.add(htmlstart + 'unit-name-attr" data-o-ads-gpt-unit-name="' + expected + htmlend);

	document.addEventListener('oAds.complete', function(event) {
		const name = event.detail.name;
		const slot = event.detail.slot;
		if (name === 'unit-name-attr') {
			assert.strictEqual(slot.gpt.unitName, expected, 'attribute override works');
			done();
		}
	});

	this.ads.init({});
	this.ads.slots.initSlot(container);
});

QUnit.test('collapse empty', function(assert) {

	this.ads.init({collapseEmpty: 'after'});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(false), 'after mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({collapseEmpty: 'before'});
	assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true), 'before mode is set in gpt');
	googletag.pubads().collapseEmptyDivs.reset();

	this.ads.init({collapseEmpty: 'never'});
	assert.ok(googletag.pubads().collapseEmptyDivs.notCalled, 'never mode is set in gpt');
});

QUnit.test('submit impression', function(assert) {
	const infoLog = this.spy(this.utils.log, 'info');
	const warnLog = this.spy(this.utils.log, 'warn');
	const html = '<div data-o-ads-name="delayedimpression" data-o-ads-out-of-page="true" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init();
	const slot = this.ads.slots.initSlot('delayedimpression');
	slot.submitGptImpression();
	assert.ok(this.ads.utils.attach.calledWith('https://www.ft.com', true, sinon.match.any, sinon.match.any, true), 'impression url requested via utils with correct parameters');
	assert.ok(infoLog.calledOnce, 'impression info logged');
	assert.ok(infoLog.calledWith('Impression Url requested'), 'correct impression info logged');
	assert.notOk(warnLog.calledOnce, 'no info notifications have been logged');
});

QUnit.test('catches a failure to submit an impression', function(assert) {
	this.ads.utils.attach.restore();
	const attachSpy = this.stub(this.ads.utils, 'attach', function(url, async, successCallback, failureCallback) {
		failureCallback.call();
	});
	const log = this.spy(this.utils.log, 'info');
	const html = '<div data-o-ads-name="delayedimpression" data-o-ads-out-of-page="true" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init();
	const slot = this.ads.slots.initSlot('delayedimpression');
	slot.submitGptImpression();
	assert.ok(attachSpy.calledWith('https://www.ft.com'), 'impression url requested via utils');
	assert.ok(log.calledWith('CORS request to submit an impression failed'), 'message about a failed impression request is logged');
});

QUnit.test('logs a warning when trying to submit an impression and the URL is not present within creative', function(assert) {
	const log = this.spy(this.utils.log, 'warn');
	const html = '<div data-o-ads-name="delayedimpression-missing-tracking-div" data-o-ads-out-of-page="true" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init();
	const slot = this.ads.slots.initSlot('delayedimpression-missing-tracking-div');
	slot.submitGptImpression();
	assert.notOk(this.ads.utils.attach.calledWith('https://www.ft.com'), 'impression url never requested via utils');
	assert.ok(log.calledWith('Impression URL not found, this is set via a creative template.'), 'missing impression URL warning is logged');
});

QUnit.test('logs a warning when trying to submit an impression on a non-oop slot', function(assert) {
	const log = this.spy(this.utils.log, 'warn');
	const html = '<div data-o-ads-name="delayedimpression" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init();
	const slot = this.ads.slots.initSlot('delayedimpression');
	slot.submitGptImpression();
	assert.notOk(this.ads.utils.attach.calledWith('https://www.ft.com'), 'impression url never requested via utils');
	assert.ok(log.calledWith('Attempting to call submitImpression on a non-oop slot'), 'catches attempt to call submit impression on a non-oop slot');
});

QUnit.test('define a basic slot', function(assert) {
	const html = '<div data-o-ads-name="no-responsive-mpu" data-o-ads-formats="MediumRectangle"></div>';
	this.fixturesContainer.add(html);
	this.ads.init({responsive: false});

	this.ads.slots.initSlot('no-responsive-mpu');
	const gptSlot = this.ads.slots['no-responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
	assert.equal(gptSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is not called');
});

QUnit.test('define responsive slot', function(assert) {
	this.fixturesContainer.add('<div data-o-ads-name="responsive-mpu"></div>');
	this.ads.init({
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
	const gptSlot = this.ads.slots['responsive-mpu'].gpt.slot;
	assert.ok(googletag.defineSlot.calledOnce, 'the GPT define unit is called');
	assert.ok(gptSlot.defineSizeMapping.calledOnce, 'the GPT defineSizeMapping slot is called');
});

QUnit.test('rendered event fires on slot', function(assert) {
	const done = assert.async();
	const html = '<div data-o-ads-name="rendered-test" data-o-ads-formats="MediumRectangle"></div>';
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

	let gptSlot = this.ads.slots['url-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.ft.com'), 'page url set via config');

	document.head.insertAdjacentHTML('beforeend', '<link href="http://www.random-inc.com/" rel="canonical" remove />');
	this.fixturesContainer.add('<div data-o-ads-name="canonical-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();

	this.ads.slots.initSlot('canonical-slot');

	gptSlot = this.ads.slots['canonical-slot'].gpt.slot;
	assert.ok(gptSlot.set.calledWith('page_url', 'http://www.random-inc.com/'), 'page url set via canonical link tag');
});


QUnit.test('pick up the slot URL from page address if config or canonical not available', function(assert) {
	const urlUtilSpy = this.spy(this.utils, 'getLocation');
	this.fixturesContainer.add('<div data-o-ads-name="url-slot" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init();
	this.ads.slots.initSlot('url-slot');
	assert.ok(urlUtilSpy.calledOnce, 'page url set via utils');
});


QUnit.test('creatives with size 100x100 expand the iframe to 100%', function(assert) {
	const done = assert.async();
	document.body.addEventListener('oAds.complete', function(event) {
		const iframe = event.detail.slot.gpt.iframe;
		const iframeSize = [iframe.width, iframe.height];
		assert.deepEqual(iframeSize, ['100%', '100%'], 'size of iframe is 100% by 100%.');
		done();
	});

	const slotHTML = '<div data-o-ads-name="fullpage" data-o-ads-sizes="100x100"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init({});
	this.ads.slots.initSlot(node);
	this.ads.slots.fullpage; // eslint-disable-line no-unused-expressions
});

QUnit.test('debug returns early if no config is set', function(assert) {
	this.ads.init();
	const start = this.spy(this.utils.log, "start");

	this.ads.gpt.debug();
	assert.notOk(start.called, "`utils.start` wasn't called for 'gpt'");
});

QUnit.test('debug logs info when config is set', function(assert) {
	this.ads.init({gpt: true});
	const start = this.spy(this.utils.log, "start");

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
	const slot = this.ads.slots.initSlot('test');
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
	const slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on format');
});

QUnit.test('companion service can be switched off per slot', function(assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
});

QUnit.test('command queue empty when googletag is available', function (assert) {
	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});

	assert.equal(window.googletag.cmd.length, 0, 'command queue empty when googletag is available');
});


QUnit.test('setup added to command queue when googletag not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.ads.init({gpt: {companions: true}});
	assert.equal(window.googletag.cmd.length, 1, 'setup added to command queue when googletag not available');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('defineSlot is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.defineSlot();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'defineSlot function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('clearSlot returns false when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');

	slot.clearSlot();
	assert.equal(slot.clearSlot(), false, 'clearSlot function added to command queue');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('initResponsive is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.initResponsive();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'initResponsive function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('display is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.display();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'display function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setUnitName is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.setUnitName();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setUnitName function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('addServices is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.addServices();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'addServices function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setCollapseEmpty is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.setCollapseEmpty();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setCollapseEmpty function added to command queue');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setURL is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.setURL();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setURL function added to command queue');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('setTargeting is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.setTargeting();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setTargeting function added to command queue');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('updateCorrelator is added to command queue when googletag is not available', function (assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const gptCommandsQueued = window.googletag.cmd.length;

	this.ads.gpt.updateCorrelator();
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'updateCorrelator function added to command queue');
	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('clear slot method calls to the ad server providers clear function', function(assert) {
	const slotHTML = '<div data-o-ads-formats="MediumRectangle"></div>';
	const node = this.fixturesContainer.add(slotHTML);
	this.ads.init();
	const slot = this.ads.slots.initSlot(node);
	slot.clearSlot();
	assert.ok(googletag.pubads().clear.calledWith([slot.gpt.slot]), 'googletag clear method called with the correct slot');
});

QUnit.test('onRefresh is added to command queue when googletag is not available', function(assert) {
	// delete the mock for this test
	delete window.googletag;

	this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
	this.ads.init({gpt: {companions: true}});
	const slot = this.ads.slots.initSlot('TestFormat');
	const gptCommandsQueued = window.googletag.cmd.length;

	slot.fire('refresh');
	assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'onRefresh function added to command queue');

	// reinstate mock
	window.googletag = this.gpt;
});

QUnit.test('nonPersonalized request mode', function(assert) {
	this.ads.init({gpt: true});
	assert.ok(googletag.pubads().setRequestNonPersonalizedAds.calledWith(1), 'nonPersonalized request mode initialised when programmatic consent has not been given');
});

QUnit.test('nonPersonalized request mode', function(assert) {
	document.cookie = 'FTConsent=behaviouraladsOnsite%3Aoff%2CprogrammaticadsOnsite%3Aon;';
	this.ads.init({gpt: true});
	assert.ok(googletag.pubads().setRequestNonPersonalizedAds.calledWith(0), 'nonPersonalized request mode disabled (called with "0") when programmatic consent given.');
	this.deleteCookie('FTConsent');
});
