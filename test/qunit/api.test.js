/* globals QUnit: false, sinon: false */

'use strict'; //eslint-disable-line

const fetchMock = require('fetch-mock');

QUnit.module('ads API config', {
	afterEach: function() {
		this.deleteCookie('FTConsent');
	}
});

QUnit.test('resolves with an empty promise if called without any urls', function(assert) {
	const done = assert.async();

	this.ads.api.init()
		.then(res => {
			assert.equal(res, undefined);
			done();
		});
});

QUnit.test("fires an 'adsAPIComplete' event when all API requests succeed", function(assert) {
	const done = assert.async();
	const broadcast = this.stub(this.utils, 'broadcast');

	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/page', pageJSON);
	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/page',
			user: 'https://ads-api.ft.com/v1/user'
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'unclassified'
		}
	});

	ads.then((ads) => {
		ads.targeting.get();
		// TO-DO: We should be using 'calledOnceWith' instead of 'calledWith' here
		// However browserstack-local forces us to pull in an old version of sinon
		// that doesn't have 'calledOnceWith'
		assert.ok(broadcast.calledWith('adsAPIComplete'), 'with adsAPIComplete');
		done();
	});
});

QUnit.test("fires an 'adsAPIComplete' event when the user api request fails", function(assert) {
	const done = assert.async();
	const broadcast = this.stub(this.utils, 'broadcast');

	const pageJSON = JSON.stringify(this.fixtures.content);

	fetchMock.get('https://ads-api.ft.com/v1/page', pageJSON);
	fetchMock.get('https://ads-api.ft.com/v1/user/error', 500);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/page',
			user: 'https://ads-api.ft.com/v1/user/error'
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'unclassified'
		}
	});

	ads.then((ads) => {
		ads.targeting.get();
		assert.ok(broadcast.calledWith('adsAPIComplete'));
		done();
	});
});

QUnit.test("fires an 'adsAPIComplete' event when the page api request fails", function(assert) {
	const done = assert.async();
	const broadcast = this.stub(this.utils, 'broadcast');

	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/page/error', 500);
	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/page/error',
			user: 'https://ads-api.ft.com/v1/user'
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'unclassified'
		}
	});

	ads.then((ads) => {
		ads.targeting.get();
		assert.ok(broadcast.calledWith('adsAPIComplete'));
		done();
	});
});

QUnit.test('can handle errors in the api response', function(assert) {
	const done = assert.async();

	fetchMock.get('https://ads-api.ft.com/v1/concept/error', 500);
	fetchMock.get('https://ads-api.ft.com/v1/user/error', 500);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/error',
			user: 'https://ads-api.ft.com/v1/user/error'
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'unclassified'
		}
	});


	ads.then((ads) => {
		ads.targeting.get();
		const config = ads.config();

		assert.equal(ads.isInitialised, true);
		assert.equal(config.gpt.zone, 'unclassified');
		done();
	});
});


QUnit.test("makes api call to correct user url and adds correct data to targeting", function(assert) {
	const done = assert.async();
	const userJSON = JSON.stringify(this.fixtures.user);

	const apiCallMock = fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
		}
	});

	ads.then((ads) => {
		const targeting = ads.targeting.get();
		ads.config();
		const dfp_targeting = {
			"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
			"guid": "11111111-2222-3333-4444-555555555555",
			"slv": "int",
			"loggedIn": true,
			"gender": "F"
		};
		const lastCallOpts = apiCallMock.lastCall()[1];
		assert.equal(lastCallOpts.credentials, "include");
		assert.equal(lastCallOpts.timeout, 2000);
		assert.equal(lastCallOpts.useCorsProxy, true);

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});
		done();
	});

});

QUnit.test("does not overwrite existing data in user config", function(assert) {
	const done = assert.async();
	const userJSON = JSON.stringify(this.fixtures.user);

	document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon%2CprogrammaticadsOnsite%3Aon';

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
		},
		dfp_targeting: "custom_key=custom_value",
	});

	ads.then((ads) => {
		const targeting = ads.targeting.get();
		ads.config();
		const dfp_targeting = {
			"custom_key": "custom_value",
			"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
			"guid": "11111111-2222-3333-4444-555555555555",
			"slv": "int",
			"loggedIn": true,
			"gender": "F"
		};
		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});
		done();
	});
});

