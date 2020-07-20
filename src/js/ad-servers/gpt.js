/*globals googletag: true */
/* eslint no-inner-declarations: 1 */

/**
 * @fileOverview
 * ad server modules for o-ads implementing Google publisher tags ad requests.
 *
 * @author Robin Marr, robin.marr@ft.com
 */
import config from '../config';
import utils from '../utils';
import targeting from '../targeting';
import { stripUrlParams, SEARCH_PARAMS } from '../utils/url';

export const DEFAULT_LAZY_LOAD = {
	fetchMarginPercent: 500,
	renderMarginPercent: 200,
	mobileScaling: 2.0,
};
const DEFAULT_COLLAPSE_MODE = 'never';
let breakpoints = false;
/*
//###########################
// Initialisation handlers ##
//###########################
*/

/*
 * Initialise Google publisher tags functionality
 */
function init() {
	const gptConfig = config('gpt') || {};
	breakpoints = config('responsive');
	loadGPT();
	utils.on('slotReady', onReady.bind(null, slotMethods));
	utils.on('slotCanRender', onRender);
	utils.on('refresh', onRefresh);
	utils.on('resize', onResize);
	googletag.cmd.push(setup.bind(null, gptConfig));
}

/**
 * Initalise the googletag global namespace and add the google publish tags library to the page
 *
 * @return  {void}  [return description]
 */
function loadGPT() {
	if (!window.googletag) {
		// set up a place holder for the gpt code downloaded from google
		window.googletag = {};

		// this is a command queue used by GPT any methods added to it will be
		// executed when GPT code is available, if GPT is already available they
		// will be executed immediately
		window.googletag.cmd = [];
	}

	utils.attach(
		'//securepubads.g.doubleclick.net/tag/js/gpt.js',
		true,
		() => {
			utils.broadcast('serverScriptLoaded');
		},
		(err) => {
			utils.broadcast('adServerLoadError', err);
		}
	);
}

/*
//#################################
// Global configuration handlers ##
//#################################
*/

/**
 * Configure the GPT library for the current page
 * this method is pushed onto the googletag command queue and run
 * when the library is available
 * @param {object} gptConfig
 * @returns {true}
 */
function setup(gptConfig) {
	const nonPersonalized = config('nonPersonalized') ? 1 : 0;
	googletag.pubads().addEventListener('slotRenderEnded', onRenderEnded);
	enableCompanions(gptConfig);
	setRenderingMode(gptConfig);
	setPageTargeting(targeting.get());
	setPageCollapseEmpty();

	if (gptConfig.enableLazyLoad) {
		enableLazyLoad(gptConfig.enableLazyLoad);
	}

	const url = stripUrlParams({
		href: window.location.href,
		filters: { root: SEARCH_PARAMS },
	});

	googletag.enableServices();
	googletag.pubads().setTargeting('url', url);
	googletag.pubads().setRequestNonPersonalizedAds(nonPersonalized);

	return true;
}

/**
 * Enables GPT's Lazy Loading for serving ads only when it's necessary.
 * 		The lazy load config ooptions are:
 *
 * 			- fetchMarginPercent,		minimum distance from the current viewport a slot
 * 					must be before we fetch the ad as a percentage of viewport size.
 * 					0 means "when the slot enters the viewport",
 * 					100 means "when the ad is 1 viewport away"
 *
 * 			- renderMarginPercent,	minimum distance from the current viewport a slot
 * 					must be before we render an ad.
 * 					This allows for prefetching the ad, but waiting to render and
 * 					download other subresources. The value works just like
 * 					fetchMarginPercent as a percentage of viewport.
 *
 * 			- mobileScaling,				a multiplier applied to margins on mobile devices.
 * 					This allows varying margins on mobile vs. desktop. For example,
 * 					a mobileScaling of 2.0 will multiply all margins by 2 on mobile
 * 					devices, increasing the minimum distance a slot can be before
 * 					fetching and rendering.
 *
 * @param {object|boolean} lazyLoadConf The lazy load config object or a boolean.
 * @returns {void}
 */
function enableLazyLoad(lazyLoadConf) {
	if (lazyLoadConf && (typeof lazyLoadConf === 'object' || typeof lazyLoadConf === 'boolean')) {
		const opts = Object.assign({}, DEFAULT_LAZY_LOAD, typeof lazyLoadConf === 'object' ? lazyLoadConf : {});
		window.googletag.pubads().enableLazyLoad(opts);
	} else {
		utils.log.warn('lazyLoadConf must be either an object or a boolean', lazyLoadConf);
	}
}

/**
 * set the gpt rendering mode to either sync or async
 * default is async
 * @returns {void}
 */
