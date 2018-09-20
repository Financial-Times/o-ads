
const config = require('./config');
const utils = require('./utils');
const oTrackingCore = require('o-tracking/src/javascript/core.js');
let parameters = {};
function Targeting() {} //eslint-disable-line no-empty-function

Targeting.prototype.get = function() {
	const methods = {
		socialReferrer: this.getSocialReferrer,
		timestamp: this.timestamp,
		responsive: this.responsive
	};
	utils.extend(
		parameters,
		this.getFromConfig(),
		this.searchTerm(),
		this.socialFlow(),
		this.getRootId()
	);
	for (const item in methods) {
	/* istanbul ignore else  */
		if (methods.hasOwnProperty(item)) {
			utils.extend(parameters, methods[item]());
		}
	}
	return parameters;
};

Targeting.prototype.add = function(obj) {
	/* istanbul ignore else  */
	if (utils.isPlainObject(obj)) {
		utils.extend(parameters, obj);
	}
};

Targeting.prototype.remove = function(key) {
	/* istanbul ignore else */
	if(parameters[key]) {
		delete parameters[key];
	}
};

Targeting.prototype.clear = function() {
	parameters = {};
};

/**
* getFromConfig returns an object containing all the key values pairs specified in the dfp_targeting
* config.
*/
Targeting.prototype.getFromConfig = function() {
	let targeting = config('dfp_targeting') || {};
	if (!utils.isPlainObject(targeting)) {
		/* istanbul ignore else  */
		if (utils.isString(targeting)) {
			targeting = utils.hash(targeting, ';', '=');
		}
	}

	return targeting;
};

Targeting.prototype.getRootId = function() {
	return {
		rootid: oTrackingCore.getRootID()
	};
};

/**
 * If there is a query parameter called socialflow=xxx, we need to add it
 * as a tag
 */
Targeting.prototype.socialFlow = function() {
	const sf = utils.getQueryParamByName('socialflow');
	if(sf) {
		return {
			socialflow: sf
		};
	}
};

Targeting.prototype.getSocialReferrer = function() {
	let codedValue;
	const referrer = utils.getReferrer();
	// TODO: add on.ft.com
	const lookup = {
		't.co': 'twi',
		'facebook.com': 'fac',
		'linkedin.com': 'lin',
		'drudgereport.com': 'dru',
		'dianomi.com': 'dia',
		'google': 'goo'
	};

	Object.keys(lookup).forEach((url) => {
		const refererRegex = new RegExp(`^http(|s):\/\/(www.)*(${url})`);
		/* istanbul ignore else  */
		if (refererRegex.test(referrer)) {
			codedValue = lookup[url];
		}
	});
	return codedValue && { socref: codedValue } || {};
};

Targeting.prototype.searchTerm = function() {
	const qs = utils.hash(utils.getQueryString(), /\&|\;/, '=');
	let keywords = qs.q || qs.s || qs.query || qs.queryText || qs.searchField || undefined;

	/* istanbul ignore else	*/
	if (keywords && keywords !== '') {
		keywords = unescape(keywords).toLowerCase()
			.replace(/[';\^\+]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	}

	return {kw: keywords};
};

Targeting.prototype.timestamp = function() {
	return { ts: utils.getTimestamp() };
};

Targeting.prototype.responsive = function() {
	return config('responsive') ? { res: utils.responsive.getCurrent() } : {};
};

Targeting.prototype.debug = function () {
	const log = utils.log;
	const parameters = this.get();
	/* istanbul ignore else  */
	if (Object.keys(parameters).length !== 0) {
		log.start('Targeting');
		log.attributeTable(this.get());
		log.end();
	}
};


module.exports = new Targeting();
