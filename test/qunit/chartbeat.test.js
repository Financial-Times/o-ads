/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Chartbeat');

QUnit.test('the refreshAd method is called before gpt begins refreshing the ad', function (assert) {
	this.ads.init();

	var decorateRefresh = this.spy(this.ads.cb, 'decorateRefresh');
	var cbRefresh = this.spy(this.ads.cb, 'refresh');
	var gptRefresh = this.spy(this.ads.gpt, 'refresh');

	window.pSUPERFLY = {refreshAd: this.stub};
	this.ads.cb.init(this.ads);
	assert.ok(decorateRefresh.called, 'initialising chartbeat decorates the gpt refresh method.');

	this.ads.gpt.refresh();
	assert.ok(cbRefresh.called, 'whenever gpt refresh is called cb refresh is called too.');
	assert.ok(gptRefresh.called, 'whenever gpt refresh is called cb refresh is called too.');
});