function setRenderingMode(gptConfig) {
	const rendering = gptConfig.rendering;
	if (rendering === 'sync') {
		googletag.pubads().enableSyncRendering();
	} else if (rendering === 'sra') {
		googletag.pubads().enableSingleRequest();
	} else {
		googletag.pubads().enableAsyncRendering();
	}
}

/**
 * Adds page targeting to GPT ad calls
 * @name setPageTargeting
 * @memberof GPT
 * @lends GPT
 *
 * @param {object} targetingData
 * @returns {object}
 */
function setPageTargeting(targetingData) {
	if (utils.isPlainObject(targetingData)) {
		googletag.cmd.push(() => {
			const pubads = googletag.pubads();
			Object.keys(targetingData).forEach((key) => {
				// Convert to string as boolean values are invalid arguments for GPT setTargeting()
				pubads.setTargeting(key, String(targetingData[key]));
			});
		});
	} else {
		/* istanbul ignore next  */
		utils.log.warn('invalid targeting object passed', targetingData);
	}

	return targetingData;
}

/**
 * Removes page targeting for a specified key from GPT ad calls
 *
 * @param {string} key
 * @returns {void}
 */
function clearPageTargetingForKey(key) {
	if (!window.googletag) {
		utils.log.warn('Attempting to clear page targeting before the GPT library has initialized');
		return;
	}
	if (!key) {
		utils.log.warn('Refusing to unset all keys - a key must be specified');
		return;
	}
	googletag.cmd.push(() => {
		googletag.pubads().clearTargeting(key);
	});
}

/**
 * Sets behaviour of empty slots can be 'after', 'before' or 'never'
 * * 'after' collapse slots that return an empty ad
 * * 'before' collapses all slots and only displays them when an ad is found
 * * 'never' does not collapse any empty slot, the collapseEmptyDivs method is not called in that case
 * @returns {void}
 */
function setPageCollapseEmpty() {
	const mode = config('collapseEmpty');

	if (mode === 'before') {
		googletag.pubads().collapseEmptyDivs(true);
	}

	if (mode === 'after') {
		googletag.pubads().collapseEmptyDivs(false);
	}
}

/**
 * When companions are enabled we delay the rendering of ad slots until
 * either a master is returned or all slots are returned without a master
 * @returns {void}
 */
function enableCompanions(gptConfig) {
	if (gptConfig.companions) {
		googletag.pubads().disableInitialLoad();
		googletag.companionAds().setRefreshUnfilledSlots(true);
	}
}

// Event handlers
// -----------------------------------------------------------------------------
/**
 * Event handler for when a slot is ready for an ad to rendered
 *
 * @param {any} slotMethods
 * @param {object} event
 * @returns {void}
 */
function onReady(slotMethods, event) {
	const slot = event.detail.slot;
	/* istanbul ignore else  */
	if (slot.server === 'gpt') {
		slot.gpt = {};

		// extend the slot with gpt methods
		utils.extend(slot, slotMethods);

		// setup the gpt configuration the ad
		googletag.cmd.push(() => {
			slot.defineSlot().addServices().setCollapseEmpty().setTargeting().setURL();

			if (!slot.defer && slot.hasValidSize()) {
				slot.display();
			}
		});
	}
}
/**
 * Render is called when a slot is not rendered when the ready event fires
 * @param {object} event
 * @returns {void}
 */
function onRender(event) {
	const slot = event.detail.slot;
	/* istanbul ignore else  */
	if (utils.isFunction(slot.display)) {
		slot.display();
	}
}

/*
 * refresh is called when a slot requests the ad be flipped
 */
function onRefresh(event) {
	window.googletag.cmd.push(() => {
		const targeting = event.detail.targeting;
		if (utils.isPlainObject(targeting)) {
			Object.keys(targeting).forEach((name) => {
				event.detail.slot.gpt.slot.setTargeting(name, targeting[name]);
			});
		}
		googletag.pubads().refresh([event.detail.slot.gpt.slot]);
	});
	return this;
}

function onResize(event) {
	const iframe = event.detail.slot.gpt.iframe;
	const size = event.detail.size;
	iframe.width = size[0];
	iframe.height = size[1];
}

/*
 * function passed to the gpt library that is run when an ad completes rendering
 */
