const utils = require('./utils');
const config = require('./config');
const Slot = require('./slot');

let screensize = null;

/**
* The Slots instance tracks all ad slots on the page
* configures global page events used by a slot and
* provides utlity methods that act on all slots
* @constructor
*/
function Slots() {
}

function invokeMethodOnSlots(names, method, callback) {
	let slots = [];
	names = names || Object.keys(this);

	/* istanbul ignore else	*/
	if (utils.isNonEmptyString(names)) {
		slots.push(names);
	} else if (utils.isArray(names)) {
		slots = names;
	}

	slots.forEach(run.bind(null, this, method));

	if(utils.isFunction(callback)){
			callback.call(this, slots);
	}

	return this;
}

/*
* Either run a method or fire an event on the named slot.
* @private
* @param slots the slots object
*/
function run(slots, action, name) {
	const slot = slots[name];
	if (slot) {
		if (utils.isFunction(slot[action])) {
			slot[action]();
		} else {
			if(utils.isFunction(slot.fire)){
				slot.fire(action);
			} else {
				utils.log.warn('Attempted to %s on a non-slot %s', action, name);
			}
		}
	} else {
		utils.log.warn('Attempted to %s non-existant slot %s', action, name);
	}
}

function findFormatBySize(size) {
	if(!size) {
		return false;
	}
	const formats = config('formats');
	for(let prop in formats) {
		/* istanbul ignore else	*/
		if(formats.hasOwnProperty(prop)) {

			let sizes = formats[prop].sizes;
			sizes = utils.isArray(sizes[0]) ? sizes : [sizes];
			const match = sizes.filter(function(s) {
				return (s[0] === parseInt(size[0]) && s[1] === parseInt(size[1]));
			});
			if(match.length) {
				return prop;
			}
		}
	}
}
/**
* Given a slot name or an array of slot names will collapse the slots using the collapse method on the slot
*/
Slots.prototype.collapse = function(names) {
	return invokeMethodOnSlots.call(this, names, 'collapse');
};

/**
* Given a slot name or an array of slot names will uncollapse the slots using the uncollapse method on the slot
*/
Slots.prototype.uncollapse = function(names) {
	return invokeMethodOnSlots.call(this, names, 'uncollapse');
};

/**
* Given a slot name or an array of slot names of slotnames will refresh the slots using the refresh method on the slot
*/
Slots.prototype.refresh = function(names) {
	return invokeMethodOnSlots.call(this, names, 'refresh');
};


/**
* Given a slot name or an array of slot names will clear the slots using the clear method on the slot
*/
Slots.prototype.clear = function(names) {
	return invokeMethodOnSlots.call(this, names, 'clear');
};

/**
* Given a slot name or an array of slot names will destroy the slots using the destroySlot method on the slot and remove the reference to the slot
*/
Slots.prototype.destroy = function(names) {
	return invokeMethodOnSlots.call(this, names, 'destroy', function(names){
			names.forEach(name => {
				this[name] = null;
				delete this[name];
			});
	});
};

/**
* Given a slot name will submit a delayed impression for the slot
*/
Slots.prototype.submitImpression = function(name) {
	return invokeMethodOnSlots.call(this, name, 'submitImpression');
};

/**
* Confirms a container in the page exists and creates a Slot object
*/
Slots.prototype.initSlot = function(container) {
	// if container is a string this is a legacy implementation using ids
	// find the element and remove the ID in favour of a data attribute
	if (utils.isString(container)) {
		container = document.getElementById(container) || document.querySelector(`[data-o-ads-name="${container}"]`);
		if (container && container.id) {
			container.setAttribute('data-o-ads-name', container.id);
			container.removeAttribute('id');
		}
	}

	// if not an element or we can't find it in the DOM exit
	if (!utils.isElement(container)) {
		utils.log.error('slot container must be an element!', container);
		return false;
	}

	// add the aria hidden attribute
	container.setAttribute('aria-hidden', 'true');

	// pass the method to retrieve or create the single IntersectionObserver instance
	const slot = new Slot(container, screensize, this.initLazyLoading.bind(this));
	/* istanbul ignore else	*/
	if (slot && !this[slot.name]) {
		this[slot.name] = slot;
		slot.fire('ready');
	} else if (this[slot.name]) {
		utils.log.error('slot %s is already defined!', slot.name);
	}

	return slot;
};

