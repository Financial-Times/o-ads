/* globals QUnit: false */

'use strict'; //eslint-disable-line

QUnit.module('Targeting', {});

QUnit.test('OADS_VERSION is set to value set in config', function(assert) {
	const getVersion = this.stub(this.ads.utils, 'getVersion');
	getVersion.returns('x.y.z');

	this.ads.init({ passOAdsVersion: true });

	const result = this.ads.targeting.get();
	assert.ok(getVersion.called, 'utils.getVersion() should be called');
	assert.equal(
		result.OADS_VERSION,
		`x.y.z`,
		'OADS_VERSION targeting parameter should be present if passOAdsVersion is set to true'
	);
});

QUnit.test('OADS_VERSION is not set if the flag is set to false', function(assert) {
	const getVersion = this.stub(this.ads.utils, 'getVersion');
	getVersion.returns('x.y.z');
	this.ads.init({ passOAdsVersion: false });

	const result = this.ads.targeting.get();
	assert.notOk(getVersion.called, 'utils.getVersion() should not be called');
	assert.equal(
		result.OADS_VERSION,
		undefined,
		'OADS_VERSION parameter should not be present when passOAdsVersion is set to false'
	);
});

QUnit.test('OADS_VERSION is not set if not provided in config', function(assert) {
	const getVersion = this.stub(this.ads.utils, 'getVersion');
	getVersion.returns('x.y.z');
	this.ads.init();

	const result = this.ads.targeting.get();
	assert.notOk(getVersion.called, 'utils.getVersion() should not be called');
	assert.equal(
		result.OADS_VERSION,
		undefined,
		'OADS_VERSION parameter should not be present when passOAdsVersion is not set'
	);
});

QUnit.test('socialflow parameter', function(assert) {
	this.stub(this.ads.utils, 'getQueryParamByName').returns('ohheey');
	assert.deepEqual(this.ads.targeting.socialFlow(), { socialflow: 'ohheey' });
});

QUnit.test('social referrer', function(assert) {
	let result;
	const referrer = this.stub(this.ads.utils, 'getReferrer');

	referrer.returns('');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, undefined, 'No document referrer, socref key returns undefined');

	referrer.returns('http://t.co/cjPOFshzk2');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'twi', 'Already logged in, twitter should be mapped from t.co to twi');

	referrer.returns('http://www.facebook.com/l.php?');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'fac', 'Already logged in, facebook should be mapped from facebook.com to fac');

	referrer.returns('http://www.linkedin.com/company/4697?trk=NUS-body-company-name');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'lin', 'Already logged in, linkedin should be mapped from linkedin.com to lin');

	referrer.returns('http://www.drudgereport.com/');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'dru', 'Already logged in, drudge should be mapped from drudgereport.com to dru');

	referrer.returns('http://dianomi.com');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'dia', 'Already logged in, drudge should be mapped from dianomi.com to dia');

	referrer.returns('http://google.com/');
	this.ads.init({ socialReferrer: true });
	result = this.ads.targeting.get();
	assert.equal(result.socref, 'goo', 'Already logged in, drudge should be mapped from google.com to goo');
});

QUnit.test('timestamp', function(assert) {
	// AF: The function that sets result.ts (under test here) uses `new Date()`
	// so we need to use the same here. Using Date.UTC() will not work if
	// you're not in UTC timezone. Found out the hard way!
	const curTime = new Date(2013, 10, 18, 23, 30, 7);
	const clock = this.date(curTime.valueOf());
	this.ads.init({ timestamp: true });
	let result = this.ads.targeting.get();
	assert.equal(result.ts, '20131118233007', 'timestamp value returns correctly');

	// Fast forward one hour
	clock.tick(3600000);
	result = this.ads.targeting.get();
	assert.equal(result.ts, '20131119003007', 'fast forward one hour and timestamp value returns correctly');
});

QUnit.test('responsive', function(assert) {
	const breakpoint = this.stub(this.ads.utils.responsive, 'getCurrent');
	breakpoint.returns('small');
	this.ads.init({ responsive: [] });
	const result = this.ads.targeting.get();

	assert.equal(result.res, 'small');
});

QUnit.test('Responsive targeting on non-responsive page', function(assert) {
	const breakpoint = this.stub(this.ads.utils.responsive, 'getCurrent');
	breakpoint.returns('small');
	this.ads.init({ responsive: false });
	const result = this.ads.targeting.get();

	assert.equal(result.hasOwnProperty('res'), false);
});

QUnit.test('debug starts logging data', function(assert) {
	this.ads.init({ dfp_targeting: { data: { allOfThe: 'targeting data' } } });
	const start = this.spy(this.utils.log, 'start');

	this.ads.targeting.debug();
	assert.ok(start.called, "`utils.start` was called for 'targeting'");
});
