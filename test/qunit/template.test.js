/* globals QUnit: false: false */

'use strict'; //eslint-disable-line

const fetchMock = require('fetch-mock');

QUnit.module('ads API config', {});

QUnit.test("tests that no calls have been made to the api", function(assert) {

});

QUnit.test("makes api call to correct user url and adds correct data to targeting", function(assert) {
  const done = assert.async();
	const given = JSON.stringify(this.fixtures.user);

  fetchMock.get('https://ads-api.ft.com/v1/user', given)

  const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user'
    },
    krux: {
      id: '1234'
    }
	});

	setTimeout(function() {
		const result = ads.config();
    const dfp = 'slv=int;loggedIn=true;device_spoor_id=cis61kpxo00003k59j4xnd8kx;guid=d1359df2-4fe6-4dd6-bb11-eb4342f352ec;gender=F'
    const krux_user =  {
          "device_spoor_id" : "cis61kpxo00003k59j4xnd8kx",
          "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
          "subscription_level": "int",
          "loggedIn": true,
          "gender": "F"
    };

		assert.equal(result.dfp_targeting, dfp, 'the dfp is added as targeting');
    assert.deepEqual(result.krux.attributes.user, krux_user, 'the krux attributes are correct');
  	done();
	}, 20);
});

QUnit.only("does not overwrite existing data in config", function(assert) {
  const done = assert.async();
	const given = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', given)

  const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user'
    },
    krux: {
      id: '1234',
      attributes: {
        user: {
          custom_key: 'custom value'
        }
      }
    }
	});

	setTimeout(function() {
		const result = ads.config();
    const dfp = 'slv=int;loggedIn=true;device_spoor_id=cis61kpxo00003k59j4xnd8kx;guid=d1359df2-4fe6-4dd6-bb11-eb4342f352ec;gender=F'
    const krux_user =  {
          "custom_key": "custom value",
          "device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
          "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
          "subscription_level": "int",
          "loggedIn": true,
          "gender": "F"
    };

		// assert.equal(result.dfp_targeting, dfp, 'the dfp is added as targeting');
    assert.deepEqual(result.krux.attributes.user, krux_user, 'the krux attributes are correct');

    done();
	}, 20);
});

QUnit.test("makes api call to correct content url and adds correct data to targeting", function(assert) {
	// assert mock url has been called
	// assert dfp-targeting holds returned data
	// assert krux-targeting holds returned data

  // expect(withoutAttrs.krux.attributes.page.unitName).to.equal('5887/ft.com/testDfpSite/testDfpZone');


});

QUnit.test("makes api call to correct concept url and adds correct data to targeting", function(assert) {
	// assert mock url has been called
	// assert dfp-targeting holds returned data
	// assert krux-targeting holds returned data

});

QUnit.test("")