QUnit.test("makes api call to correct page/content url and adds correct data to targeting", function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	const apiCallMock = fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
	});


	const lastCallOpts = apiCallMock.lastCall()[1];
	assert.equal(lastCallOpts.credentials, null);
	assert.equal(lastCallOpts.timeout, 2000);
	assert.equal(lastCallOpts.useCorsProxy, true);

	ads.then((ads) => {
		const targeting = ads.targeting.get();
		ads.config();
		const dfp_targeting = {
			"auuid": "13abbe62-70db-11e6-a0c9-1365ce54b926",
			"ad": "ft11,s03,sm01,s05,s04,ft13",
			"ca": "finance,company,business"
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		done();
	});
});


QUnit.test("makes api call to correct page/content url and adds correct data to behavioral meta", function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		}
	});

	ads.then((ads) => {
		const behavioralConf = ads.config('behavioralMeta');
		//console.log(behavioralConf);
		assert.ok(behavioralConf.page);
		assert.ok(behavioralConf.user);

		done();
	});
});

QUnit.test("makes use of custom set timeout when calling getPageData directly", function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	const apiCallMock = fetchMock.get('https://ads-api.ft.com/v1/content/16502d40-3559-11e7-99bd-13beb0903fa3', pageJSON);

	const ads = this.ads.api.getPageData('https://ads-api.ft.com/v1/content/16502d40-3559-11e7-99bd-13beb0903fa3', 300);

	ads.then(() => {
		const lastCallOpts = apiCallMock.lastCall()[1];
		assert.equal(lastCallOpts.credentials, null);
		assert.equal(lastCallOpts.timeout, 300);
		assert.equal(lastCallOpts.useCorsProxy, true);
		done();
	});
});

QUnit.test("does not overwrite existing data in page config", function(assert) {
	const done = assert.async();
	const userJSON = JSON.stringify(this.fixtures.user);
	const pageJSON = JSON.stringify(this.fixtures.content);

	document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon%2CprogrammaticadsOnsite%3Aon';

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
		dfp_targeting: "custom_key=custom_value",
		gpt: {

		}
	});


	ads.then((ads) => {
		const targeting = ads.targeting.get();
		ads.config();
		const dfp_targeting = {
			"custom_key": "custom_value",
			"auuid": "13abbe62-70db-11e6-a0c9-1365ce54b926",
			"ad": "ft11,s03,sm01,s05,s04,ft13",
			"ca": "finance,company,business"
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		done();
	});
});

QUnit.test('overwrites the config gpt zone with the adunit from the page response if "usePageZone" is true', function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			usePageZone: true
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'old/zone'
		}
	});


	ads.then((ads) => {
		ads.targeting.get();
		const config = ads.config();
		assert.equal(config.gpt.site, 'ft.com');
		assert.equal(config.gpt.zone, 'companies/technology');
		done();
	});

});

QUnit.test('does not overwrite the config gpt zone with the adunit from the page response by default', function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'old/zone'
		}
	});


	ads.then((ads) => {
		ads.targeting.get();
		const config = ads.config();
		assert.equal(config.gpt.site, 'ft.com');
		assert.equal(config.gpt.zone, 'old/zone');
		done();
	});

});

QUnit.test('does not overwrite the config gpt zone if using adUnit instead of site/zone', function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
		gpt: {
			adUnit: '5887/ft.com/site/zone'
		}
	});


	ads.then((ads) => {
		ads.targeting.get();
		const config = ads.config();
		assert.equal(config.gpt.adUnit, '5887/ft.com/site/zone');
		assert.equal(config.gpt.zone, undefined);
		done();
	});
});

