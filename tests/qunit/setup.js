/* global QUnit: false, require: false */

'use strict'; //eslint-disable-line
global.QUnit = {};
global.QUnit.config = {};
QUnit.config.urlConfig = []
QUnit.config.urlConfig.push({
	id: 'DEBUG',
	value: 'OADS',
	label: 'Debug Mode',
	tooltip: 'Show debug log messages'
});
global.assert = require('proclaim');

// change the karma debug page title to something more fitting
document.querySelector('title').innerHTML = 'o-ads unit tests';


// Show the qunit ui only when viewing the karma debug page
if (window.top === window) {
	document.body.insertAdjacentHTML('afterbegin', '<div id="qunit"></div>');
}

// div for attaching HTML fixtures, will be emptied after each test
document.body.insertAdjacentHTML('afterbegin', '<div id="qunit-fixtures"></div>');

// Because Ads is a singleton using require('main.js') in each
// test will always return the same instance of the object, using the
// constructor gives each test access to a unique instance
// this is added to the test context via the module decorator
const Ads = require('../../main.js').constructor;
const utils = require('../../src/js/utils');
const helpers = require('./helpers.js');

// Curry helper methods
function addHelpers(obj) {
	for (const key in helpers) {
		if (helpers.hasOwnProperty(key)) {
			obj[key] = helpers[key];
		}
	}
}


beforeEach(function () {
	this.timeout(5000);
	let mod;
	this.adsConstructor = Ads;
	this.ads = new Ads();
	this.utils = utils;
	window.scroll(0, 0);

	// we also have to clone all submodules that are constructors
	for (mod in Ads.prototype) {
		if (new RegExp(mod, 'i').test(Ads.prototype[mod].constructor.toString())) {
			Ads.prototype[mod] = new Ads.prototype[mod].constructor();
		}
	}

	addHelpers(this);

	// stub out the attach method to prevent external files being loaded
	this.attach = this.stub(utils, 'attach', function (url, async, fn) {
		if (typeof fn === 'function') {
			fn();
		}
	});
});
afterEach(function() {
	window.scroll(0, 0);


	this.attach.restore();
	// reset sinon sandbox and remove elements added to dom
	this.clear();
	this.ads.targeting.clear();

	//this.ads.config.clear();
	// explicitly delete the ads object used in the test so it is GCed
	delete this.ads;
});