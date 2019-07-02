/* globals QUnit: false, jQuery: false, $: false */

'use strict'; //eslint-disable-line

QUnit.module('utils.isType methods');

QUnit.test('Utils object exists', function(assert) {
	assert.ok($.type(this.ads.utils) === 'object', 'The name space exists');
});

QUnit.test('isArray method', function(assert) {
	assert.ok($.type(this.ads.utils.isArray) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isArray([]), 'Array returns true');
	assert.ok(!this.ads.utils.isArray(), 'Call with no args returns false');
	assert.ok(!this.ads.utils.isArray(arguments), 'Array like object returns false');
	assert.ok(!this.ads.utils.isArray({}), 'Object returns false');
	assert.ok(!this.ads.utils.isArray('hello'), 'String returns false');
	assert.ok(!this.ads.utils.isArray(/hello/), 'Regex returns false');
	assert.ok(!this.ads.utils.isArray(1e6), 'Number returns false');
	assert.ok(!this.ads.utils.isArray(null), 'Null returns false');
	assert.ok(!this.ads.utils.isArray(true), 'Boolean returns false');
	assert.ok(!this.ads.utils.isArray(undefined), 'Undefined returns false');
	assert.ok(!this.ads.utils.isArray(function() {}), 'Function returns false');
});

QUnit.test('isString method', function(assert) {
	assert.ok($.type(this.ads.utils.isString) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isString('hello'), 'String returns true');
	assert.ok(!this.ads.utils.isString(), 'Call with no args returns false');
	assert.ok(!this.ads.utils.isString([]), 'Array returns false');
	assert.ok(!this.ads.utils.isString({}), 'Object returns false');
	assert.ok(!this.ads.utils.isString(/hello/), 'Regex returns false');
	assert.ok(!this.ads.utils.isString(1e6), 'Number returns false');
	assert.ok(!this.ads.utils.isString(null), 'Null returns false');
	assert.ok(!this.ads.utils.isString(undefined), 'Undefined returns false');
	assert.ok(!this.ads.utils.isString(true), 'Boolean returns false');
	assert.ok(!this.ads.utils.isString(function() {}), 'Function returns false');
});

QUnit.test('isFunction method', function(assert) {
	assert.ok($.type(this.ads.utils.isFunction) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isFunction(function() {}), 'Function returns true');
	assert.ok(!this.ads.utils.isFunction('hello'), 'String returns false');
	assert.ok(!this.ads.utils.isFunction(), 'Call with no args returns false');
	assert.ok(!this.ads.utils.isFunction([]), 'Array returns false');
	assert.ok(!this.ads.utils.isFunction({}), 'Object returns false');
	assert.ok(!this.ads.utils.isFunction(/hello/), 'Regex returns false');
	assert.ok(!this.ads.utils.isFunction(1e6), 'Number returns false');
	assert.ok(!this.ads.utils.isFunction(null), 'Null returns false');
	assert.ok(!this.ads.utils.isFunction(undefined), 'Undefined returns false');
	assert.ok(!this.ads.utils.isFunction(true), 'Boolean returns false');
});

QUnit.test('isObject method', function(assert) {
	assert.ok($.type(this.ads.utils.isObject) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isObject({}), 'Object returns true');
	assert.ok(!this.ads.utils.isObject(function() {}), 'Function returns false');
	assert.ok(!this.ads.utils.isObject(), 'Call with no args returns false');
	assert.ok(!this.ads.utils.isObject('hello'), 'String returns false');
	assert.ok(!this.ads.utils.isObject([]), 'Array returns false');
	assert.ok(!this.ads.utils.isObject(/hello/), 'Regex returns false');
	assert.ok(!this.ads.utils.isObject(1e6), 'Number returns false');
	assert.ok(!this.ads.utils.isObject(null), 'Null returns false');
	assert.ok(!this.ads.utils.isObject(undefined), 'Undefined returns false');
	assert.ok(!this.ads.utils.isObject(true), 'Boolean returns false');
});

QUnit.test('isStorage method', function(assert) {
	assert.ok($.type(this.ads.utils.isStorage) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isStorage(window.localStorage), 'Storage');
});

