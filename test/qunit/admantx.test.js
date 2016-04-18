/* jshint globalstrict: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Admantx', {
	beforeEach: function() {
		this.server = this.server();
		this.server.autoRespond = true;
	}
});

QUnit.test('process categories objects', function(assert) {
	const given = [
		{ "name": "US", "origin": "NORMAL", "score": 12, "type": "MAINLEMMAS" },
		{ "name": "Boris Johnson", "origin": "NORMAL", "score": 10, "type": "PEOPLE" },
		{ "name": "London", "origin": "NORMAL", "score": 8, "type": "PLACES" },
		{ "name": "United States of America", "origin": "NORMAL", "score": 7, "type": "PLACES" },
		{ "name": "tax bill", "origin": "NORMAL", "score": 6,  "type": "MAINLEMMAS"}
	];
	let returns = ["US", "Boris Johnson", "London", "United States of America", "tax bill"];
	assert.deepEqual(this.ads.admantx.processCollection(given), returns, 'Given a set from Admantx and no max argument returns all name nodes');
	assert.deepEqual(this.ads.admantx.processCollection(given, true), returns, 'Given a set from Admantx and a boolean max argument returns all name nodes');

	returns = ["US", "Boris Johnson", "London"];
	assert.deepEqual(this.ads.admantx.processCollection(given, 3), returns, 'Given a set from Admantx and a numerical max argument returns the correct number of name nodes');
});

QUnit.test('process categories strings', function(assert) {
	const given = [
		"US",
		"Boris Johnson",
		"London",
		"United States of America",
		"tax bill"
	];
	let returns = ["US", "Boris Johnson", "London", "United States of America", "tax bill"];
	assert.deepEqual(this.ads.admantx.processCollection(given), returns, 'Given a set from Admantx and no max argument returns all name nodes');
	assert.deepEqual(this.ads.admantx.processCollection(given, true), returns, 'Given a set from Admantx and a boolean max argument returns all name nodes');

	returns = ["US", "Boris Johnson", "London"];
	assert.deepEqual(this.ads.admantx.processCollection(given, 3), returns, 'Given a set from Admantx and a numerical max argument returns the correct number of name nodes');
});

QUnit.test('admantx configured to make request and add targeting', function(assert) {
	const done = assert.async();
	const given = JSON.stringify(this.fixtures.admantx);
	this.server.respondWith("GET", {test: function(reqUrl) {
		return (new RegExp('usasync01.admantx.com/admantx/service')).test(reqUrl);
	}}, [200, { "Content-Type": "application/json" }, given]);

	this.ads.init({
		admantx: {
			id: 'someAdmantxID',
			collections: {
				admants: 3
			}
		}
	});

	const targeting = this.ads.targeting;
	const admants = ["Professional Education", "appreciation_income", "car_lifestyle"];
	setTimeout(function() {
		const result = targeting.get();
		assert.deepEqual(result.ad, admants, 'the admants are added as targeting');
		done();
	}, 20);
});


QUnit.test('admantx collections default to true', function(assert) {
	const done = assert.async();
	const given = JSON.stringify(this.fixtures.admantx);
	this.server.respondWith("GET", {test: function(reqUrl) {
		return (new RegExp('usasync01.admantx.com/admantx/service')).test(reqUrl);
	}}, [200, { "Content-Type": "application/json" }, given]);

	this.ads.init({
		admantx: {
			id: 'someAdmantxID'
		}
	});

	const targeting = this.ads.targeting;

	const admants = ["Professional Education", "appreciation_income", "car_lifestyle", "joy_saving", "mercedes_fashion", "safe_choices", "share_promise"];
	setTimeout(function() {
		const result = targeting.get();
		assert.deepEqual(result.ad, admants, 'all admants are added as targeting');
		done();
	}, 20);
});

QUnit.test('debug returns early if no config is set', function(assert) {
	const start = this.spy(this.utils.log, 'start');

	this.ads.admantx.debug();
	assert.notOk(start.called, "`utils.start` wasn't called for 'Admantx'");
});

QUnit.test('debug starts logging Admantx data', function(assert) {
	const start = this.spy(this.utils.log, 'start');
	this.ads.init({admantx: {}});

	this.ads.admantx.debug();
	assert.ok(start.calledWith('Admantx'), "`utils.start` was called for 'Admantx'");
	assert.notOk(start.calledWith('Collections'), "`utils.start` wasn't called for 'Collections'");
	assert.notOk(start.calledWith('Response'), "`utils.start` wasn't called for 'Response'");
});

QUnit.test('debug logs collections data if it is set', function(assert) {
	const start = this.spy(this.utils.log, 'start');
	this.ads.init({admantx: {collections: {}}});

	this.ads.admantx.debug();
	assert.ok(start.calledWith('Admantx'), "`utils.start` was called for 'Admantx'");
	assert.ok(start.calledWith('Collections'), "`utils.start` was called for 'Collections'");
	assert.notOk(start.calledWith('Response'), "`utils.start` wasn't called for 'Response'");
});

QUnit.test("debug doesn't log response data if none is received", function(assert) {
	const start = this.spy(this.utils.log, 'start');
	this.ads.init({admantx: {collections: {}}});

	this.ads.admantx.debug();
	assert.notOk(start.calledWith('Response'), "`utils.start` was called for 'Admantx'");
	assert.notOk(start.calledWith('Admants'), "`utils.start` was called for 'Collections'");
	assert.notOk(start.calledWith('Categories'), "`utils.start` was called for 'Response'");
});

QUnit.test('debug logs Admantx response', function(assert) {
	const start = this.spy(this.utils.log, 'start');
	this.ads.init({admantx: {collections: {}}});

	this.ads.admantx.xhr = {
		response: {
			admants: {},
			categories: {}
		}
	};

	this.ads.admantx.debug();
	assert.ok(start.calledWith('Response'), "`utils.start` was called for 'Response'");
	assert.ok(start.calledWith('Admants'), "`utils.start` was called for 'Admants'");
	assert.ok(start.calledWith('Categories'), "`utils.start` was called for 'Categories'");
});