Slots.prototype.initRefresh = function() {
	if (config('flags').refresh && config('refresh')) {
		const data = config('refresh');
		this.refreshCount = 0;
		/* istanbul ignore else	*/
		if (data.time && !data.inview) {
			const refresh = () => {
				/* istanbul ignore else */
				if(!data.max || this.refreshCount++ < data.max) {
					this.refresh();
				} else if (this.refreshCount >= data.max) {
					clearInterval(refresh);
				}
			};
			setInterval(refresh, (parseFloat(data.time) || 1) * 1000)
		}
	}

	return this;
};

/*
*	listens for the rendered event from a slot and fires the complete event,
* after extending the slot with information from the server.
*/
Slots.prototype.initRendered = function() {
	utils.on('rendered', function(slots, event) {
		const slot = slots[event.detail.name];
		/* istanbul ignore else	*/
		if (slot) {
			utils.extend(slot[slot.server], event.detail[slot.server]);
			const size = event.detail.gpt.size;
			const format = findFormatBySize(size);
			slot.setFormatLoaded(format);
			slot.maximise(size);
			slot.fire('complete', event.detail);
		}
	}.bind(null, this));
	return this;
};

/*
* if responsive configuration exists listen for breakpoint changes
*/
Slots.prototype.initResponsive = function() {
	const breakpoints = config('responsive');
	/* istanbul ignore else	*/
	if (utils.isObject(breakpoints)) {
		screensize = utils.responsive(breakpoints, onBreakpointChange.bind(null, this));
	}

	return this;
};

/*
* called when a responsive breakpoint is crossed though window resizing or orientation change.
*/
function onBreakpointChange(slots, screensize) {
	slots.forEach(function(slot) {
		/* istanbul ignore else	*/
		if (slot) {
			// ADS-766 if format name is Responsive then we have requested a responsive creative and do not want to request new ads at different breakpoints
			/* istanbul ignore else	*/
			const isCurrentlyResponsive = slot.container && slot.container.getAttribute('data-o-ads-loaded') === 'Responsive';
			const stillWantsResponsive = slot.sizes[screensize] && slot.sizes[screensize].filter(size => findFormatBySize(size) === 'Responsive').length > 0;

			if (isCurrentlyResponsive && stillWantsResponsive) {
				return false;
			}
			slot.screensize = screensize;
			slot.fire('breakpoint', { screensize: screensize });
		}
	});
}

/*
* Initialise the postMessage API
*/
Slots.prototype.initPostMessage = function() {
	// Listen for messages coming from ads
	window.addEventListener('message', pmHandler.bind(null, this), false);

	function pmHandler(slots, event) {
		const data = utils.messenger.parse(event.data);
		/* istanbul ignore else	don't process messages with a non oAds type*/
		if (data.type && (/^oAds\./.test(data.type) || /^touch/.test(data.type))) {
			const type = data.type.replace('oAds\.', '');
			let slot = data.name ? slots[data.name] : false;
			if (type === 'whoami' && event.source) {

				document.body.dispatchEvent( new CustomEvent('oAds.adIframeLoaded'));

				const messageToSend = { type: 'oAds.youare' };
				const slotName = utils.iframeToSlotName(event.source.window);
				slot = slots[slotName] || false;

				if (slot) {
					if (data.collapse) {
						slot.collapse();
					}

					if (data.mastercompanion) {
						const size = slot.gpt.size;
						const format = findFormatBySize(size);
						slots.forEach(function(s) {
							if(s.companion && s.name !== slot.name) {
								s.fire('masterLoaded', slot);
								s.container.setAttribute('data-o-ads-master-loaded', format);
							}
						});
					}
          if (data.customMessages && typeof data.customMessages === "object") {
							slot.fire('customMessages', data.customMessages);
          }
					if(slot.disableSwipeDefault) {
						messageToSend.disableDefaultSwipeHandler = true;
					}

					messageToSend.name = slotName;
					messageToSend.sizes = slot.sizes;

					utils.messenger.post(messageToSend, event.source);
				} else {
					utils.log.error('Message received from unidentified slot');
					utils.messenger.post(messageToSend, event.source);
				}
			} else {
				if (!slot) {
					utils.log.error('Message received from unidentified slot');
					return;
				}

				if(type === 'responsive') {
					slot.setResponsiveCreative(true);
				} else if (utils.isFunction(slot[type])) {
					slot[type]();
				} else if (/^touch/.test(data.type)) {
					slot.fire('touch', data);
				} else {
					delete data.type;
					delete data.name;
					slot.fire(type, data);
				}
			}
		}
	}
};

