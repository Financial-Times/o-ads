
const config = require('./config');
const utils = require('./utils');
let parameters = {};

function Targeting() {
}

Targeting.prototype.get = function() {
	const methods = {
		socialReferrer: this.getSocialReferrer,
		timestamp: this.timestamp,
		responsive: this.responsive
	};

	utils.extend(parameters, this.getFromConfig(), this.searchTerm());

	for (let item in methods) {
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

Targeting.prototype.getSocialReferrer = function() {
	let codedValue;
	let refUrl;
	const referrer = utils.getReferrer();
	const refererRegexTemplate = '^http(|s)://(www.)*(SUBSTITUTION)/|_i_referer=http(|s)(:|%3A)(\/|%2F){2}(www.)*(SUBSTITUTION)(\/|%2F)';
	const lookup = {
		't.co': 'twi',
		'facebook.com': 'fac',
		'linkedin.com': 'lin',
		'drudgereport.com': 'dru'
	};

	/* istanbul ignore else  */
	if (utils.isString(referrer)) {
		for (refUrl in lookup) {
			/* istanbul ignore else  */
			if (lookup.hasOwnProperty(refUrl)) {
				const refererRegex = new RegExp(refererRegexTemplate.replace(/SUBSTITUTION/g, refUrl));
				/* istanbul ignore else  */
				if (refUrl !== undefined && refererRegex.test(referrer)) {
					codedValue = lookup[refUrl];
					break;
				}
			}
		}
	}

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
