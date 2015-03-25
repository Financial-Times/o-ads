/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Rubicon');

QUnit.test('init - enabling rubicon attaches the RTP library', function (assert) {
	this.ads.init({rubicon: {id: 10232, site: 26290}});
	assert.ok(this.ads.utils.attach.calledWith('http://tap-cdn.rubiconproject.com/partner/scripts/rubicon/dorothy.js?pc=10232/26290'), 'rubicon library is attached to the page');
});

QUnit.test('rubicon configured to make request but not add targeting', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div id="rubicon-no-target"></div>');
	this.ads.init({
		network: 1234,
		dfp_site: 'rubicon',
		dfp_zone: 'rubicon',
		formats: {
			'rubicon-no-target': {
				sizes: [[728,90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zone: 1111,
			formats: {
				'rubicon-no-target': '728x90'
			}
		}
	});

	assert.equal(this.ads.slots.initSlot, this.ads.rubicon.decoratorNoTarget, 'Inislot is decorated with the correct method');
});

QUnit.test('rubicon configured to make request and add targeting', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<div id="rubicon-no-target"></div>');
	this.ads.init({
		network: 1234,
		dfp_site: 'rubicon',
		dfp_zone: 'rubicon',
		formats: {
			'rubicon-no-target': {
				sizes: [[728,90]]
			}
		},
		rubicon: {
			id: 10232,
			site: 26290,
			zone: 1111,
			target: true,
			formats: {
				'rubicon-target': '728x90'
			}
		}
	});

	assert.equal(this.ads.slots.initSlot, this.ads.rubicon.decoratorTarget, 'Inislot is decorated with the correct method');
});