QUnit.test('isWindow method', function(assert) {
	assert.ok($.type(this.ads.utils.isWindow) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isWindow(window), 'window');
	assert.ok(!this.ads.utils.isWindow(), 'empty');
	assert.ok(!this.ads.utils.isWindow(null), 'null');
	assert.ok(!this.ads.utils.isWindow(undefined), 'undefined');
	assert.ok(!this.ads.utils.isWindow(document), 'document');
	assert.ok(!this.ads.utils.isWindow(document.documentElement), 'documentElement');
	assert.ok(!this.ads.utils.isWindow(''), 'string');
	assert.ok(!this.ads.utils.isWindow(1), 'number');
	assert.ok(!this.ads.utils.isWindow(true), 'boolean');
	assert.ok(!this.ads.utils.isWindow({}), 'object');
	assert.ok(!this.ads.utils.isWindow({ setInterval: function() {} }), 'fake window');
	assert.ok(!this.ads.utils.isWindow(/window/), 'regexp');
	assert.ok(!this.ads.utils.isWindow(function() {}), 'function');
});

QUnit.test('isNonEmptyString method', function(assert) {
	assert.ok($.type(this.ads.utils.isNonEmptyString) === 'function', 'The function exists');
	assert.ok(this.ads.utils.isNonEmptyString('hello'), 'string with length');
	assert.ok(!this.ads.utils.isNonEmptyString(''), 'empty string');
	assert.ok(!this.ads.utils.isNonEmptyString(), 'empty');
	assert.ok(!this.ads.utils.isNonEmptyString(null), 'null');
	assert.ok(!this.ads.utils.isNonEmptyString(undefined), 'undefined');
	assert.ok(!this.ads.utils.isNonEmptyString(document), 'document');
	assert.ok(!this.ads.utils.isNonEmptyString(document.documentElement), 'documentElement');
	assert.ok(!this.ads.utils.isNonEmptyString(1), 'number');
	assert.ok(!this.ads.utils.isNonEmptyString(true), 'boolean');
	assert.ok(!this.ads.utils.isNonEmptyString({}), 'object');
	assert.ok(!this.ads.utils.isNonEmptyString({ setInterval: function() {} }), 'fake window');
	assert.ok(!this.ads.utils.isNonEmptyString(/window/), 'regexp');
	assert.ok(!this.ads.utils.isNonEmptyString(function() {}), 'function');
});

QUnit.test('isPlainObject method', function(assert) {
	assert.ok($.type(this.ads.utils.isPlainObject) === 'function', 'The function exists');

	// The use case that we want to match
	assert.ok(this.ads.utils.isPlainObject({}), '{}');

	// Not objects shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject(''), 'string');
	assert.ok(!this.ads.utils.isPlainObject(0) && !this.ads.utils.isPlainObject(1), 'number');
	assert.ok(!this.ads.utils.isPlainObject(true) && !this.ads.utils.isPlainObject(false), 'boolean');
	assert.ok(!this.ads.utils.isPlainObject(null), 'null');
	assert.ok(!this.ads.utils.isPlainObject(undefined), 'undefined');

	// Arrays shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject([]), 'array');

	// Instantiated objects shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject(new Date()), 'new Date');

	const fnplain = function() {};

	// Functions shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject(fnplain), 'fn');

	/** @constructor */
	const Fn = function() {};

	// Again, instantiated objects shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject(new Fn()), 'new fn (no methods)');

	// Makes the function a little more realistic
	Fn.prototype.someMethod = function() {};

	// Again, instantiated objects shouldn't be matched
	assert.ok(!this.ads.utils.isPlainObject(new Fn()), 'new fn');

	// DOM Element
	assert.ok(!this.ads.utils.isPlainObject(document.createElement('div')), 'DOM Element');

	// Window
	assert.ok(!this.ads.utils.isPlainObject(window), 'window');

	try {
		this.ads.utils.isPlainObject(window.location);
		assert.ok(true, 'Does not throw exceptions on host objects');
	} catch (e) {
		assert.ok(false, 'Does not throw exceptions on host objects -- FAIL');
	}
});

