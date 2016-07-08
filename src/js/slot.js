const utils = require('./utils');
const config = require('./config');

const attributeParsers = {
	sizes: function(value, sizes) {
		if (value === false || value === 'false') {
			return false;
		}
		/* istanbul ignore else  */
		else if (utils.isArray(sizes)) {
			value.replace(/(\d+)x(\d+)/g, function(match, width, height) {
				sizes.push([parseInt(width, 10), parseInt(height, 10)]);
			});
		}

		return sizes;
	},

	formats: function(value, sizes) {
		if (value === false || value === 'false') {
			sizes = false;
		} else {
			const mapping = config().formats;
			const formats = utils.isArray(value) ? value : value.split(',');
			formats.forEach(format => {
				if (mapping && mapping[format]) {
					format = mapping[format];
					if (utils.isArray(format.sizes[0])) {
						format.sizes.forEach(size => {
							sizes.push(size);
						});
					}
					else {
						sizes.push(format.sizes);
					}
				} else {
					utils.log.error(`Slot configured with unknown format ${format}`);
				}
			});
		}

		return sizes;
	},

	responsiveSizes: function(name, value, sizes) {
		const screenName = name.replace(/^sizes/, '').toLowerCase();
		/* istanbul ignore else	*/
		if (!utils.isPlainObject(sizes)) {
			sizes = {};
		}

		sizes[screenName] = attributeParsers.sizes(value, sizes[screenName] || []);
		return sizes;
	},

	responsiveFormats: function(name, value, sizes) {
		const screenName = name.replace(/^formats/, '').toLowerCase();
		/* istanbul ignore else	*/
		if (!utils.isPlainObject(sizes)) {
			sizes = {};
		}

		sizes[screenName] = attributeParsers.formats(value, []);
		return sizes;
	},

	targeting: function(value, targeting) {
		value = utils.hash(value, ';', '=');
		utils.extend(targeting, value);
		return targeting;
	},

	base: function(value) {
		/* istanbul ignore else	*/
		if (value === '' || value === 'true') {
			value = true;
		} else if (value === 'false') {
			value = false;
		}

		return value;
	}
};

/**
* The Slot class.
* @class
* @constructor
*/
function Slot(container, screensize) {
	let slotConfig = config('slots') || {};
	let disableSwipeDefault = config('disableSwipeDefault') || false;

	// store the container
	this.container = container;

	// the current responsive screensize

	/* istanbul ignore else	*/
	if (screensize) {
		this.screensize = screensize;
	}

	// init slot dom structure
	this.outer = this.addContainer(container, { 'class': 'o-ads__outer' });
	this.inner = this.addContainer(this.outer, { 'class': 'o-ads__inner'});

	// make sure the slot has a name
	this.setName();
	this.setResponsiveCreative(false);
	slotConfig = slotConfig[this.name] || {};

	// default configuration properties
	this.server = 'gpt';
	this.defer = false;

	// global slots configuration
	this.targeting = slotConfig.targeting || {};
	this.sizes = slotConfig.sizes || [];
	this.center = slotConfig.center || false;
	this.label = slotConfig.label || false;
	this.outOfPage = slotConfig.outOfPage || false;

	this.disableSwipeDefault = slotConfig.disableSwipeDefault || disableSwipeDefault;
	this.companion = (slotConfig.companion === false ? false : true);
	this.collapseEmpty = slotConfig.collapseEmpty;
	 /* istanbul ignore else */
	if (utils.isArray(slotConfig.formats)) {
		attributeParsers.formats(slotConfig.formats, this.sizes);
	}
	else if (utils.isPlainObject(slotConfig.formats)) {
		this.sizes = {};
		Object.keys(slotConfig.formats).forEach(screenName => {
			this.sizes[screenName] = attributeParsers.formats(slotConfig.formats[screenName], []);
		});
	}
	//TODO Write a test for when lazyload is set in slot config.
	/* istanbul ignore if */
	if(typeof slotConfig.lazyLoad !== 'undefined') {
		this.lazyLoad = slotConfig.lazyLoad;
	} else {
		this.lazyLoad = config('lazyLoad') || false;
	}

	// extend with imperative configuration options
	this.parseAttributeConfig();
 	/* istanbul ignore else	*/
	if (!this.sizes.length && !utils.isPlainObject(this.sizes)) {
		utils.log.error('slot %s has no configured sizes!', this.name);
		return false;
	}

	this.centerContainer();
	this.labelContainer();

	this.initResponsive();
	this.initLazyLoad();
}

/**
* parse slot attribute config
*/
Slot.prototype.parseAttributeConfig = function() {
	Array.from(this.container.attributes).forEach(attribute => {
		const name = utils.parseAttributeName(attribute.name);
		const value = attribute.value;
		if (name === 'formats') {
			this[name] = attributeParsers[name](value, this.sizes);
		} else if (attributeParsers[name]) {
			this[name] = attributeParsers[name](value, this[name]);
		} else if (/^formats\w*/.test(name)) {
			this.sizes = attributeParsers.responsiveFormats(name, value, this.sizes);
		} else if (/^sizes\w*/.test(name)) {
			this.sizes = attributeParsers.responsiveSizes(name, value, this.sizes);
		} else if (this.hasOwnProperty(name)) {
			this[name] = attributeParsers.base(value);
		}
	});
};

