/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Rubicon');

QUnit.test('init - enabling rubicon attaches the RTP library', function (assert) {
	this.ads.init({rubicon: {id: 10232, site: 26290}});
	assert.ok(this.attach.calledWith('//tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
});

QUnit.test('rubicon configured to make request but not add targeting', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div data-o-ads-name="rubicon-no-target"></div>');
	this.ads.init({
		gpt:{
			network: 1234,
			site: 'rubicon',
			zone: 'rubicon'
		},
		slots: {
			'rubicon-no-target': {
				sizes: [[728,90]]
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

	var slot = this.ads.slots.initSlot('rubicon-no-target');
	assert.equal(slot.container.getAttribute('data-o-ads-rtp'), 400, 'the estimate is added as a data attrbute');
});