QUnit.module('utils.extend');
QUnit.test('extend method', function(assert) {

	let settings = { 'xnumber1': 5, 'xnumber2': 7, 'xstring1': 'peter', 'xstring2': 'pan' };
	const options = { 'xnumber2': 1, 'xstring2': 'x', 'xxx': 'newstring' };
	const optionsCopy = { 'xnumber2': 1, 'xstring2': 'x', 'xxx': 'newstring' };
	const merged = { 'xnumber1': 5, 'xnumber2': 1, 'xstring1': 'peter', 'xstring2': 'x', 'xxx': 'newstring' };
	const deep1 = { 'foo': { 'bar': true } };
	const deep2 = { 'foo': { 'baz': true }};
	const deep2copy = { 'foo': { 'baz': true }};
	const deepmerged = { 'foo': { 'bar': true, 'baz': true }};
	const arr = [1, 2, 3];
	const nestedarray = { 'arr': arr };

	this.ads.utils.extend(settings, options);
	assert.deepEqual(settings, merged, 'Check if extended: settings must be extended');
	assert.deepEqual(options, optionsCopy, 'Check if not modified: options must not be modified');

	this.ads.utils.extend(settings, null, options);
	assert.deepEqual(settings, merged, 'Check if extended: settings must be extended');
	assert.deepEqual(options, optionsCopy, 'Check if not modified: options must not be modified');

	this.ads.utils.extend(true, deep1, deep2);
	assert.deepEqual(deep1.foo, deepmerged.foo, 'Check if foo: settings must be extended');
	assert.deepEqual(deep2.foo, deep2copy.foo, 'Check if not deep2: options must not be modified');
	assert.ok(this.ads.utils.extend(true, {}, nestedarray).arr !== arr, 'Deep extend of object must clone child array');

	assert.ok(jQuery.isArray(this.ads.utils.extend(true, { 'arr': {} }, nestedarray).arr), 'Cloned array have to be an Array');
	assert.ok(jQuery.isPlainObject(this.ads.utils.extend(true, { 'arr': arr }, { 'arr': {} }).arr), 'Cloned object have to be an plain object');

	let empty = {};
	const optionsWithLength = { 'foo': { 'length': -1 } };
	this.ads.utils.extend(true, empty, optionsWithLength);
	assert.deepEqual(empty.foo, optionsWithLength.foo, 'The length property must copy correctly');

	empty = {};
	const optionsWithDate = { 'foo': { 'date': new Date() } };
	this.ads.utils.extend(true, empty, optionsWithDate);
	assert.deepEqual(empty.foo, optionsWithDate.foo, 'Dates copy correctly');

	/** @constructor */
	const MyKlass = function() {};
	const customObject = new MyKlass();
	const optionsWithCustomObject = { foo: { date: customObject } };
	empty = {};
	this.ads.utils.extend(true, empty, optionsWithCustomObject);
	assert.ok(empty.foo && empty.foo.date === customObject, 'Custom objects copy correctly (no methods)');

	// Makes the class a little more realistic
	MyKlass.prototype = { 'someMethod': function() {} };
	empty = {};
	this.ads.utils.extend(true, empty, optionsWithCustomObject);
	assert.ok(empty.foo && empty.foo.date === customObject, 'Custom objects copy correctly');

	const MyNumber = Number;
	let ret = this.ads.utils.extend(true, { 'foo': 4 }, { 'foo': new MyNumber(5) });
	assert.ok(parseInt(ret.foo, 10) === 5, 'Wrapped numbers copy correctly');

	let nullUndef;
	nullUndef = this.ads.utils.extend({}, options, { 'xnumber2': null });
	assert.ok(nullUndef.xnumber2 === null, 'Check to make sure null values are copied');

	nullUndef = this.ads.utils.extend({}, options, { 'xnumber2': undefined });
	assert.ok(nullUndef.xnumber2 === options.xnumber2, 'Check to make sure undefined values are not copied');

	nullUndef = this.ads.utils.extend({}, options, { 'xnumber0': null });
	assert.ok(nullUndef.xnumber0 === null, 'Check to make sure null values are inserted');

	const target = {};
	const recursive = { foo:target, bar:5 };
	this.ads.utils.extend(true, target, recursive);
	assert.deepEqual(target, { bar:5 }, 'Check to make sure a recursive obj doesn\'t go never-ending loop by not copying it over');

	ret = this.ads.utils.extend(true, { foo: [] }, { foo: [0] }); // 1907
	assert.equal(ret.foo.length, 1, 'Check to make sure a value with coersion "false" copies over when necessary to fix #1907');

	ret = this.ads.utils.extend(true, { foo: '1,2,3' }, { foo: [1, 2, 3] });
	assert.ok(typeof ret.foo !== 'string', 'Check to make sure values equal with coersion (but not actually equal) overwrite correctly');

	ret = this.ads.utils.extend(true, { foo:'bar' }, { foo:null });
	assert.ok(typeof ret.foo !== 'undefined', 'Make sure a null value doesn\'t crash with deep extend, for #1908');

	const obj = { foo:null };
	this.ads.utils.extend(true, obj, { foo:'notnull' });
	assert.equal(obj.foo, 'notnull', 'Make sure a null value can be overwritten');

	function func() {}

	this.ads.utils.extend(func, { key: 'value' });
	assert.equal(func.key, 'value', 'Verify a function can be extended');

	const defaults = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
	const defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: 'peter', xstring2: 'pan' };
	const options1 = { xnumber2: 1, xstring2: 'x' };
	const options1Copy = { xnumber2: 1, xstring2: 'x' };
	const options2 = { xstring2: 'xx', xxx: 'newstringx' };
	const options2Copy = { xstring2: 'xx', xxx: 'newstringx' };
	const merged2 = { xnumber1: 5, xnumber2: 1, xstring1: 'peter', xstring2: 'xx', xxx: 'newstringx' };

	settings = this.ads.utils.extend({}, defaults, options1, options2);
	assert.deepEqual(settings, merged2, 'Check if extended: settings must be extended');
	assert.deepEqual(defaults, defaultsCopy, 'Check if not modified: options1 must not be modified');
	assert.deepEqual(options1, options1Copy, 'Check if not modified: options1 must not be modified');
	assert.deepEqual(options2, options2Copy, 'Check if not modified: options2 must not be modified');

	assert.deepEqual(this.ads.utils.extend(), {}, 'passing nothing returns empty object');
	assert.deepEqual(this.ads.utils.extend(true), {}, 'passing a single boolen returns empty object');
	assert.deepEqual(this.ads.utils.extend('test'), {}, 'passing a string returns empty object');
});