Slot.prototype.getAttributes = function() {
	const attributes = {};
	Array.from(this.container.attributes).forEach(attribute => {
		attributes[utils.parseAttributeName(attribute)] = attribute.value;
	});
	this.attributes = attributes;
	return this;
};

/**
*	Load a slot when it appears in the viewport
*/
Slot.prototype.initLazyLoad = function() {
	/* istanbul ignore else  */
	if (this.lazyLoad) {
		this.defer = true;
		let renderSlot = function(slot) {
			/* istanbul ignore else */
			if(!slot.rendered) {
				slot.fire('render');
				slot.rendered = true;
			}
		}.bind(null, this);
		utils.once('inview', renderSlot, this.container);
		//Master/Companion ads don't work with lazy loading, so if a master ad loads trigger
		//the companions to render immediately

		/* istanbul ignore else */
		if(this.companion) {
			utils.once('masterLoaded', renderSlot, this.container);
		}
	}
	return this;
};

/**
*	Listen to responsive breakpoints and collapse slots
* where the configured size is set to false
*/
Slot.prototype.initResponsive = function() {
	/* istanbul ignore else  */
	if (utils.isPlainObject(this.sizes)) {

		if (!this.hasValidSize()) {
			this.collapse();
		}

		utils.on('breakpoint', function(event) {
			const slot = event.detail.slot;
			slot.screensize = event.detail.screensize;

			if (slot.hasValidSize()) {
				slot.uncollapse();
			} else {
				slot.collapse();
			}
		}, this.container);
	}

	return this;
};

/**
* Maximise the slot when size is 100x100
*/
Slot.prototype.maximise = function (size) {
	if (size && +size[0] === 100 && +size[1] === 100) {
		this.fire('resize', {
			size: ['100%', '100%']
		});
	}
};

/**
*	If the slot doesn't have a name give it one
*/
Slot.prototype.setName = function() {
	this.name = this.container.getAttribute('data-o-ads-name') || this.container.getAttribute('o-ads-name');
	if (!this.name) {
		this.name = `o-ads-slot-${(Math.floor(Math.random() * 10000))}`;
		this.container.setAttribute('data-o-ads-name', this.name);
	}
	return this;
};

/**
*	If the slot doesn't have a name give it one
*/
Slot.prototype.setResponsiveCreative = function (value) {
	this.responsiveCreative = value;
	return this;
};


/**
* add the empty class to the slot
*/
Slot.prototype.collapse = function() {
	this.container.classList.add('o-ads--empty');
	this.setFormatLoaded(false);
	document.body.classList.add(`o-ads-no-${this.name}`);
	return this;
};

/**
* sets a classname of the format
*/
Slot.prototype.setFormatLoaded = function(format) {
	this.container.setAttribute('data-o-ads-loaded', format);
	return this;
};

/**
* remove the empty class from the slot
*/
Slot.prototype.uncollapse = function() {
	this.container.classList.remove('o-ads--empty');
	document.body.classList.remove(`o-ads-no-${this.name}`);
	return this;
};

/**
* call the ad server clear method on the slot if one exists
*/
Slot.prototype.clear = function() {
	/* istanbul ignore else  */
	if (utils.isFunction(this['clearSlot'])) {
		this.clearSlot();
	}
	return this;
};

/**
* call the ad server impression URL for an out of page slot if it has been configured correctly for delayed impressions
*/
Slot.prototype.submitImpression = function() {
	/* istanbul ignore else  */
	if (utils.isFunction(this['submitGptImpression'])) {
		this.submitGptImpression();
	}
	return this;
};

/**
*	fire an event on the slot
*/
Slot.prototype.fire = function(name, data) {
	const details = {
		name: this.name,
		slot: this
	};

	if (utils.isPlainObject(data)) {
		utils.extend(details, data);
	}

	utils.broadcast(name, details, this.container);
	return this;
};

/**
*	add a div tag into the current slot container
**/
Slot.prototype.addContainer = function(node, attrs) {
	let container = '<div ';
	/* istanbul ignore else  */
	if(attrs) {
		Object.keys(attrs).forEach(function(attr) {
			const value = attrs[attr];
			container += `${attr}=${value} `;
		});
	}
	container += '></div>';
	node.insertAdjacentHTML('beforeend', container);
	return node.lastChild;
};


Slot.prototype.hasValidSize = function(screensize) {
	screensize = screensize || this.screensize;
	if (screensize && utils.isPlainObject(this.sizes)) {
		return this.sizes[screensize] !== false;
	}

	return true;
};


/**
* Add a center class to the main container
*/
Slot.prototype.centerContainer = function() {
	if (this.center) {
		this.container.classList.add('o-ads--center');
	}

	return this;
};


/**
* Add a label class to the main container
*/
Slot.prototype.labelContainer = function() {
	let className;
	if (this.label === true || this.label === 'left') {
		className = 'label-left';
	} else if (this.label === 'right') {
		className = 'label-right';
	}

	if (className) {
		this.container.classList.add(`o-ads--${className}`);
	}
	return this;
};

module.exports = Slot;