QUnit.test("allows single page app to update the user targeting from API on the fly", function(assert) {
	const done = assert.async();
	const userJSON = JSON.stringify(this.fixtures.user);

	document.cookie = 'FTConsent=behaviouraladsOnsite:on;';

	// mocks api response
	const apiCallMock = fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
		}
	});

	ads.then((ads) => {
		// get config and targeting
		const targeting = ads.targeting.get();
		ads.config();

		// expectations
		const dfp_targeting = {
			"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
			"guid": "11111111-2222-3333-4444-555555555555",
			"slv": "int",
			"loggedIn": true,
			"gender": "F"
		};
		const lastCallOpts = apiCallMock.lastCall()[1];
		assert.equal(lastCallOpts.credentials, "include");
		assert.equal(lastCallOpts.timeout, 2000);
		assert.equal(lastCallOpts.useCorsProxy, true);

		// assertions
		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		////////////////////////////////////////////////////////////////////////////////////////////////
		// ABOVE IS COPIED FROM PREVIOUS TEST AND JUST A NORMAL EXPECTED BEHAVIOUR                    //
		// CODE BELOW THIS LINE WILL EXPECT A CALL TO API IN ORDER TO UPDATE USER TARGETING           //
		////////////////////////////////////////////////////////////////////////////////////////////////

		// mock the API response with a new user data (or anonymous)
		const userAnonymousJSON = JSON.stringify(this.fixtures.userAnonymous);
		fetchMock.restore().mock('https://ads-api.ft.com/v1/user', userAnonymousJSON);

		ads.api.reset();
		ads.api.init({ user: 'https://ads-api.ft.com/v1/user'}, ads).then(() => {

			// same as above, get the targeting and config based in order to test
			const targeting = ads.targeting.get();
			ads.config();

			// define the new expectations
			const dfp_targeting_anon = {
				"slv": "anon",
				"loggedIn": false
			};

			// run the assertions
			Object.keys(dfp_targeting_anon).forEach((key) => {
				assert.equal(dfp_targeting_anon[key], targeting[key], 'the dfp is added as targeting');
			});
			// make sure we have removed old keys (thats where anonymous user helps)
			assert.notOk(targeting['device_spoor_id'], 'previous user dfp keys have been removed');

			done();
		});
	});
});

QUnit.test("Single Page app can update page context data", function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);

	document.cookie = 'FTConsent=behaviouraladsOnsite:off;';

	const apiCallMock = fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
	});


	const lastCallOpts = apiCallMock.lastCall()[1];
	assert.equal(lastCallOpts.credentials, null);
	assert.equal(lastCallOpts.timeout, 2000);
	assert.equal(lastCallOpts.useCorsProxy, true);

	ads.then((ads) => {
		const targeting = ads.targeting.get();
		ads.config();
		const dfp_targeting = {
			"auuid": "13abbe62-70db-11e6-a0c9-1365ce54b926",
			"ad": "ft11,s03,sm01,s05,s04,ft13",
			"ca": "finance,company,business"
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		////////////////////////////////////////////////////////////////////////////////////////////////
		// ABOVE IS COPIED FROM PREVIOUS TEST AND JUST A NORMAL EXPECTED BEHAVIOUR                    //
		// CODE BELOW THIS LINE WILL EXPECT A CALL TO API IN ORDER TO UPDATE TARGETING                //
		////////////////////////////////////////////////////////////////////////////////////////////////
		const anotherContentJSON = JSON.stringify(this.fixtures.anotherContent);
		fetchMock.get('https://ads-api.ft.com/v1/concept/anotherId', anotherContentJSON);
		ads.api.reset();
		ads.api.init({ page: 'https://ads-api.ft.com/v1/concept/anotherId'}, ads).then(function() {

			const targeting = ads.targeting.get();
			ads.config();
			const dfp_targeting_updated = {
				"auuid": "11111111-2222-3333-4444-555555555555",
				"ad": "s03,sm01",
				"ca": "random,answers,here"
			};

			Object.keys(dfp_targeting_updated).forEach((key) => {
				assert.equal(dfp_targeting_updated[key], targeting[key], 'the dfp is added as targeting');
			});

			done();
		});
	});
});