QUnit.module('utils miscellanious methods');

QUnit.test('hash method', function(assert) {
	let result;
	const test = 'a:1,b:2,c:3,a:12';
	result = this.ads.utils.hash(test, ',', ':');

	assert.ok(this.ads.utils.isObject(result), 'the result is an object');
	assert.deepEqual(result.b, '2', 'Key b properly hashed (as string data)');
	assert.deepEqual(result.c, '3', 'Key c properly hashed');
	assert.deepEqual(result.a, '12', 'Duplicate keys properly hashed');

	result = this.ads.utils.hash([], ',', ':');
	assert.ok(this.ads.utils.isObject(result), 'Attempting to hash a invlid type returns an object.');
	if (Object.keys) {
		assert.equal(Object.keys(result).length, 0, 'the object is empty.');
	} else {
		assert.ok(true);
	}
});

QUnit.test('attach method success', function(assert) {
	const done = assert.async();
	this.ads.utils.attach.restore();

	// initial number of scripts
	const initialScripts = $('script').size();
	const successCallback = this.stub();
	const errorCallback = this.stub();

	const tag = this.ads.utils.attach(this.nullUrl, true, successCallback, errorCallback);

	this.trigger(tag, 'onload');
	setTimeout(function() {
		assert.equal($('script').size() - initialScripts, 1, 'a new script tag has been added to the page.');
		assert.equal($('script[o-ads]').size(), 1, 'the script tag has an o-ads attribute');
		assert.ok(successCallback.calledOnce, 'a success callback has been triggered');
		assert.notOk(errorCallback.called, 'an error callback has not been triggered');
		done();
	}, 200);
});

QUnit.test('attach method supports auto removing script', function(assert) {
	const done = assert.async();
	this.ads.utils.attach.restore();

	// initial number of scripts
	const initialScripts = $('script').size();
	const successCallback = this.stub();
	const errorCallback = this.stub();

	const tag = this.ads.utils.attach(this.nullUrl, true, successCallback, errorCallback, true);

	this.trigger(tag, 'onload');
	setTimeout(function() {
		assert.equal($('script').size(), initialScripts, 'no new script tags have been added to tha page.');
		assert.equal($('script[o-ads]').size(), 0, 'there are no script tags that have an o-ads attribute');
		done();
	}, 200);
});

QUnit.test('attach method failed', function(assert) {
	const done = assert.async();
	this.ads.utils.attach.restore();

	// initial number of scripts
	const initialScripts = $('script').size();
	const successCallback = this.stub();
	const errorCallback = this.stub();

	const tag = this.ads.utils.attach('test.js', true, successCallback, errorCallback);

	this.trigger(tag, 'onload');
	setTimeout(function() {
		assert.equal($('script').size() - initialScripts, 1, 'a new script tag has been added to the page.');
		assert.equal($('script[o-ads]').size(), 1, 'the script tag has an o-ads attribute');

		assert.ok(errorCallback.calledOnce, 'an error callback has been triggered');
		assert.notOk(successCallback.called, 'a success callback has not been triggered');
		done();
	}, 200);
});

