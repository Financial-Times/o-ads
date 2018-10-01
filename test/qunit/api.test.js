/* globals QUnit: false: false */

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
		},
		krux: {
			id: '1234'
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
		const krux_targeting = {
			"user": {
				"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
				"guid": "11111111-2222-3333-4444-555555555555",
				"subscription_level": "int",
				"loggedIn": true,
				"gender": "F"
			}
		};
		const lastCallOpts = apiCallMock.lastCall()[1];
		assert.equal(lastCallOpts.credentials, "include");
		assert.equal(lastCallOpts.timeout, 2000);
		assert.equal(lastCallOpts.useCorsProxy, true);

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});
		assert.deepEqual(ads.krux.customAttributes.user, krux_targeting.user, 'the krux attributes are correct');
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
		krux: {
			id: '1234',
			attributes: {
				user: {
					custom_key: 'custom value'
				}
			}
		}
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
		const krux_targeting = {
			"custom_key": "custom value",
			"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
			"guid": "11111111-2222-3333-4444-555555555555",
			"subscription_level": "int",
			"loggedIn": true,
			"gender": "F"
		};
		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});
		assert.deepEqual(ads.krux.customAttributes.user, krux_targeting, 'the krux attributes are correct');
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
		krux: {
			id: '1234'
		}
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
		const krux_targeting = {
			"authors": ["Jung-a Song"],
			"genre": ["News"],
			"primarySection": ["Technology"],
			"specialReports": [],
			"topics": ["Mobile devices", "Batteries"],
			"rootid": targeting.rootid
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		assert.deepEqual(ads.krux.customAttributes.page, krux_targeting, 'the krux attributes are correct');
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
		krux: {
			id: '1234',
			attributes: {
				page: {
					custom_key: 'custom_value'
				}
			}
		},
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
		const krux_targeting = {
			"custom_key": "custom_value",
			"authors": ["Jung-a Song"],
			"genre": ["News"],
			"primarySection": ["Technology"],
			"specialReports": [],
			"topics": ["Mobile devices", "Batteries"],
			"rootid": targeting.rootid
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		assert.deepEqual(ads.krux.customAttributes.page, krux_targeting, 'the krux attributes are correct');
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
		},
		krux: {
			id: '1234'
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
		const krux_targeting = {
			"user": {
				"device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
				"guid": "11111111-2222-3333-4444-555555555555",
				"subscription_level": "int",
				"loggedIn": true,
				"gender": "F"
			}
		};
		const lastCallOpts = apiCallMock.lastCall()[1];
		assert.equal(lastCallOpts.credentials, "include");
		assert.equal(lastCallOpts.timeout, 2000);
		assert.equal(lastCallOpts.useCorsProxy, true);

		// assertions
		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});
		assert.deepEqual(ads.krux.customAttributes.user, krux_targeting.user, 'the krux attributes are correct');



		////////////////////////////////////////////////////////////////////////////////////////////////
		// ABOVE IS COPIED FROM PREVIOUS TEST AND JUST A NORMAL EXPECTED BEHAVIOUR                    //
		// CODE BELOW THIS LINE WILL EXPECT A CALL TO API IN ORDER TO UPDATE KRUX AND USER TARGETING  //
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

			const krux_targeting_anon = {
				"user": {
				}
			};
			// run the assertions
			Object.keys(dfp_targeting_anon).forEach((key) => {
				assert.equal(dfp_targeting_anon[key], targeting[key], 'the dfp is added as targeting');
			});
			// make sure we have removed old keys (thats where anonymous user helps)
			assert.notOk(targeting['device_spoor_id'], 'previous user dfp keys have been removed');

			assert.deepEqual(ads.krux.customAttributes.user, krux_targeting_anon.user, 'the krux attributes are correct');
			// make sure we have removed old keys (thats where anonymous user helps)
			assert.notOk(ads.krux.customAttributes.user['device_spoor_id'], 'previous user krux keys have been removed');

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
		krux: {
			id: '1234'
		}
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
		const krux_targeting = {
			"authors": ["Jung-a Song"],
			"genre": ["News"],
			"primarySection": ["Technology"],
			"specialReports": [],
			"topics": ["Mobile devices", "Batteries"],
			"rootid": targeting.rootid
		};

		Object.keys(dfp_targeting).forEach((key) => {
			assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
		});

		assert.deepEqual(ads.krux.customAttributes.page, krux_targeting, 'the krux attributes are correct');


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
			const krux_targeting_updated = {
				"authors": ["Jung-a Song1"],
				"genre": ["News2"],
				"primarySection": ["Technology3"],
				"specialReports": [],
				"topics": ["Mobile devices4", "Batteries5"]
			};

			Object.keys(dfp_targeting_updated).forEach((key) => {
				assert.equal(dfp_targeting_updated[key], targeting[key], 'the dfp is added as targeting');
			});

			assert.deepEqual(ads.krux.customAttributes.page, krux_targeting_updated, 'the krux attributes are correct');
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
