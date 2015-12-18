/* jshint globalstrict: true */
/* globals QUnit: false, $: false */
"use strict";

QUnit.module('utils.cookie', {
	beforeEach: function() {
		this.ads.utils.cookies = {};
		this.ads.utils.cookie.defaults = {};
		delete this.ads.utils.cookie.raw;
		delete this.ads.utils.cookie.json;
	}
});

QUnit.test('read simple value', function(assert) {
	this.ads.utils.cookie('c', 'v');
	assert.equal(this.ads.utils.cookie('c'), 'v', 'should return value');
});

QUnit.test('read empty value', function(assert) {
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	this.ads.utils.cookie('c', '');
	assert.equal(this.ads.utils.cookie('c'), '', 'should return value');
});

QUnit.test('read not existing', function(assert) {
	assert.equal(this.ads.utils.cookie('whatever'), null, 'should return null');
});

QUnit.test('read decode', function(assert) {
	this.ads.utils.cookie('c', ' v');
	assert.equal(this.ads.utils.cookie('c'), ' v', 'should decode key and value');
});

QUnit.test('read decodes pluses to space for server side written cookie', function(assert) {
	this.ads.utils.cookie('c', 'foo bar');
	assert.equal(this.ads.utils.cookie('c'), 'foo bar', 'should convert pluses back to space');
});

QUnit.test('read [] used in name', function(assert) {
	this.ads.utils.cookie('c[999]', 'foo');
	assert.equal(this.ads.utils.cookie('c[999]'), 'foo', 'should return value');
});

QUnit.test('read raw: true', function(assert) {
	this.ads.utils.cookie.raw = true;

	this.ads.utils.cookie('c', '%20v');
	assert.equal(this.ads.utils.cookie('c'), '%20v', 'should not decode value');

	// see https://github.com/carhartl/jquery-cookie/issues/50
	this.ads.utils.cookie('c', 'foo=bar');
	assert.equal(this.ads.utils.cookie('c'), 'foo=bar', 'should include the entire value');
});

QUnit.test('read json: true', function(assert) {
	this.ads.utils.cookie.json = true;

	if ('JSON' in window) {
		this.ads.utils.cookie('c', { foo: 'bar' });
		assert.deepEqual(this.ads.utils.cookie('c'), { foo: 'bar'}, 'should parse JSON');
	} else {
		assert.ok(true);
	}
});

QUnit.test('write String primitive', function(assert) {
	this.ads.utils.cookie('c', 'v');
	assert.equal(this.ads.utils.cookie('c'), 'v', 'should write value');
});

QUnit.test('write String object', function(assert) {
	/* jshint -W053 */

	// using the string constructor is a silly thing to do, we use it to make sure if someone else is silly enough to try this our code will work
	this.ads.utils.cookie('c', new String(2));
	/* jshint +W053 */
	assert.equal(this.ads.utils.cookie('c'), '2', 'should write value');
});

QUnit.test('write value "[object Object]"', function(assert) {
	this.ads.utils.cookie('c', '[object Object]');
	assert.equal(this.ads.utils.cookie('c'), '[object Object]', 'should write value');
});

QUnit.test('write number', function(assert) {
	this.ads.utils.cookie('c', 1234);
	assert.equal(this.ads.utils.cookie('c'), '1234', 'should write value');
});

