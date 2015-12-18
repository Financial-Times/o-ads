/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

var targeting = require('../../src/js/targeting');

QUnit.module('Video Main-player tests');

QUnit.test('buildURLForVideo returns correct URL base when vidoe-hub is set', function (assert) {
	this.ads.init({
		gpt:{
			video: true,
			network: 5887,
			site: 'ftcom.5887.video',
			zone: 'video-hub'
		}
	});

	var result = this.ads.buildURLForVideo("uk","video",{});
	var expected = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/ftcom.5887.video/video-hub&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3Dvideo';
	assert.strictEqual(result.urlStem,expected, 'the url is what we expected');
});

QUnit.test('buildURLForVideo returns correct URL base when vidoe-hub is set but no parameters passed', function (assert) {
	this.ads.init({});
	var result = this.ads.buildURLForVideo();
	var expected = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/undefined/undefined&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3Dvideo';
	assert.strictEqual(result.urlStem,expected, 'the url is what we expected when no parameters are passed');
});


QUnit.test('buildURLForVideo returns correct targetting parameters from targetting module', function (assert) {
	this.ads.init({
		gpt:{
			video: true,
			network: 5887,
			site: 'ftcom.5887.video',
			zone: 'video-hub'
		}
	});

	this.stub(targeting, 'get', function() {
		return {slv: 'test1', ksg: []};
	});

	var result = this.ads.buildURLForVideo("uk","video",{});
	var expected = 'slv=test1&';
	assert.strictEqual(decodeURIComponent(result.additionalAdTargetingParams), expected, 'the targetting parameters are correct');
});

QUnit.test('buildURLForVideo returns correct targetting parameters from options passed', function (assert) {
	this.ads.init({
		gpt:{
			video: true,
			network: 5887,
			site: 'ftcom.5887.video',
			zone: 'video-hub'
		}
	});


	var result = this.ads.buildURLForVideo("uk","video",{slv: 'test3'});
	var expected = 'slv=test3&';
	assert.strictEqual(decodeURIComponent(result.additionalAdTargetingParams), expected, 'the targetting parameters are correct');
});