QUnit.test('attach method failedi with only an error callback specified', function(assert) {
	const done = assert.async();
	this.ads.utils.attach.restore();

	// initial number of scripts
	const initialScripts = $('script').size();
	const successCallback = this.stub();
	const errorCallback = this.stub();

	const tag = this.ads.utils.attach('test.js', true, null, errorCallback);

	this.trigger(tag, 'onload');
	setTimeout(function() {
		assert.equal($('script').size() - initialScripts, 1, 'a new script tag has been added to the page.');
		assert.equal($('script[o-ads]').size(), 1, 'the script tag has an o-ads attribute');

		assert.ok(errorCallback.calledOnce, 'an error callback has been triggered');
		assert.notOk(successCallback.called, 'a success callback has not been triggered');
		done();
	}, 200);
});

QUnit.test('fail nicely when cannot find a name of the ad from an iframe', function(assert) {
	const frameContentWindow = this.createDummyFrame('test').window;
	const result = this.utils.iframeToSlotName(frameContentWindow);
	assert.notOk(result, 'return false when no data-o-ads-name found on any of the parent nodes');
});

QUnit.test('find a name of the ad from an iframe', function(assert) {
	const node = this.fixturesContainer.add('<div data-o-ads-name="iframe-advert-test"></div>');
	const frameContentWindow = this.createDummyFrame('test', node).window;
	const result = this.utils.iframeToSlotName(frameContentWindow);
	assert.equal(result, 'iframe-advert-test', 'return value of first data-o-ads-name found on any of the parent nodes');
});

QUnit.test("builds an object from array", function(assert) {
	const array = [{
		"name": "subscription",
		"key": "slv",
		"value": "int"
	}, {
		"name": "loggedInStatus",
		"key": "loggedIn",
		"value": true
	}];
	assert.deepEqual(this.ads.utils.buildObjectFromArray(array), { "slv": "int", "loggedIn": true }, 'converts array to object');
});

QUnit.test("getQueryParamByName", function(assert) {
	assert.equal(this.ads.utils.getQueryParamByName('socialflow', 'http://test.com?socialflow=hey'), 'hey');
	assert.equal(this.ads.utils.getQueryParamByName('socialflow', 'http://test.com?param=shoe&socialflow=hey'), 'hey');
	assert.equal(this.ads.utils.getQueryParamByName('socialflow', 'http://test.com?socialflow=hey+there'), 'hey there');
	assert.equal(this.ads.utils.getQueryParamByName('socialflow', 'http://test.com'), null);
	assert.equal(this.ads.utils.getQueryParamByName('socialflow', 'http://test.com?socialflow='), '');
});

QUnit.test("getVersion returns the version number", function(assert) {
	assert.equal(typeof this.ads.utils.getVersion(), 'string');
});

QUnit.test("inSample returns true if called with undefined", function(assert) {
	assert.ok(this.ads.utils.inSample());
});

QUnit.test("inSample returns the same result when called multiple times with the same sample Size", function(assert) {
	const sampleSize = 0.5;
	const firstResult = this.ads.utils.inSample(sampleSize);
	for (let i = 0; i < 10; i++) {
		assert.equal(this.ads.utils.inSample(sampleSize), firstResult);
	}
});

QUnit.test("buildPerfmarkSuffix returns an empty string if the argument is not an object with a 'pos' and 'name' property", function(assert) {
	assert.equal(this.ads.utils.buildPerfmarkSuffix(), '');
	assert.equal(this.ads.utils.buildPerfmarkSuffix({a: 'b'}), '');
	assert.equal(this.ads.utils.buildPerfmarkSuffix({pos: 'pos'}), '');
	assert.equal(this.ads.utils.buildPerfmarkSuffix({name: 'name'}), '');
	assert.equal(this.ads.utils.buildPerfmarkSuffix('something'), '');
});

QUnit.test("buildPerfmarkSuffix returns a suffix containing pos, name, size and creativeId", function(assert) {
	const eventDetails = {
		pos: 'pos',
		name: 'name',
		size: '300x250',
		creativeId: '12312301283'
	};
	assert.equal(this.ads.utils.buildPerfmarkSuffix(eventDetails), '__pos__name__300x250__12312301283');

	const incompleteEvDetails = {
		pos: 'pos',
		name: 'name'
	};
	assert.equal(this.ads.utils.buildPerfmarkSuffix(incompleteEvDetails), '__pos__name____');
});
