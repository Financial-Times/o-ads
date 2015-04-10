/* jshint globalstrict: true, browser: true */
/* globals QUnit: false, $: false */
"use strict";

QUnit.module('config');

QUnit.test('Config get/set', function (assert) {
	this.ads.config.init();
	this.ads.config.clear();
	var result, obj,
		key = 'key',
		invalid = 'invalid',
		value = 'value',
		value2 = 'value2';

	assert.ok($.isFunction(this.ads.config), 'The set method exists');

	result = this.ads.config(key, value);
	assert.deepEqual(result, value, 'passing a key+value returns the value.');

	result = this.ads.config();
	obj = {};
	obj[key] = value;
	assert.deepEqual(result, obj, 'calling without params returns all config.');

	result = this.ads.config(key);
	assert.deepEqual(result, value, 'passing a valid key returns the value.');

	result = this.ads.config(invalid);
	assert.deepEqual(result, undefined, 'passing an invalid key returns undefined.');

	result = this.ads.config(key, value2);
	assert.deepEqual(result, value2, 'set an existing key returns the new value.');

	result = this.ads.config(key);
	assert.deepEqual(result, value2, 'get returns the new value.');
});

QUnit.test('Config get/set - mulitple', function (assert) {
	this.ads.config.init(true);
	this.ads.config.clear();
	var obj = {
		'some': 'config',
		'parameters': 'to',
		'be': 'added'
	};

	var result = this.ads.config(obj);
	assert.deepEqual(result, obj, 'set multiple key/values using an object.');

	result = this.ads.config();
	assert.deepEqual(result, obj, 'get returns the new values.');
});

QUnit.test('Config fetchMetaConfig', function (assert) {
	this.meta({
		metaconf1: 'I&#39;m so meta, even this acronym.'
	});
	this.ads.config.init(true);
	var result = this.ads.config();

	assert.ok(result.hasOwnProperty('metaconf1'), 'Meta value has been added to config');
	assert.equal(this.ads.config('metaconf1'), 'I\'m so meta, even this acronym.', 'Config returns the correct value');
});

QUnit.test('Config fetchMetaConfigJSON', function (assert) {
	if (window.JSON) {
		this.meta({
			metaconfjson1: {
				content: '{"testing":"blah"}',
				"data-contenttype": 'json'
			}
		});

		this.ads.init();
		var result = this.ads.config();

		assert.ok(result.hasOwnProperty('metaconfjson1'), 'Meta value has been added to config');
		assert.equal(this.ads.config('metaconfjson1').testing, 'blah', 'Config returns the correct value');
	} else {
		assert.ok(true, "JSON is not defined -- FAIL");
	}
});

QUnit.test('Config defaults', function (assert) {
	this.ads.init();
	var result =  this.ads.config();
	assert.ok(result.hasOwnProperty('network'), 'default properties have been added to config');
	assert.equal(this.ads.config('network'), '5887', 'Config returns the correct value');
});

QUnit.test('Config fetchDeclaritive', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"dfpsite" : "site.site","dfpzone" : "zone.zone"}</script>');
	this.ads.init();
	var result = this.ads.config();
	assert.ok(result.dfpzone, 'Config has been fetched from the inline declarative script');
});


QUnit.test('Config fetchDeclaritive, multiple script tags', function (assert) {
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"athing" : "thing", "anotherthing" : "another"}</script>');
	this.fixturesContainer.insertAdjacentHTML('beforeend', '<script data-o-ads-config type="application/json">{"more" : "evenmore"}</script>');
	this.ads.init();
	var result = this.ads.config();
	assert.equal(result.athing, 'thing', 'data-o-ads-size attribute');
	assert.equal(result.more, 'evenmore', 'data-o-ads-size attribute');
});
