const utils = require('../utils');
const config = require('../config');
const Delegate = require('ftdomdelegate');
const targeting = require('../targeting');

/**
 * The Krux class defines an FT.ads.krux instance
 * @class
 * @constructor
*/
function Krux() {
 this.customAttributes = {}
}

Krux.prototype.add = function (target) {
	utils.extend(true, this.customAttributes, target);
};



Krux.prototype.sendNewPixel = function(pageLoad) {
	const pixel = window.Krux && window.Krux('require:pixel');
	/* istanbul ignore else */
	if(pixel && pixel.send) {
		if(pageLoad) {
			pixel.send();
		} else {
			pixel.send('', false);
		}
	};
}

Krux.prototype.init = function() {
	this.config = config('krux');
	if (this.config && this.config.id) {

		/* istanbul ignore else  */
		if (!window.Krux) {
			((window.Krux = function() {
				window.Krux.q.push(arguments);
			}).q = []
			);
		}

		this.api = window.Krux;
		/* istanbul ignore else  */
		if(this.config.attributes) {
			this.add(this.config.attributes)
		}

		this.setAllAttributes();

		let src;
		const m = utils.getLocation().match(/\bkxsrc=([^&]+)/);
		if (m) {
			src = decodeURIComponent(m[1]);
		}

		const finalSrc = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" : `//cdn.krxd.net/controltag/${this.config.id}.js`;

		const loadKruxScript = () => {
			this.kruxScript = utils.attach(finalSrc, true, () => {
				utils.broadcast('kruxScriptLoaded');
			});
			this.events.init();
		};
		setTimeout(() => {
			if('requestIdleCallback' in window) {
				requestIdleCallback(loadKruxScript);
			} else {
				loadKruxScript();
			}
		}, 1000);

		targeting.add(this.targeting());
	} else {
		// can't initialize Krux because no Krux ID is configured, please add it as key id in krux config.
	}
};

/**
* retrieve Krux values from localstorage or cookies in older browsers.
* @name retrieve
* @memberof Krux 
* @lends Krux
*/
Krux.prototype.retrieve = function(name) {
	let value;
	name = `kx${name}`;
	/* istanbul ignore else  */
	if (window.localStorage && localStorage.getItem(name)) {
		value = localStorage.getItem(name);
	} else if (utils.cookie(name)) {
		value = utils.cookie(name);
	}

	return value;
};

/**
* retrieve Krux segments
* @name segments
* @memberof Krux
* @lends Krux
*/
Krux.prototype.segments = function() {
	return this.retrieve('segs');
};

/**
* Retrieve all Krux values used in targeting and return them in an object
* Also limit the number of segments going into the ad calls via krux.limit config
* @name targeting
* @memberof Krux
* @lends Krux
*/
Krux.prototype.targeting = function() {
	let segs = this.segments();
	/* istanbul ignore else  */
	if (segs) {
		segs = segs.split(',');
		/* istanbul ignore else  */
		if (config('krux').limit) {
			segs = segs.slice(0, config('krux').limit);
		}
	}

	return {
		"kuid": this.retrieve('user'),
		"ksg": segs,
		"khost": encodeURIComponent(location.hostname),
		"bht": segs && segs.length > 0 ? 'true' : 'false'
	};
};

/**
* An object holding methods used by krux event pixels
* @name events
* @memberof Krux
* @lends Krux
*/
Krux.prototype.events = {

	delegated: function(config) {
		/* istanbul ignore else  */
		if (window.addEventListener) {
			/* istanbul ignore else  */
			if (config) {
				const fire = this.fire;
				const eventScope = function(kEvnt) {
					return function() {
						fire(config[kEvnt].id);
					};
				};

				window.addEventListener('load', function() {
					const delEvnt = new Delegate(document.body);
					for (let kEvnt in config) {
						/* istanbul ignore else  */
						if (config.hasOwnProperty(kEvnt)) {
							delEvnt.on(config[kEvnt].eType, config[kEvnt].selector, eventScope(kEvnt));
						}
					}
				}, false);
			}
		}
	}
};

Krux.prototype.events.fire = function(id, attrs) {
	/* istanbul ignore else  */
	if (id) {
		attrs = utils.isPlainObject(attrs) ? attrs : {};
		return window.Krux('admEvent', id, attrs); // eslint-disable-line new-cap
	}

	return false;
};

Krux.prototype.events.init = function() {
	let event;
    const configured = config('krux') && config('krux').events;
	/* istanbul ignore else  */
	if (utils.isPlainObject(configured)) {
		for (event in configured) {
			/* istanbul ignore else  */
			if (utils.isFunction(this[event])) {
				this[event](configured[event]);
			} else if (utils.isFunction(configured[event].fn)) {
				configured[event].fn(configured[event]);
			}
		}
	}
};

Krux.prototype.setAttributes = function (prefix, attributes) {
	/* istanbul ignore else  */
	if(attributes){
		Object.keys(attributes).forEach(item => {
			window.Krux('set', prefix + item, attributes[item]);
		});
	}
};

Krux.prototype.setAllAttributes = function() {
	/* istanbul ignore else  */
	if(this.customAttributes) {
		this.setAttributes('page_attr_', this.customAttributes.page || {});
		this.setAttributes('user_attr_', this.customAttributes.user || {});
		this.setAttributes('', this.customAttributes.custom || {});
	}
}

Krux.prototype.resetAttributes = function() {
	['user', 'page', 'custom'].forEach(type => {
		if(this.customAttributes[type]) {
			Object.keys(this.customAttributes[type]).forEach(key => {
				window.Krux('set', type === 'custom' ? key : `${type}_attr_${key}`, null);
			});
		}
	});

	this.customAttributes = {};
}

Krux.prototype.debug = function() {
	const log = utils.log;
	if (!this.config) {
		return;
	}
	log.start('Krux©');
		log('%c id:', 'font-weight: bold', this.config.id);

		if (this.config.limit) {
			log('%c segment limit:', 'font-weight: bold', this.config.limit);
		}

		if (this.config.attributes) {
			const attributes = this.config.attributes;
			log.start('Attributes');
				log.start('Page');
					log.attributeTable(attributes.page);
				log.end();

				log.start('User');
					log.attributeTable(attributes.user);
				log.end();

				log.start('Custom');
					log.attributeTable(attributes.custom);
				log.end();
			log.end();
		}
		if (this.config.events) {
			const events = this.config.events;
			log.start('Events');
				log.start('Delegated');
					log.table(events.delegated);
				log.end();
			log.end();
		}

		const targeting = this.targeting();
		log.start('Targeting');
			log.attributeTable(targeting);
		log.end();

		const tags = Array.from(document.querySelectorAll(".kxinvisible"));
		if (tags.length) {
			log.start(`${tags.length} Supertag© scripts`);
				tags.forEach(function(tag) {
					log(tag.dataset.alias, tag.querySelector("script"));
				});
			log.end();
		}
	log.end();
};

module.exports = new Krux();
