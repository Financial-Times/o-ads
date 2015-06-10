/* jshint globalstrict: true, browser: true */
/* globals QUnit: false: false */
'use strict';

QUnit.module('Main');

QUnit.test('init All', function(assert) {
	var done = assert.async();
	this.fixturesContainer.add('<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');

	document.body.addEventListener('oAds.ready', function(event) {
		assert.equal(event.detail.name, 'banlb2', 'our test slot is requested');
		assert.deepEqual(event.detail.slot.sizes, [[300, 250]], 'with the correct sizes');
		done();
	});
	this.trigger(document.body, 'o.DOMContentLoaded');

});