function onRenderEnded(event) {
	const data = {
		gpt: {},
	};

	const gptSlotId = event.slot.getSlotId();
	const domId = gptSlotId.getDomId().split('-');
	const iframeId = `google_ads_iframe_${gptSlotId.getId()}`;
	data.type = domId.pop();
	data.name = domId.join('-');
	data.size = event.size && event.size.length ? event.size.join() : '';
	data.creativeId = event.creativeId;

	const slotTargeting = event.slot.getTargetingMap && event.slot.getTargetingMap();
	if (slotTargeting && slotTargeting.pos) {
		data.pos = slotTargeting.pos.length ? slotTargeting.pos.join() : '';
	}

	const detail = data.gpt;
	detail.isEmpty = event.isEmpty;
	detail.size = event.size;
	detail.creativeId = event.creativeId;
	detail.lineItemId = event.lineItemId;
	detail.serviceName = event.serviceName;
	const iFrameEl = document.getElementById(iframeId);
	if (iFrameEl) {
		iFrameEl.setAttribute('tabindex', '-1');
		iFrameEl.setAttribute('aria-hidden', 'true');
		iFrameEl.setAttribute('role', 'presentation');
		iFrameEl.setAttribute('title', 'Advertisement');
		detail.iframe = iFrameEl;
	} else {
		/* istanbul ignore next */
		utils.log.warn('No iFrame found matching GPT SlotID');
	}

	utils.broadcast('slotRenderStart', data);
}

/*
//################
// Slot methods ##
//################
* Set of methods extended on to the slot constructor for GPT served slots
*/
const slotMethods = {
	/**
	 * define a GPT slot
	 */
	defineSlot: function () {
		window.googletag.cmd.push(() => {
			this.gpt.id = `${this.name}-gpt`;
			this.inner.setAttribute('id', this.gpt.id);
			this.setUnitName();
			if (!this.outOfPage) {
				if (breakpoints && utils.isObject(this.sizes)) {
					this.initResponsive();
					this.gpt.slot = googletag.defineSlot(this.gpt.unitName, [], this.gpt.id).defineSizeMapping(this.gpt.sizes);
				} else {
					this.gpt.slot = googletag.defineSlot(this.gpt.unitName, this.sizes, this.gpt.id);
				}
			} else {
				this.gpt.slot = googletag.defineOutOfPageSlot(this.gpt.unitName, this.gpt.id);
			}
		});
		return this;
	},
	clearSlot: function (gptSlot) {
		if (window.googletag.pubadsReady && window.googletag.pubads) {
			gptSlot = gptSlot || this.gpt.slot;
			return googletag.pubads().clear([gptSlot]);
		} else {
			return false;
		}
	},
	initResponsive: function () {
		window.googletag.cmd.push(() => {
			utils.on(
				'breakpoint',
				(event) => {
					const slot = event.detail.slot;
					const screensize = event.detail.screensize;

					updatePageTargeting({ res: screensize });

					if (slot.hasValidSize(screensize)) {
						/* istanbul ignore else  */
						if (slot.gpt.iframe) {
							slot.fire('refresh');
						} else if (!this.defer) {
							slot.display();
						}
					}
				},
				this.container
			);

			const mapping = googletag.sizeMapping();
			Object.keys(breakpoints).forEach((breakpoint) => {
				if (this.sizes[breakpoint]) {
					mapping.addSize(breakpoints[breakpoint], this.sizes[breakpoint]);
				}
			});

			this.gpt.sizes = mapping.build();
		});
		return this;
	},

	/**
	 * Tell gpt to destroy the slot and its metadata
	 */
	destroySlot: function (gptSlot) {
		if (window.googletag.pubadsReady && window.googletag.pubads) {
			gptSlot = gptSlot || this.gpt.slot;
			return googletag.destroySlots([gptSlot]);
		} else {
			return false;
		}
	},
	/*
	 *	Tell gpt to request an ad
	 */
	display: function () {
		window.googletag.cmd.push(() => {
			this.fire('slotGoRender');
			googletag.display(this.gpt.id);
		});
		return this;
	},
	/**
	 * Set the DFP unit name for the slot.
	 */
	setUnitName: function () {
		window.googletag.cmd.push(() => {
			let unitName;
			const gpt = config('gpt') || {};
			const attr = this.container.getAttribute('data-o-ads-gpt-unit-name');

			if (utils.isNonEmptyString(attr)) {
				unitName = attr;
			} else if (utils.isNonEmptyString(gpt.unitName)) {
				unitName = gpt.unitName;
			} else {
				const network = gpt.network;
				const site = gpt.site;
				const zone = gpt.zone;
				unitName = `/${network}`;
				unitName += utils.isNonEmptyString(site) ? `/${site}` : '';
				unitName += utils.isNonEmptyString(zone) ? `/${zone}` : '';
			}
			this.gpt.unitName = unitName;
		});
		return this;
	},
	/**
	 * Add the slot to the pub ads service and add a companion service if configured
	 */
	addServices: function (gptSlot) {
		window.googletag.cmd.push(() => {
			const gpt = config('gpt') || {};
			gptSlot = gptSlot || this.gpt.slot;
			gptSlot.addService(googletag.pubads());
			if (gpt.companions && this.companion !== false) {
				gptSlot.addService(googletag.companionAds());
			}
		});
		return this;
	},

	/**
	 * Sets the GPT collapse empty mode for a given slot
	 * values can be 'after', 'before', 'never'
	 */
	setCollapseEmpty: function () {
		window.googletag.cmd.push(() => {
			const mode = this.collapseEmpty || config('collapseEmpty') || DEFAULT_COLLAPSE_MODE;

			if (mode === 'before') {
				this.gpt.slot.setCollapseEmptyDiv(true, true);
			} else if (mode === 'after') {
				this.gpt.slot.setCollapseEmptyDiv(true);
			} else if (mode === 'never') {
				this.gpt.slot.setCollapseEmptyDiv(false);
			}
		});

		return this;
	},
	submitGptImpression: function () {
		/* istanbul ignore next  */
		function getImpressionURL(iframe) {
			const trackingUrlElement = iframe.contentWindow.document.querySelector('[data-o-ads-impression-url]');
			if (trackingUrlElement) {
				return trackingUrlElement.dataset.oAdsImpressionUrl;
			} else {
				utils.log.warn('Impression URL not found, this is set via a creative template.');
				return false;
			}
		}
		if (this.outOfPage && this.gpt.iframe) {
			const impressionURL = getImpressionURL(this.gpt.iframe);
			/* istanbul ignore next  */
			if (impressionURL) {
				utils.attach(
					impressionURL,
					true,
					() => {
						utils.log.info('Impression Url requested');
					},
					() => {
						utils.log.info('CORS request to submit an impression failed');
					},
					true
				);
			}
		} else {
			utils.log.warn('Attempting to call submitImpression on a non-oop slot');
		}
	},
	/**
	 * Sets page url to be sent to google
	 * prevents later url changes via javascript from breaking the ads
	 */
	setURL: function (gptSlot) {
		window.googletag.cmd.push(() => {
			gptSlot = gptSlot || this.gpt.slot;
			const canonical = config('canonical');
			gptSlot.set('page_url', canonical ? canonical : utils.getLocation());
		});
		return this;
	},

	/**
	 * Adds key values from a given object to the slot targeting
	 */
	setTargeting: function (gptSlot) {
		window.googletag.cmd.push(() => {
			gptSlot = gptSlot || this.gpt.slot;
			/* istanbul ignore else  */
			if (utils.isPlainObject(this.targeting)) {
				Object.keys(this.targeting).forEach((param) => {
					gptSlot.setTargeting(param, this.targeting[param]);
				});
			}
		});
		return this;
	},
};

