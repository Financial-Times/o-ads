/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
'use strict';

QUnit.module('Moat', {

});

QUnit.test('loads moat js file if configured', function(assert) {
	this.stub(this.utils, 'isScriptAlreadyLoaded').returns(false);
	this.ads.init({moat: {id: "moatid1234"}});
	assert.ok(this.attach.calledWith('https://z.moatads.com/moatid1234/moatcontent.js', true), 'loads moat script if one is not loaded yet');
});

QUnit.test(`doesn't load moat js file if not configured`, function(assert) {
	this.stub(this.utils, 'isScriptAlreadyLoaded').returns(false);
	this.ads.init({});
	assert.ok(this.attach.neverCalledWithMatch('https://z.moatads.com', true), 'loads moat script if one is not loaded yet');
});
