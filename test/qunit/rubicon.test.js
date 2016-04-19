/* globals QUnit: false */

'use strict'; //eslint-disable-line

QUnit.module('Rubicon', {
	afterEach: function() {
		delete window['oz_api'];
		delete window['oz_callback'];
		delete window['oz_ad_server'];
		delete window['oz_async'];
		delete window['oz_cached_only'];
		delete window['oz_site'];
		delete window['oz_ad_slot_size'];
		delete window['oz_zone'];
	}
});

QUnit.test('init - enabling rubicon attaches the RTP library', function(assert) {
	this.ads.init({rubicon: {id: 10232, site: 26290}});
	assert.ok(this.attach.calledWith('//tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
});

QUnit.test('init - invokes failure callback when cannot attach the RTP script', function(assert) {
	this.utils.attach.restore();
	// stub out the attach method to prevent external files being loaded
	this.attach = this.stub(this.utils, 'attach', function(url, async, fn, errFn) {
		if (typeof errFn === 'function') {
			errFn();
		}
	});

	const logSpy = this.spy(this.utils.log, 'error');

	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		slots: {
			'rubicon-no-target': {
				sizes: [[728, 90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zones: {
				'rubicon-no-target': 1111
			},
			formats: {
				'rubicon-no-target': '728x90'
			}
		}
	});

	this.ads.slots.initSlot('rubicon-no-target');
	assert.ok(this.attach.calledWith('//tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
	assert.ok(logSpy.calledOnce, 'script attachement failure logged');
});


QUnit.test('rubicon configured to make request but not add targeting', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		gpt:{
			network: 1234,
			site: 'rubicon',
			zone: 'rubicon'
		},
		slots: {
			'rubicon-no-target': {
				sizes: [[728, 90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zones: {
				'rubicon-no-target': 1111
			},
			formats: {
				'rubicon-no-target': '728x90'
			}
		}
	});

	const slot = this.ads.slots.initSlot('rubicon-no-target');
	assert.equal(slot.container.getAttribute('data-o-ads-rtp'), 400, 'the estimate is added as a data attrbute');
	assert.notOk(slot.targeting.rtp, 'no slot rtp targeting is set');
	assert.ok(window.oz_api, 'adds the global attributes');
});

QUnit.test('rubicon configured to make request and add targeting', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		gpt:{
			network: 1234,
			site: 'rubicon',
			zone: 'rubicon'
		},
		slots: {
			'rubicon-no-target': {
				sizes: [[728, 90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zones: {
				'rubicon-no-target': 1111
			},
			formats: {
				'rubicon-no-target': '728x90'
			},
			target: true
		}
	});

	const slot = this.ads.slots.initSlot('rubicon-no-target');
	assert.equal(slot.container.getAttribute('data-o-ads-rtp'), 400, 'the estimate is added as a data attrbute');
	assert.ok(slot.targeting.rtp, 'slot rtp targeting is set');
	assert.ok(window.oz_api, 'adds the global attributes');
});

QUnit.test('rubicon fails to init globals when the zone config is missing', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		gpt:{
			network: 1234,
			site: 'rubicon',
			zone: 'rubicon'
		},
		slots: {
			'rubicon-no-target': {
				sizes: [[728, 90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			formats: {
				'rubicon-no-target': '728x90'
			}
		}
	});

	this.ads.slots.initSlot('rubicon-no-target');
	assert.notOk(window.oz_api, 'did not init the global attributes');
});

QUnit.test('rubicon fails to init globals when the zone config is missing', function(assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		gpt:{
			network: 1234,
			site: 'rubicon',
			zone: 'rubicon'
		},
		slots: {
			'rubicon-no-target': {
				sizes: [[728, 90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zones: {
				'rubicon-no-target': 1111
			}
		}
	});

	this.ads.slots.initSlot('rubicon-no-target');
	assert.notOk(window.oz_api, 'did not init the global attributes');
});
