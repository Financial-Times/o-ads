/* globals assert, googletag, sinon */

'use strict'; //eslint-disable-line

const htmlstart = '<div data-o-ads-name="';
const htmlend = '" data-o-ads-formats="MediumRectangle"></div>';

describe('gpt', function () {

	it('init', function () {
		// delete the mock for this test
		delete window.googletag;

		this.ads.init();
		assert.ok(this.ads.utils.attach.calledWith('//www.googletagservices.com/tag/js/gpt.js', true, null, sinon.match.typeOf('function')), 'google publisher tag library is attached to the page');
		assert.ok(window.googletag, 'placeholder googletag object is created');
		assert.ok(window.googletag.cmd.length, 'library setup is added to the command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('broadcast an event when GPT fails to load', function () {
		this.utils.attach.restore();
		this.stub(this.utils, 'attach', function (url, async, fn, errorFn) {
			errorFn('some error');
		});

		this.spy(this.utils, 'broadcast');

		this.ads.init();

		assert.ok(this.ads.utils.broadcast.calledWith('adServerLoadError', 'some error'));

	});

	it('set page targeting', function () {
		this.ads.init({ dfp_targeting: ';some=test;targeting=params' });
		assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
		assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');
	});

	it('override page targeting', function () {
		this.ads.init({ dfp_targeting: ';some=test;targeting=params' });
		assert.ok(googletag.pubads().setTargeting.calledWith('some', 'test'), 'the params are queued with GPT');
		assert.ok(googletag.pubads().setTargeting.calledWith('targeting', 'params'), 'the params are queued with GPT');

		this.ads.gpt.updatePageTargeting({ overrideKey: 'overrideValue' });
		assert.ok(googletag.pubads().setTargeting.calledWith('overrideKey', 'overrideValue'), 'the params are queued with GPT');

		this.ads.gpt.updatePageTargeting('anotherOverrideKey=anotherOverrideValue');
		assert.ok(googletag.pubads().setTargeting.neverCalledWith('anotherOverrideKey', 'anotherOverrideValue'), 'overreide paramerters passed as a string are not queued with GPT');

	});

	it('override page targetting catches and warns when googletag is not available', function () {
		const errorSpy = this.spy(this.utils.log, 'warn');
		this.ads.init();
		// delete mock
		delete window.googletag;
		this.ads.gpt.updatePageTargeting({ overrideKey: 'overrideValue' });
		assert.ok(errorSpy.calledWith('Attempting to set page targeting before the GPT library has initialized'), 'warns that googletag is not available');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('unset page targeting', function () {
		this.ads.init();

		this.ads.gpt.clearPageTargetingForKey('test');
		assert.ok(googletag.pubads().clearTargeting.calledWith('test'), 'removals of custom params are queued with GPT');
	});

	it('unsetting page targeting catches and warns when about to unset all or if googletag is not available', function () {
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

	it('set sync rendering', function () {
		this.ads.init({ gpt: { rendering: 'sync' } });
		assert.ok(googletag.pubads().enableSyncRendering.calledOnce, 'sync rendering has been enabled');
	});


	it('enabled single request', function () {
		this.ads.init({ gpt: { rendering: 'sra' } });
		assert.ok(googletag.pubads().enableSingleRequest.calledOnce, 'single request has been enabled');
	});

	it('default to async rendering', function () {
		this.ads.init({ gpt: { rendering: 'random' } });
		assert.ok(googletag.pubads().enableAsyncRendering.calledOnce, 'async rendering has been enabled by default');
	});

	it('enables companion ads', function () {
		this.ads.init({ gpt: { companions: true } });
		assert.ok(googletag.pubads().disableInitialLoad.calledOnce, 'disabled the initial load');
		assert.ok(googletag.companionAds.calledOnce, 'companion ads called');
		assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledOnce, 'companion ads api called');
		assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledWith(true), 'companion ads api called with correct param');
	});


	it('set correct collapse mode when collapseEmpty is true', function () {
		this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ collapseEmpty: true });
		const slot = this.ads.slots.initSlot('mpu');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true), 'call collapse empty slot gpt api with correct parameters');
	});


	it('set correct collapse mode when collapseEmpty is after', function () {
		this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ collapseEmpty: true });
		const slot = this.ads.slots.initSlot('mpu');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true), 'call collapse empty slot gpt api with correct parameters');
	});

	it('set correct collapse mode when collapseEmpty is before', function () {
		this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ collapseEmpty: 'before' });
		const slot = this.ads.slots.initSlot('mpu');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(true, true), 'call collapse empty slot gpt api with correct parameters');
	});


	it('set correct collapse mode when collapseEmpty is false', function () {
		this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ collapseEmpty: false });
		const slot = this.ads.slots.initSlot('mpu');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(false), 'call collapse empty slot gpt api with correct parameters');
	});

	it('set correct collapse mode when collapseEmpty is never', function () {
		this.fixturesContainer.add('<div data-o-ads-name="mpu" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ collapseEmpty: 'never' });
		const slot = this.ads.slots.initSlot('mpu');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledOnce, 'call collapse empty slot gpt api');
		assert.ok(slot.gpt.slot.setCollapseEmptyDiv.calledWith(false), 'call collapse empty slot gpt api with correct parameters');
	});


	it('catches slot in view render event and display it if method is ready', function () {
		const slotHTML = '<div data-o-ads-formats="MediumRectangle"></div>';
		const node = this.fixturesContainer.add(slotHTML);
		this.ads.init();
		const slot = this.ads.slots.initSlot(node);
		const displaySpy = this.spy(slot, 'display');
		slot.fire('render');
		assert.ok(displaySpy.calledOnce, 'slot dislpay method has been triggered');
	});

	it('on slot refresh event updates targeting', function () {
		const slotHTML = '<div data-o-ads-formats="MediumRectangle" data-o-ads-targeting="random=1"></div>';
		const node = this.fixturesContainer.add(slotHTML);
		this.ads.init();
		const slot = this.ads.slots.initSlot(node);
		slot.fire('refresh', { targeting: { test: true } });
		assert.ok(googletag.pubads().refresh.calledOnce, 'googletag refresh method has been called');
		assert.ok(slot.gpt.slot.setTargeting.calledTwice, 'setTargeting has been called on the slot');
		assert.ok(slot.gpt.slot.setTargeting.calledWith('random', '1'), 'setTargeting has been passed correct argument');
		assert.ok(slot.gpt.slot.setTargeting.calledWith('test', true), 'setTargeting has been passed correct argument');
	});

	it('provides api to clear the slot', function () {
		const slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(slotHTML);
		this.ads.init();
		const slot = this.ads.slots.initSlot('test1');
		assert.equal(slot.clearSlot(), true, 'a call to clear slot returns a boolean');
		assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
		assert.ok(googletag.pubads().clear.calledWith([slot.gpt.slot]), 'defaults to slot that the method has been invoked on');
	});

	it('provides api to clear another slot', function () {
		const slotHTML = '<div data-o-ads-name="test1" data-o-ads-formats="MediumRectangle"></div><div data-o-ads-name="test2" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(slotHTML);
		this.ads.init();
		const slot = this.ads.slots.initSlot('test1');
		const slot2 = this.ads.slots.initSlot('test2');
		slot.clearSlot(slot2.gpt.slot);
		assert.ok(googletag.pubads().clear.calledOnce, 'clear api has been called');
		assert.ok(googletag.pubads().clear.calledWith([slot2.gpt.slot]), 'one slot can clear ');
	});

	it('companion service is enabled globally on slots', function () {
		this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="test" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('test');
		assert.ok(slot.gpt.slot.addService.calledWith(googletag.companionAds()), 'add companionAds service has been called on slot');
	});

	it('companion service can be switched off per format', function () {
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

	it('companion service can be switched off per slot', function () {
		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
	});

	it('set unit name', function (done) {

		const expected = '/5887/some-dfp-site/some-dfp-zone';
		this.fixturesContainer.add(htmlstart + 'unit-name-full' + htmlend);
		document.addEventListener('oAds.complete', function (event) {
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

	it('set unit name site only', function (done) {

		const expected = '/5887/some-dfp-site';
		this.fixturesContainer.add(htmlstart + 'unit-name-site-only' + htmlend);

		document.addEventListener('oAds.complete', function (event) {
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
			}
		});
		this.ads.slots.initSlot('unit-name-site-only');
	});

	it('set unit names network only', function (done) {

		const expected = '/5887';
		this.fixturesContainer.add(htmlstart + 'unit-name-network-only' + htmlend);

		document.addEventListener('oAds.complete', function (event) {
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

	it('unit names with empty strings', function (done) {


		const expected = '/5887';
		this.fixturesContainer.add(htmlstart + 'unit-name-empty-string' + htmlend);

		document.addEventListener('oAds.complete', function (event) {
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
				zone: ''
			}
		});
		this.ads.slots.initSlot('unit-name-empty-string');
	});

	it('set unit name with override', function (done) {

		const expected = '/hello-there/stranger';
		this.fixturesContainer.add(htmlstart + 'unit-name-custom' + htmlend);

		document.addEventListener('oAds.complete', function (event) {
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

	it('set unit name with attribute', function (done) {

		const expected = '/this-works';
		const container = this.fixturesContainer.add(htmlstart + 'unit-name-attr" data-o-ads-gpt-unit-name="' + expected + htmlend);

		document.addEventListener('oAds.complete', function (event) {
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

	it('collapse empty', function () {

		this.ads.init({ gpt: { collapseEmpty: 'after' } });
		assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true), 'after mode is set in gpt');
		googletag.pubads().collapseEmptyDivs.reset();

		this.ads.init({ gpt: { collapseEmpty: 'before' } });
		assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(true, true), 'before mode is set in gpt');
		googletag.pubads().collapseEmptyDivs.reset();

		this.ads.init({ gpt: { collapseEmpty: 'never' } });
		assert.ok(googletag.pubads().collapseEmptyDivs.calledWith(false), 'never mode is set in gpt');
	});

	it('submit impression', function () {
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

	it('catches a failure to submit an impression', function () {
		this.ads.utils.attach.restore();
		const attachSpy = this.stub(this.ads.utils, 'attach', function (url, async, successCallback, failureCallback) {
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

	it('logs a warning when trying to submit an impression and the URL is not present within creative', function () {
		const log = this.spy(this.utils.log, 'warn');
		const html = '<div data-o-ads-name="delayedimpression-missing-tracking-div" data-o-ads-out-of-page="true" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(html);
		this.ads.init();
		const slot = this.ads.slots.initSlot('delayedimpression-missing-tracking-div');
		slot.submitGptImpression();
		assert.notOk(this.ads.utils.attach.calledWith('https://www.ft.com'), 'impression url never requested via utils');
		assert.ok(log.calledWith('Impression URL not found, this is set via a creative template.'), 'missing impression URL warning is logged');
	});

	it('logs a warning when trying to submit an impression on a non-oop slot', function () {
		const log = this.spy(this.utils.log, 'warn');
		const html = '<div data-o-ads-name="delayedimpression" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(html);
		this.ads.init();
		const slot = this.ads.slots.initSlot('delayedimpression');
		slot.submitGptImpression();
		assert.notOk(this.ads.utils.attach.calledWith('https://www.ft.com'), 'impression url never requested via utils');
		assert.ok(log.calledWith('Attempting to call submitImpression on a non-oop slot'), 'catches attempt to call submit impression on a non-oop slot');
	});

	it('define a basic slot', function () {
		const html = '<div data-o-ads-name="no-responsive-mpu" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(html);
		this.ads.init({ responsive: false });

		this.ads.slots.initSlot('no-responsive-mpu');
		const gptSlot = this.ads.slots['no-responsive-mpu'].gpt.slot;
		assert.ok(googletag.defineSlot.calledOnce, 'the GPT define slot is called');
		assert.equal(gptSlot.defineSizeMapping.callCount, 0, 'the GPT defineSizeMapping slot is not called');
	});

	it('define responsive slot', function () {
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

	it('rendered event fires on slot', function (done) {

		const html = '<div data-o-ads-name="rendered-test" data-o-ads-formats="MediumRectangle"></div>';
		this.fixturesContainer.add(html);
		this.ads.init();

		document.body.addEventListener('oAds.rendered', function (event) {
			assert.equal(event.detail.name, 'rendered-test', 'our test slot fired the rendered event');
			done();
		});

		this.ads.slots.initSlot('rendered-test');
	});

	it('update correlator', function () {
		this.ads.init();
		this.ads.gpt.updateCorrelator();
		assert.ok(googletag.pubads().updateCorrelator.calledOnce, 'the pub ads update correlator method is called when our method is called.');
	});

	it('fixed url for ad requests', function () {
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


	it('pick up the slot URL from page address if config or canonical not available', function () {
		const urlUtilSpy = this.spy(this.utils, 'getLocation');
		this.fixturesContainer.add('<div data-o-ads-name="url-slot" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init();
		this.ads.slots.initSlot('url-slot');
		assert.ok(urlUtilSpy.calledOnce, 'page url set via utils');
	});


	it('creatives with size 100x100 expand the iframe to 100%', function (done) {

		document.body.addEventListener('oAds.complete', function (event) {
			const iframe = event.detail.slot.gpt.iframe;
			const iframeSize = [iframe.width, iframe.height];
			assert.deepEqual(iframeSize, ['100%', '100%'], 'size of iframe is 100% by 100%.');
			done();
		});

		const slotHTML = '<div data-o-ads-name="fullpage" data-o-ads-sizes="100x100"></div>';
		const node = this.fixturesContainer.add(slotHTML);
		this.ads.init({});
		this.ads.slots.initSlot(node);
	});

	it('debug returns early if no config is set', function () {
		this.ads.init();
		const start = this.spy(this.utils.log, "start");

		this.ads.gpt.debug();
		assert.notOk(start.called, "`utils.start` wasn't called for 'gpt'");
	});

	it('debug logs info when config is set', function () {
		this.ads.init({ gpt: true });
		const start = this.spy(this.utils.log, "start");

		this.ads.gpt.debug();
		assert.ok(start.calledWith('gpt'), "`utils.start` was called for 'gpt'");
	});

	it('enables companion ads', function () {
		this.ads.init({ gpt: { companions: true } });
		assert.ok(googletag.pubads().disableInitialLoad.calledOnce, 'disabled the initial load');
		assert.ok(googletag.companionAds.calledOnce, 'companion ads called');
		assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledOnce, 'companion ads api called');
		assert.ok(googletag.companionAds().setRefreshUnfilledSlots.calledWith(true), 'companion ads api called with correct param');
	});
	it('companion service is enabled globally on slots', function () {
		this.fixturesContainer.add('<div class="o-ads" data-o-ads-name="test" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('test');
		assert.ok(slot.gpt.slot.addService.calledWith(googletag.companionAds()), 'add companionAds service has been called on slot');
	});

	it('companion service can be switched off per format', function () {
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

	it('companion service can be switched off per slot', function () {
		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		assert.ok(slot.gpt.slot.addService.neverCalledWith(googletag.companionAds()), 'add service has not been called on slot');
	});

	it('command queue empty when googletag is available', function () {
		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });

		assert.equal(window.googletag.cmd.length, 0, 'command queue empty when googletag is available');
	});


	it('setup added to command queue when googletag not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.ads.init({ gpt: { companions: true } });
		assert.equal(window.googletag.cmd.length, 1, 'setup added to command queue when googletag not available');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('defineSlot is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.defineSlot();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'defineSlot function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('clearSlot returns false when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');

		slot.clearSlot();
		assert.equal(slot.clearSlot(), false, 'clearSlot function added to command queue');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('initResponsive is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.initResponsive();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'initResponsive function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('display is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.display();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'display function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('setUnitName is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.setUnitName();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setUnitName function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('addServices is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.addServices();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'addServices function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});

	it('setCollapseEmpty is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.setCollapseEmpty();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setCollapseEmpty function added to command queue');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('setURL is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.setURL();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setURL function added to command queue');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('setTargeting is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.setTargeting();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'setTargeting function added to command queue');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('updateCorrelator is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const gptCommandsQueued = window.googletag.cmd.length;

		this.ads.gpt.updateCorrelator();
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'updateCorrelator function added to command queue');
		// reinstate mock
		window.googletag = this.gpt;
	});

	it('clear slot method calls to the ad server providers clear function', function () {
		const slotHTML = '<div data-o-ads-formats="MediumRectangle"></div>';
		const node = this.fixturesContainer.add(slotHTML);
		this.ads.init();
		const slot = this.ads.slots.initSlot(node);
		slot.clearSlot();
		assert.ok(googletag.pubads().clear.calledWith([slot.gpt.slot]), 'googletag clear method called with the correct slot');
	});

	it('onRefresh is added to command queue when googletag is not available', function () {
		// delete the mock for this test
		delete window.googletag;

		this.fixturesContainer.add('<div class="o-ads" data-o-ads-companion="false" data-o-ads-name="TestFormat" data-o-ads-formats="MediumRectangle"></div>');
		this.ads.init({ gpt: { companions: true } });
		const slot = this.ads.slots.initSlot('TestFormat');
		const gptCommandsQueued = window.googletag.cmd.length;

		slot.fire('refresh');
		assert.equal(window.googletag.cmd.length, gptCommandsQueued + 1, 'onRefresh function added to command queue');

		// reinstate mock
		window.googletag = this.gpt;
	});
});
