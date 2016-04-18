'use strict';
var utils = require('../utils');
var config = require('../config');

function Moat() {

}

Moat.prototype.init = function() {
  this.config = config('moat');

	/* istanbul ignore else  */
	if (this.config && this.config.id && !utils.isScriptAlreadyLoaded(src)) {
    var src = "https://z.moatads.com/" + this.config.id + "/moatcontent.js";
		utils.attach(src, true);
	}

};

module.exports = new Moat();
