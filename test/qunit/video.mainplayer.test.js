/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

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
	var expected = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=/5887/ftcom.5887.video/video-hub&sz=592x333&unviewed_position_start=1&scp=pos%3Dvideo';
	assert.strictEqual(result.urlStem,expected, 'the url is what we expected');
});
