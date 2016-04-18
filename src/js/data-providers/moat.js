'use strict';
var utils = require('../utils');
var config = require('../config');

function Moat() {

}

Moat.prototype.init = function() {
	var src = "https://z.moatads.com/financialtimes506DCcQ32/moatcontent.js";
	this.config = config('moat');

	/* istanbul ignore else  */
	if (this.config && !utils.isScriptAlreadyLoaded(src)) {
		// config must be in a global var

		// LOAD LIBRARY
		utils.attach(src, true);
	}

};

module.exports = new Moat();