QUnit.skip("allows single page app to update the concept targeting from API on the fly", function(assert) {
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.concept);

	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM='
		},
		gpt: {
			network: '5887',
			site: 'ft.com',
			zone: 'old/zone'
		}
	});


	ads.then((ads) => {
		ads.targeting.get();
		const config = ads.config();
		assert.equal(config.gpt.site, 'ft.com');
		assert.equal(config.gpt.zone, 'old/zone');

		////////////////////////////////////////////////////////////////////////////////////////////////
		// ABOVE IS COPIED FROM PREVIOUS TEST AND JUST A NORMAL EXPECTED BEHAVIOUR                    //
		// CODE BELOW THIS LINE WILL EXPECT A CALL TO API IN ORDER TO UPDATE TARGETING                //
		////////////////////////////////////////////////////////////////////////////////////////////////
		// PROBABLY PUT METHOD ELSEWHERE AND NAME IT MORE APPROPRIETLY
		ads.getConceptTargetingFromServer('https://ads-api.ft.com/v1/concept/anotherId').then(function() {
			ads.targeting.get();
			const config_updated = ads.config();
			assert.equal(config_updated.gpt.site, 'ft.com');
			assert.equal(config_updated.gpt.zone, 'work.and.career');
			done();
		});
	});
});

QUnit.test("calls targetingApi.apiResponsaHandler with the right arguments", function(assert) {
	const apiResponseHandler = sinon.stub();
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			apiResponseHandler
		}
	});

	const expectedHandlerArg = [this.fixtures.user, this.fixtures.content];

	ads.then(() => {
		assert.ok(apiResponseHandler.calledOnce);
		const receivedArgs = apiResponseHandler.lastCall.args[0];
		assert.deepEqual(expectedHandlerArg, receivedArgs);
		done();
	});
});

QUnit.test("doesn't call targetingAPi.apiResponseHandler if it's not a function", function(assert) {
	const apiResponseHandler = "something";
	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			apiResponseHandler
		}
	});

	ads.then(() => {
		assert.notOk(apiResponseHandler.called);
		done();
	});
});

QUnit.test("calls this.instance.targeting.add if apiResponseHandler returns an object", function(assert) {
	const customTargetingParams = { a: 'b' };

	const apiResponseHandler = sinon.stub();
	apiResponseHandler.returns(customTargetingParams);
	sinon.spy(this.ads.targeting, 'add');

	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			apiResponseHandler
		}
	});

	ads.then(() => {
		assert.equal(this.ads.targeting.add.callCount, 3);
		assert.ok(this.ads.targeting.add.calledWith(sinon.match(customTargetingParams)));
		this.ads.targeting.add.restore();
		done();
	});
});

QUnit.test("doesn't call this.instance.targeting.add ADDITIONALLY if apiResponseHandler returns null", function(assert) {
	const apiResponseHandler = sinon.stub();
	apiResponseHandler.returns(null);
	sinon.spy(this.ads.targeting, 'add');

	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			apiResponseHandler
		}
	});

	ads.then(() => {
		assert.equal(this.ads.targeting.add.callCount, 2);
		this.ads.targeting.add.restore();
		done();
	});
});

QUnit.test("doesn't calls this.instance.targeting.add ADDITIONALLY if apiResponseHandler returns undefined", function(assert) {
	const apiResponseHandler = sinon.stub();
	apiResponseHandler.returns(undefined);
	sinon.spy(this.ads.targeting, 'add');

	const done = assert.async();
	const pageJSON = JSON.stringify(this.fixtures.content);
	const userJSON = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', userJSON);
	fetchMock.get('https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=', pageJSON);

	const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user',
			page: 'https://ads-api.ft.com/v1/concept/MTI1-U2VjdGlvbnM=',
			apiResponseHandler
		}
	});

	ads.then(() => {
		assert.equal(this.ads.targeting.add.callCount, 2);
		this.ads.targeting.add.restore();
		done();
	});
});