// remove any observers tied to elements no longer in the DOM
// e.g. app page has been swiped out from the gallery
Slots.prototype.flushLazyLoading = function() {
	this.lazyLoadingObservers = this.lazyLoadingObservers.filter(observer => {
		return Boolean(!observer.root || document.contains(observer.root));
	});
};

Slots.prototype.initLazyLoading = function(slotConfig) {
	const lazyLoadingConfig = config('lazyLoad') || slotConfig | {};
	this.lazyLoadingObservers = this.lazyLoadingObservers || [];
	this.flushLazyLoading();
	// find any pre-existing observers
	let lazyLoadingObserver = this.lazyLoadingObservers.find(observer => {
		// deliberately double-equals to match null and undefined where the viewport is being observed
		return lazyLoadingConfig.root == observer.root;
	});

	// If we don't already have an instance of the observer, and it is enabled globally or on a slot (force), then create one.
	/* istanbul ignore else	*/
	if('IntersectionObserver' in window && !lazyLoadingObserver && !!lazyLoadingConfig) {
		let options = {};

		function onChange(changes) {
			//Execute the changes in the order they appear on the page. This is because the top slot often determines what the lower slots display.
			/* istanbul ignore next */
			changes
			.filter(a => a.intersectionRect.height || a.intersectionRect.width || a.intersectionRect.top || a.intersectionRect.left)
			.sort((a,b) => a.intersectionRect.top - b.intersectionRect.top)
			.forEach((change) => {
				const slotName = change.target.getAttribute('data-o-ads-name');
				/* istanbul ignore else */
				if(slotName) {
					invokeMethodOnSlots.call(this, slotName, 'render');
				}
			})
		}
		/* istanbul ignore else	*/
		if(typeof lazyLoadingConfig  === 'object') {
			/* istanbul ignore else	*/
			if(lazyLoadingConfig.viewportMargin){
				options.rootMargin = lazyLoadingConfig.viewportMargin;
			}
			/* istanbul ignore else	*/
			if(lazyLoadingConfig.threshold) {
				options.threshold = lazyLoadingConfig.threshold;
			}
			options.root = lazyLoadingConfig.root || null;
		}
		lazyLoadingObserver = new IntersectionObserver(onChange.bind(this), options);
		this.lazyLoadingObservers.push(lazyLoadingObserver);
	}

	return lazyLoadingObserver;

};

Slots.prototype.forEach = function(fn) {
	Object.keys(this).forEach(name => {
		const slot = this[name];
		/* istanbul ignore else	*/
		if (slot instanceof Slot) {
			fn.call(this, slot);
		}
	});
	return this;
};

/*
* Initialise slots
*/
Slots.prototype.init = function() {
	this.initRefresh();
	this.initRendered();
	this.initResponsive();
	this.initPostMessage();
	this.initLazyLoading();
};

Slots.prototype.debug = function (){
	const log = utils.log;
	const data = [];

	this.forEach(function (slot) {
		const row = {
			name: slot.name,
			'unit name': slot.gpt.unitName,
			'creative id': slot.gpt.creativeId || 'N/A',
			'line item id': slot.gpt.lineItemId || 'N/A',
			size: (utils.isArray(slot.gpt.size) && slot.gpt.size.join('×')) || (slot.gpt.isEmpty && 'empty') || 'N/A',
			sizes: (utils.isArray(slot.sizes) && slot.sizes.map(function(item){ return item.join('×'); }).join(', ')) || 'responsive slot',
			targeting: Object.keys(slot.targeting).map(function (param) { return `${param}=${slot.targeting[param]}`;} ).join(', ')
		};
		data.push(row);
	});

	log.start('Creatives');
	log.table(data);
	log.end();
};

module.exports = new Slots();
