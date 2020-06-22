import utils from './utils';
import config from './config';

const VALID_SIZE_STRINGS = ['fluid'];
const VALID_COLLAPSE_MODES = ['before', 'after', 'never'];

const attributeParsers = {
	sizes: function(value, sizes) {
		if (value === false || value === 'false') {
			return false;
		}
		/* istanbul ignore else  */
		else if (utils.isArray(sizes)) {
			const regex = /(\d+)x(\d+)/;
			value.split(',').filter(size => size.length).forEach(size => {
				if(regex.test(size)) {
					size.replace(regex, function(match, width, height) {
						sizes.push([parseInt(width, 10), parseInt(height, 10)]);
					});
				} else if (VALID_SIZE_STRINGS.indexOf(size) >= 0) {
					sizes.push(size);
				}
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
					if (utils.isArray(format.sizes[0]) || VALID_SIZE_STRINGS.indexOf(format.sizes[0]) >= 0) {
						format.sizes.forEach(size => {
							sizes.push(size);
						});
					} else {
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

	lazyLoadThreshold: function(value) {
		return value.split(',').map(Number);
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
	},
	collapseEmpty: function(value) {
		const isUnknownAttribute = VALID_COLLAPSE_MODES.indexOf(value) === -1;

		if (isUnknownAttribute) {
			utils.log.warn(`Invalid attribute ${value} used for collapse-empty attribute, please use 'before', 'after' or 'never'`);
			return undefined;
		}

		return value;
	}
};

const convertLazyLoadBooleanToObject = (obj) => {
	if(obj.lazyLoad === true) {
		obj.lazyLoad = {};
	}
};

const onChangeBreakpoint = (event) => {
	const slot = event.detail.slot;
	slot.screensize = event.detail.screensize;
	if (slot.hasValidSize()) {
		slot.uncollapse();
	} else {
		slot.collapse();
		slot.clear();
	}
};


/**
 * The Slot class.
 * @class
 * @constructor
 */
function Slot(container, screensize, initLazyLoading) {
	const renderEvent = 'slotRenderStart';
	const cfg = config();
	let slotConfig = config('slots') || {};
	const disableSwipeDefault = config('disableSwipeDefault') || false;

	// store the container
	this.container = container;
	// the current responsive screensize

	/* istanbul ignore else	*/
	if (screensize) {
		this.screensize = screensize;
	}

	// init slot dom structure
	this.outer = this.addContainer(container, {
		'class': 'o-ads__outer',
		'aria-hidden': 'true',
		'tabindex': '-1'
	});
	this.inner = this.addContainer(this.outer, {
		'class': 'o-ads__inner'
	});

	// make sure the slot has a name
	this.setName();
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
	this.companion = slotConfig.companion === false ? false : true;
	this.collapseEmpty = slotConfig.collapseEmpty;
	/* istanbul ignore else */
	if (utils.isArray(slotConfig.formats)) {
		attributeParsers.formats(slotConfig.formats, this.sizes);
	} else if (utils.isPlainObject(slotConfig.formats)) {
		this.sizes = {};
		Object.keys(slotConfig.formats).forEach(screenName => {
			this.sizes[screenName] = attributeParsers.formats(slotConfig.formats[screenName], []);
		});
	}

	if (typeof slotConfig.lazyLoad !== 'undefined') {
		this.lazyLoad = slotConfig.lazyLoad;
	} else {
		this.lazyLoad = config('lazyLoad') || false;
	}

	const outerEl = container.querySelector('.o-ads__outer');

	if (outerEl && cfg.displayLabelWithBorders && this.container.getAttribute('data-o-ads-label')) {
		utils.once(renderEvent, () => {
			outerEl.classList.add('o-ads--label-with-borders');
		});
	}

	// extend with imperative configuration options
	this.parseAttributeConfig();
	/* istanbul ignore else	*/
	if (!this.sizes.length && !utils.isPlainObject(this.sizes)) {
		utils.log.error('slot %s has no configured sizes!', this.name);
		return false;
	}

	// Either retrieve the existing IntersectionObserver, or tell slots.js to create a new one.
	this.lazyLoadObserver = initLazyLoading(this.lazyLoad);
	this.initLazyLoad();

	this.centerContainer();
	this.labelContainer();

	this.initResponsive();

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
		} else if (name === 'collapseEmpty') {
			this.collapseEmpty = attributeParsers.collapseEmpty(value);
		} else if (name === 'lazyLoadThreshold' && this.lazyLoad) {
			convertLazyLoadBooleanToObject(this);
			this.lazyLoad.threshold = attributeParsers.lazyLoadThreshold(value);
		} else if (name === 'lazyLoadViewportMargin' && this.lazyLoad) {
			convertLazyLoadBooleanToObject(this);
			this.lazyLoad.viewportMargin = attributeParsers.base(value);} else if (attributeParsers[name]) {
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
	if (this.lazyLoadObserver && this.lazyLoad) {
		this.defer = true;
		this.lazyLoadObserver.observe(this.container);

		//Master/Companion ads don't work with lazy loading, so if a master ad loads trigger
		/* istanbul ignore else */
		if(this.companion) {
			utils.once('masterLoaded', () => {
				if (this.hasValidSize()){
					this.render();
				}
			}, this.container);
		}
	}
	return this;
};

Slot.prototype.render = function() {
	this.fire('slotCanRender');
	/* istanbul ignore else  */
	if(this.lazyLoadObserver) {
		this.lazyLoadObserver.unobserve(this.container);
	}
};

/**
 *	Listen to responsive breakpoints and collapse slots
 * where the configured size is set to false
 */
Slot.prototype.initResponsive = function() {
	/* istanbul ignore else */
	if (utils.isPlainObject(this.sizes)) {
		/* istanbul ignore else */
		if (!this.hasValidSize()) {
			this.collapse();
		}
		utils.on('breakpoint', onChangeBreakpoint, this.container);
	}

	return this;
};

/**
 * Maximise the slot when size is 100x100
 */
Slot.prototype.maximise = function(size) {
	if (size && Number(size[0]) === 100 && Number(size[1]) === 100) {
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
 * add the empty class to the slot
 */
Slot.prototype.collapse = function() {
	this.container.classList.add('o-ads--empty');
	this.setFormatLoaded(false);
	document.body.classList.add(`o-ads-no-${this.name}`);
	utils.broadcast('collapsed', this);
	return this;
};

/**
 * add the additional class to the slot
 */
Slot.prototype.addClass = function(className) {
	this.container.classList.add(`o-ads-${className}`);
	utils.broadcast('slotClassAdded', this);
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
 * call the ad server destroySlot method on the slot if one exists
 */
Slot.prototype.destroy = function() {
	/* istanbul ignore else  */
	if (utils.isFunction(this['destroySlot'])) {
		utils.off('breakpoint', onChangeBreakpoint, this.container);
		this.destroySlot();
		if (this.outer.parentElement === this.container) {
			this.container.removeChild(this.outer);
		} else {
			console.error('Error destroying ad slot. The parent node has already been removed.'); // eslint-disable-line no-console
		}
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
	const gpt = this.gpt || {};
	const details = {
		name: this.name || '',
		pos: this.targeting && this.targeting.pos || '',
		size: gpt.size || '',
		creativeId: gpt.creativeId || '',
		slot: this
	};

	if (typeof gpt.isEmpty === 'boolean' ) {
		details.isEmpty = gpt.isEmpty;
	}

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
	if (attrs) {
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

	if (className && !config('displayLabelWithBorders')) {
		this.container.classList.add(`o-ads--${className}`);
	}
	return this;
};

export default Slot;
