/* jshint forin: false */

//TODO: jshint complains about the for in loop on line ~102 because it set the myState var before filtering for hasOwnProperty
// I'm not sure what affect moving the myState var will have (it's used above too) so this need to be refactored at some point

'use strict';
var config = require('./config');
var utils = require('./utils');

// TODO: remove this in o-ads version 3
function getLoginInfo() {
	utils.log.warn('The metadata getLoginInfo method will be deprecated and will not available in future major versions of o-ads.');
	return {};
}

// TODO: remove this in o-ads version 3
function getAyscVars(obj) {
	utils.log.warn('The metadata getAsycVars method will be deprecated and will not available in future major versions of o-ads.');
	return {};
}

//TODO: review the need of this function & remove in o-ads version 3
module.exports.getPageType = function() {
	utils.log.warn('The metadata getPageType method will be deprecated and will not available in future major versions of o-ads.');
	return {};
};


// TODO: remove these from o-ads version 3
module.exports.page = function() {
	utils.log.warn('The metadata page method has been deprecated and will not available in future major versions of o-ads.');
	return {};
};

module.exports.user = function() {
	utils.log.warn('The metadata user method has been deprecated and will not available in future major versions of o-ads.');
	return {};
};

module.exports.getAyscVars = getAyscVars;
module.exports.getLoginInfo = getLoginInfo;
