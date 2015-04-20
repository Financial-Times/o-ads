/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Metadata');

QUnit.test('getLoggedinInfo', function (assert) {
	var result;

	this.cookies({});
	this.ads.init();
	result = this.ads.metadata.getLoginInfo();
	assert.equal(result.eid, null, 'No FT_U or FT_Remember returns null');
	assert.equal(result.loggedIn, false, 'the user is not logged in');

	this.cookies({FT_U: '_EID=1111111_PID=4009036331_TIME=%5BTue%2C+06-Aug-2013+11%3A54%3A53+GMT%5D_SKEY=lUM4QDoONobvNQGGJP3ETA%3D%3D_RI=0_I=1'});
	result = this.ads.metadata.getLoginInfo();
	assert.equal(result.eid, '1111111', 'FT_U set returns correct eid (1111111)');
	assert.equal(result.loggedIn, true, 'the user is logged in');

	this.cookies({FT_Remember: '222222:TK1583990837682794904:FNAME=Bat:LNAME=man:EMAIL=batman@not.wayne.enterprises.com'});
	result = this.ads.metadata.getLoginInfo();
	assert.equal(result.eid, '222222', 'FT_Remember set returns correct eid (222222)');
	assert.equal(result.loggedIn, true, 'the user is logged in');

	this.cookies({ FT_U: '_EID=333333_PID=4009036331_TIME=%5BTue%2C+06-Aug-2013+11%3A54%3A53+GMT%5D_SKEY=lUM4QDoONobvNQGGJP3ETA%3D%3D_RI=0_I=1_', FT_Remember: '444444:TK1583990837682794904:FNAME=Bat:LNAME=man:EMAIL=batman@not.wayne.enterprises.com'});
	result = this.ads.metadata.getLoginInfo();
	assert.equal(result.eid, '333333', 'FT_U and FT_Remember set returns eid (333333) from FT_U');
	assert.equal(result.loggedIn, true, 'the user is logged in');

	this.cookies({ FTSession: '4009036331'});
	result = this.ads.metadata.getLoginInfo();
	assert.equal(result.eid, null, 'No FT_U or FT_Remember set but FTSession is present, returns eid (null) but logged in true');
	assert.equal(result.loggedIn, true, 'the user is logged in');
});

QUnit.test("getAyscVars", function (assert) {
	var result;

	this.cookies({AYSC :"_02gender_04state_05industry_06responsibility_07position_14subCountry_17regionalArea_18city_19companySize_20personalInvestor_21companyListings_22subscriberInformation_24continent_25lineSpeed_26areaCode_27corporateAccessIDcode_40companysize_41industry_42turnover_45country_43cameocountry_46cameoinvestor_51cameoproperty_44cameolocal_"});
	this.ads.init();
	result = this.ads.metadata.getAyscVars();
	assert.strictEqual(result["02"], "gender", "Gender Cookie");
	assert.strictEqual(result["05"], "industry", "Industry Cookie");
	assert.strictEqual(result["06"], "responsibility", "Area of Responsibilities Cookie");
	assert.strictEqual(result["07"], "position", "Business Position Cookie");
	assert.strictEqual(result["14"], "subCountry", "Country Tag");
	assert.strictEqual(result["19"], "companySize", "Company Size     Cookie");
	assert.strictEqual(result["20"], "personalInvestor", "Personal Investor Cookie");
	assert.strictEqual(result["21"], "companyListings", "Company Listings Cookie");
	assert.strictEqual(result["27"], "corporateAccessIDcode", "Corporate Customers Cookie");

	this.cookies({AYSC : "_011967_02M_04greater%2520london_05ITT_06TEC_07MA_12SE19HL_13GBR_14GBR_15UK_17london_18london_190500_20n_2112_22P0P2Tools_24europe_25PVT_26PVT_273f5a2e_40forty_41fortyone_42fortytwo_43fortythree_44fortyfour_45fortyfive_46fortysix_47fortyseven_48fortyeight_49fortynine_50fifty_51fiftyone_52fiftytwo_53fiftythree_54fiftyfour_55fiftyfive_56fiftysix_57fiftyseven_58fiftyeight_59fiftynine_60sixty_"});
	result = this.ads.metadata.getAyscVars();
	assert.strictEqual(result[19], "500", "Leading Zeros have been removed");
	assert.strictEqual(result.cn, "eur", "AYSC Key 24's value should be moved into the cn key, stripping out everything after the secongd character");
	assert.strictEqual(result.slv, "lv2", "AYSC var 22 has been parsed and mapped to a subscription level");

});

QUnit.test("User not logged in", function (assert) {
	this.cookies({AYSC : "_02X_05IT_06TEC_07CP_12N85XE_13PVT_14GBR_15PVT_17PVT_18PVT_19xxxx_20x_22P0P2Tools_24PVT_25PVT_26PVT_27zentea1_402_41IT_421_432_44007_45UK_96IA_98IA_"});
	var result = this.ads.metadata.user(),
	expected = {
		eid: null,
		corporate_access_id_code: "zentea1",
		job_position: "CP",
		job_responsibility: "TEC",
		industry: "IT",
		subscription_level: "lv2",
		DB_company_size : "2",
		DB_company_turnover:"1",
		DB_country_code:"UK",
		DB_industry:"IT",
		cameo_country_code:"2",
		cameo_local_code:"007",
		loggedIn: false
	};
	assert.deepEqual(result, expected, "The correct values are returned");

	assert.ok(!result.hasOwnProperty('active_personal_investor'), 'properties with value X are not present');
	assert.ok(!result.hasOwnProperty('company_size'), 'properties with value xxxx are not present');
	assert.ok(!result.hasOwnProperty('continent'), 'properties with value PVT are not present');
	assert.ok(!result.hasOwnProperty('gender'), 'properties with value X are not present');
	assert.ok(!result.hasOwnProperty('homepage_edition'), 'properties with value undefined are not present');
});


QUnit.test("Page", function (assert) {
	this.window({siteMapTerm: "Sections.Front page", navEdition: "UK", brandName:"teststring"});

	this.ads.init({
		gpt: {
			network: '5887',
			site: 'test.site',
			zone: 'test.zone'
		}
	});

	var result = this.ads.metadata.page();
	var expected = {siteMapTerm: "Sections.Front page", navEdition: "UK", brandName:"teststring", uuid: undefined, auuid: undefined, dfpSite: 'test.site', dfpZone: 'test.zone'};
	assert.deepEqual(result, expected, "The correct values are returned");
});

QUnit.test("Page UUID & AUUID from window", function (assert) {
	this.window({pageUUID: 'some-test-uuid', articleUUID: 'some-test-auuid'});
	var result = this.ads.metadata.page();
	assert.equal(result.uuid, 'some-test-uuid', 'uuid set as a global');
	assert.equal(result.auuid, 'some-test-auuid', 'auuid set as a global');
});

QUnit.test("Page UUID & AUUID from window", function (assert) {
	this.window({ getUUIDFromString: function(){}});
	this.stub(window, 'getUUIDFromString').returns('some-legacy-uuid');

	this.ads.init({
		gpt: {
			network: '5887',
			site: 'test.site',
			zone: 'test.zone'
		}
	});
	var result = this.ads.metadata.page();
	assert.equal(result.uuid, 'some-legacy-uuid', 'uuid set as on legacy pages');
});
