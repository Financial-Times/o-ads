/* jshint globalstrict: true, browser: true */
/* globals QUnit: false */
"use strict";

QUnit.module('Metadata');



QUnit.test("Page method warns it has been deprecated", function(assert) {
	const warn = this.spy(this.utils.log, 'warn');
	const result = this.ads.metadata.page();
	assert.deepEqual(result, {}, "An empty object is returned");
	assert.ok(warn.calledWith('The metadata page method has been deprecated and will not available in future major versions of o-ads.'), 'The warning is logged');
});

QUnit.test("User method warns it has been deprecated", function(assert) {
	const warn = this.spy(this.utils.log, 'warn');
	const result = this.ads.metadata.user();
	assert.deepEqual(result, {}, "An empty object is returned");
	assert.ok(warn.calledWith('The metadata user method has been deprecated and will not available in future major versions of o-ads.'), 'The warning is logged');
});

QUnit.test("getLoginInfo method warns it has been deprecated", function(assert) {
	const warn = this.spy(this.utils.log, 'warn');
	const result = this.ads.metadata.getLoginInfo();
	assert.deepEqual(result, {}, "An empty object is returned");
	assert.ok(warn.calledWith('The metadata getLoginInfo method will be deprecated and will not available in future major versions of o-ads.'), 'The warning is logged');
});

QUnit.test("const method warns it has been deprecated", function(assert) {
	const warn = this.spy(this.utils.log, 'warn');
	const result = this.ads.metadata.getAyscVars();
	assert.deepEqual(result, {}, "An empty object is returned");
	assert.ok(warn.calledWith('The metadata getAsycVars method will be deprecated and will not available in future major versions of o-ads.'), 'The warning is logged');
});

QUnit.test("getPageType method warns it has been deprecated", function(assert) {
	const warn = this.spy(this.utils.log, 'warn');
	const result = this.ads.metadata.getPageType();
	assert.deepEqual(result, {}, "An empty object is returned");
	assert.ok(warn.calledWith('The metadata getPageType method will be deprecated and will not available in future major versions of o-ads.'), 'The warning is logged');
});
