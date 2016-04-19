/* globals QUnit: false */

'use strict'; //eslint-disable-line

const targeting = require('../../src/js/targeting');

QUnit.module('Video Main-player tests');

QUnit.test('buildURLForVideo returns correct URL base when video-hub is set', function (assert) {
	this.ads.init({
		gpt:{
			video: true,
			network: 5887,
			site: 'ftcom.5887.video',
			zone: 'video-hub'
		}
	});

	const result = this.ads.buildURLForVideo("uk","video",{});
	const expected = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/ftcom.5887.video/video-hub&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3Dvideo';
	assert.strictEqual(result.urlStem,expected, 'the url is what we expected');
});

QUnit.test('buildURLForVideo returns correct URL base when video-hub is set but no parameters passed', function (assert) {
	this.ads.init({});
	const result = this.ads.buildURLForVideo();
	const expected = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/undefined/undefined&sz=592x333|400x225&unviewed_position_start=1&scp=pos%3Dvideo';
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

	const result = this.ads.buildURLForVideo("uk","video",{});
	const expected = 'slv=test1&';
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


	const result = this.ads.buildURLForVideo("uk","video",{slv: 'test3'});
	const expected = 'slv=test3&';
	assert.strictEqual(decodeURIComponent(result.additionalAdTargetingParams), expected, 'the targetting parameters are correct');
});