QUnit.test('write expires option as days from now', function(assert) {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	assert.equal(this.ads.utils.cookie('c', 'v', { expires: 7 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

QUnit.test('write expires option as Date instance', function(assert) {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	assert.equal(this.ads.utils.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

QUnit.test('write invalid expires option (in the past)', function(assert) {
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	this.ads.utils.cookie('e', 'v', { expires: yesterday });
	assert.equal(this.ads.utils.cookie('e'), null, 'should not save already expired cookie');
});

QUnit.test('write return value', function(assert) {
	assert.equal(this.ads.utils.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

QUnit.test('write domain option', function(assert) {
	assert.equal(this.ads.utils.cookie('test', 'val', { domain: 'localhost' }), 'test=val; domain=localhost', 'should write the cookie string with domain');
});

QUnit.test('write secure option', function(assert) {
	assert.equal(this.ads.utils.cookie('secureCookie', 'v', { secure: true }), 'secureCookie=v; secure', 'should write the cookie string with secure');
});

QUnit.test('write defaults', function(assert) {
	this.ads.utils.cookie.defaults.path = '/';
	assert.ok(this.ads.utils.cookie('d', 'v').match(/path=\//), 'should use options from defaults');
	assert.ok(this.ads.utils.cookie('d', 'v', { path: '/foo' }).match(/path=\/foo/), 'options argument has precedence');
});

QUnit.test('write raw: true', function(assert) {
	this.ads.utils.cookie.raw = true;
	assert.equal(this.ads.utils.cookie('c', ' v').split('=')[1], ' v', 'should not encode');
});

QUnit.test('write json: true', function(assert) {
	this.ads.utils.cookie.json = true;
	if (!!window.JSON) {
		var cookieValue = 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' }));
		this.ads.utils.cookie('c', { foo: 'bar' });
		assert.ok(document.cookie.indexOf(cookieValue) > -1, 'should stringify JSON');
	} else {
		assert.ok(true);
	}
});

QUnit.test('removeCookie delete', function(assert) {
	this.ads.utils.cookie('c', 'v');
	this.ads.utils.removeCookie('c');

	assert.equal(this.ads.utils.cookie('c'), null, 'should delete the cookie');
});

QUnit.test('removeCookie return', function(assert) {
	assert.equal(this.ads.utils.removeCookie('c'), false, "should return false if a cookie wasn't found");

	this.ads.utils.cookie('c', 'v');
	assert.equal(this.ads.utils.removeCookie('c'), true, 'should return true if the cookie was found');
});

QUnit.test('getCookieParam non-existent cookie', function(assert) {
	assert.equal($.type(this.ads.utils.getCookieParam("FT_U", "999")), "undefined");
	assert.equal($.type(this.ads.utils.getCookieParam("FT_Remember", "EMAIL")), "undefined");
	assert.equal($.type(this.ads.utils.getCookieParam("FT_User", "EMAIL")), "undefined");
	assert.equal($.type(this.ads.utils.getCookieParam("AYSC", "999")), "undefined");
	assert.equal($.type(this.ads.utils.getCookieParam("FTQA", "fish")), "undefined");
});

QUnit.test('getCookieParam non-existent param', function(assert) {
	this.ads.utils.cookie.raw = true;
	this.ads.utils.cookie('FT_U', '_EID=75203762_PID=4075203762_TIME=%5BTue%2C+14-Feb-2012+11%3A14%3A43+GMT%5D_SKEY=PVedi41jJoMsqbaU%2B4BlyQ%3D%3D_RI=1_I=1_');
	assert.equal($.type(this.ads.utils.getCookieParam("FT_U", "999")), "undefined");
	assert.equal(this.ads.utils.getCookieParam("FT_U", "EID"), "75203762");

	this.ads.utils.cookie('FT_Remember', '3485306:TK5440152026926272944:FNAME=:LNAME=:');
	assert.equal($.type(this.ads.utils.getCookieParam("FT_Remember", "EMAIL")), "undefined");

	this.ads.utils.cookie('FT_User', 'USERID=4001448514:FNAME=Nick:LNAME=Hayes:TIME=[Sat, 06-Jun-2009 09:59:20 GMT]:USERNAME=conchango1:REMEMBER=_REMEMBER_:');
	assert.equal($.type(this.ads.utils.getCookieParam("FT_User", "EMAIL")), "undefined");

	this.ads.utils.cookie('AYSC', '_04greater%2Blondon_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
	assert.equal($.type(this.ads.utils.getCookieParam("AYSC", "999")), "undefined");

	this.ads.utils.cookie('FTQA', 'debug=true,env=live,breakout=banlb');
	assert.equal($.type(this.ads.utils.getCookieParam("FTQA", "fish")), "undefined");

	this.ads.utils.cookie('TEST', 'debug=true,env=live,breakout=banlb');
	assert.equal(this.ads.utils.getCookieParam("TEST", "env"), "debug=true,env=live,breakout=banlb", 'return full value of cookie');
});

QUnit.test("getCookieParam existent param", function(assert) {
	this.ads.utils.cookie.raw = true;
	this.ads.utils.cookie('FT_Remember', '3485306:TK5440152026926272944:FNAME=:LNAME=:EMAIL=dan.searle@ft.com');
	assert.equal(this.ads.utils.getCookieParam("FT_Remember", "EMAIL"), "dan.searle@ft.com");

	this.ads.utils.cookie('FT_User', 'USERID=4001448514:EMAIL=nick.hayes@ft.com:FNAME=Nick:LNAME=Hayes:TIME=[Sat, 06-Jun-2009 09:59:20 GMT]:USERNAME=conchango1:REMEMBER=_REMEMBER_:');
	assert.equal(this.ads.utils.getCookieParam("FT_User", "EMAIL"), "nick.hayes@ft.com");

	this.ads.utils.cookie('AYSC', '_04greater%2Blondon_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
	assert.equal(decodeURIComponent(this.ads.utils.getCookieParam("AYSC", "04")), "greater+london");

	this.ads.utils.cookie('AYSC', '_04_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
	assert.equal(this.ads.utils.getCookieParam("AYSC", "04"), "");

	this.ads.utils.cookie('AYSC', '_0490_13GBR_14GBR_15gb_17london_18islington_24europe_25PVT_26PVT_27PVT_96PVT_98PVT_');
	assert.equal(this.ads.utils.getCookieParam("AYSC", "04"), "90");

	this.ads.utils.cookie('FTQA', 'debug=true,env=live,breakout=banlb');
	assert.equal(this.ads.utils.getCookieParam("FTQA", "debug"), "true");
});