/*
//####################
// External methods ##
//####################
*/

/**
 * The correlator is a random number added to ad calls.
 * It is used by the ad server to determine which impressions where served to the same page
 * Updating is used to tell the ad server to treat subsequent ad calls as being on a new page
 */
function updateCorrelator() {
	utils.log.warn(
		'[DEPRECATED]: Updatecorrelator is being phased out by google and removed from o-ads in future releases.'
	);

	googletag.cmd.push(() => {
		googletag.pubads().updateCorrelator();
	});
}

function clearPageTargeting() {
	if (window.googletag) {
		googletag.cmd.push(() => {
			googletag.pubads().clearTargeting();
		});
	} else {
		utils.log.warn('Attempting to clear page targeting before the GPT library has initialized');
	}
}

function updatePageTargeting(override) {
	if (window.googletag) {
		const params = utils.isPlainObject(override) ? override : targeting.get();
		setPageTargeting(params);
	} else {
		utils.log.warn('Attempting to set page targeting before the GPT library has initialized');
	}
}
//https://developers.google.com/doubleclick-gpt/common_implementation_mistakes#scenario-2:-checking-the-googletag-object-to-know-whether-gpt-is-ready
function hasGPTLoaded() {
	if (window.googletag && window.googletag.apiReady) {
		return true;
	} else {
		return false;
	}
}

function debug() {
	const log = utils.log;
	const conf = config('gpt');
	if (!conf) {
		return;
	}

	log.start('gpt');
	log.attributeTable(conf);
	log.end();
}

export default {
	init,
	setup,
	updateCorrelator,
	updatePageTargeting,
	clearPageTargeting,
	clearPageTargetingForKey,
	hasGPTLoaded,
	loadGPT,
	debug,
};
