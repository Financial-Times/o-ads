/* globals QUnit: false: false */

'use strict'; //eslint-disable-line

const fetchMock = require('fetch-mock');

QUnit.module('ads API config', {});

QUnit.skip("tests that no calls have been made to the api", function(assert) {

});

QUnit.only("makes api call to correct user url and adds correct data to targeting", function(assert) {
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

  // wait for a second as we need that time to fire the krux script
	setTimeout(function() {
    const targeting = ads.targeting.get();
    const config = ads.config();
    const dfp_targeting =  {
          "device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
          "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
          "slv": "int",
          "loggedIn": true,
          "gender": "F"
    };
    const krux_targeting =  {
            "user": {
            "device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
            "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
            "subscription_level": "int",
            "loggedIn": true,
            "gender": "F"
          }
    };

    Object.keys(dfp_targeting).forEach((key) => {
      assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
    });
    assert.deepEqual(ads.krux.customAttributes, krux_targeting, 'the krux attributes are correct');
  	done();
	}, 1050);
});

QUnit.test("does not overwrite existing data in config", function(assert) {
  const done = assert.async();
	const given = JSON.stringify(this.fixtures.user);

	fetchMock.get('https://ads-api.ft.com/v1/user', given)

  const ads = this.ads.init({
		targetingApi: {
			user: 'https://ads-api.ft.com/v1/user'
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

  // wait for a second as we need that time to fire the krux script
	setTimeout(function() {
		const targeting = ads.targeting.get();
    const config = ads.config();
    const dfp_targeting =  {
          "custom_key": "custom_value",
          "device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
          "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
          "slv": "int",
          "loggedIn": true,
          "gender": "F"
    };
    const krux_targeting =  {
          "custom_key": "custom value",
          "device_spoor_id": "cis61kpxo00003k59j4xnd8kx",
          "guid": "d1359df2-4fe6-4dd6-bb11-eb4342f352ec",
          "subscription_level": "int",
          "loggedIn": true,
          "gender": "F"
    };

    Object.keys(dfp_targeting).forEach((key) => {
        assert.equal(dfp_targeting[key], targeting[key], 'the dfp is added as targeting');
    });

    assert.deepEqual(ads.krux.customAttributes.user, krux_targeting, 'the krux attributes are correct');

    done();
	}, 1050);
});

QUnit.skip("makes api call to correct content url and adds correct data to targeting", function(assert) {
	// assert mock url has been called
	// assert dfp-targeting holds returned data
	// assert krux-targeting holds returned data

  // expect(withoutAttrs.krux.attributes.page.unitName).to.equal('5887/ft.com/testDfpSite/testDfpZone');


});

QUnit.skip("makes api call to correct concept url and adds correct data to targeting", function(assert) {
	// assert mock url has been called
	// assert dfp-targeting holds returned data
	// assert krux-targeting holds returned data

});
