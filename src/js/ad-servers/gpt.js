/*globals googletag: true */

/**
* @fileOverview
* ad server modukes for o-ads implementing Google publisher tags ad requests.
*
* @author Robin Marr, robin.marr@ft.com
*/

'use strict';
var config = require('../config');
var utils = require('../utils');
var targeting = require('../targeting');
var breakpoints = false;
/*
//###########################
// Initialisation handlers ##
//###########################
*/

/*
* Initialise Google publisher tags functionality
*/
function init() {
	var gptConfig = config('gpt') || {};
	breakpoints = config('responsive');
	initGoogleTag();

	utils.on('ready', onReady.bind(null, slotMethods));
	utils.on('render', onRender);
	utils.on('refresh', onRefresh);
	utils.on('resize', onResize);
	googletag.cmd.push(setup.bind(null, gptConfig));
}

/*
* initalise the googletag global namespace and add the google publish tags library to the page
*/
function initGoogleTag() {
	if (!window.googletag) {
		// set up a place holder for the gpt code downloaded from google
		window.googletag = {};

		// this is a command queue used by GPT any methods added to it will be
		// executed when GPT code is available, if GPT is already available they
		// will be executed immediately
		window.googletag.cmd = [];
	}

	utils.attach('//www.googletagservices.com/tag/js/gpt.js', true, null, function(err) {
		utils.broadcast('adServerLoadError', err);
	});
}

/*
//#################################
// Global configuration handlers ##
//#################################
*/

/*
* Configure the GPT library for the current page
* this method is pushed onto the googletag command queue and run
* when the library is available
*/
function setup(gptConfig) {
	googletag.pubads().addEventListener('slotRenderEnded', onRenderEnded);
	enableVideo(gptConfig);
	enableCompanions(gptConfig);
	setRenderingMode(gptConfig);
	setPageTargeting(targeting.get());
	setPageCollapseEmpty(gptConfig);
	googletag.enableServices();
	return true;
}

/*
* set the gpt rendering mode to either sync or async
* default is async
*/

function setRenderingMode(gptConfig) {
	var rendering = gptConfig.rendering;
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
*/
function setPageTargeting(targeting) {

	function setTargeting(key, value) {
		googletag.pubads().setTargeting(key, value);
	}

	if (utils.isPlainObject(targeting)) {
		Object.keys(targeting).forEach(function(param) {
			googletag.cmd.push(setTargeting.bind(null, param, targeting[param]));
		});
	} else {
		utils.log.warn('invalid targeting object passed', targeting);
	}

	return targeting;
}

/**
* Sets behaviour of empty slots can be 'after', 'before' or 'never'
* * after collapse slots that return an empty ad
* * before collapses all slots and only displays them on
* true is synonymous with before
* false is synonymous with never
*/
function setPageCollapseEmpty(gptConfig) {
	var mode = gptConfig.collapseEmpty;

	if (mode === 'before' || mode === true) {
		googletag.pubads().collapseEmptyDivs(true, true);
	} else if (mode === 'never' || mode === false) {
		googletag.pubads().collapseEmptyDivs(false);
	} else { //default is after
		googletag.pubads().collapseEmptyDivs(true);
	}

}

/**
* When companions are enabled we delay the rendering of ad slots until
* either a master is returned or all slots are returned without a master
*/
function enableCompanions(gptConfig) {
	if (gptConfig.companions) {
		googletag.pubads().disableInitialLoad();
		googletag.companionAds().setRefreshUnfilledSlots(true);
	}
}

/**
* Enables video ads and attaches the required additional script
* @name enableVideo
* @memberof GPT
* @lends GPT
*/
function enableVideo(gptConfig) {
	if (gptConfig.video) {
		var url = '//s0.2mdn.net/instream/html5/gpt_proxy.js';
		/* istanbul ignore else  */
		if (!utils.isScriptAlreadyLoaded(url)) {
			utils.attach(url, true);
		}

		googletag.pubads().enableVideoAds();
	}
}

/*
//##################
// Event handlers ##
//##################
*/

/*
* Event handler for when a slot is ready for an ad to rendered
*/
function onReady(slotMethods, event) {
	var slot = event.detail.slot;
	/* istanbul ignore else  */
	if (slot.server === 'gpt') {
		slot.gpt = {};

		// extend the slot with gpt methods
		utils.extend(slot, slotMethods);

		// setup the gpt configuration the ad
		googletag.cmd.push(function(slot) {
			slot.defineSlot()
			.addServices()
			.setCollapseEmpty()
			.setTargeting()
			.setURL();

			if (!slot.defer && slot.hasValidSize()) {
				slot.display();
			}
		}.bind(null, slot));
	}
}
/*
* Render is called when a slot is not rendered when the ready event fires
*/
function onRender(event) {
	var slot = event.detail.slot;
	if (utils.isFunction(slot.display)) {
		slot.display();
	} else {
		slot.defer = false;
	}
}

/*
* refresh is called when a slot requests the ad be flipped
*/
function onRefresh(event) {
	window.googletag.cmd.push(function(event) {
		var targeting = event.detail.targeting;
		if (utils.isPlainObject(targeting)) {
			Object.keys(targeting).forEach(function(name) {
				event.detail.slot.gpt.slot.setTargeting(name, targeting[name]);
			});
		}
		googletag.pubads().refresh([event.detail.slot.gpt.slot]);
	}.bind(this, event));
	return this;
}

function onResize(event) {
	var iframe = event.detail.slot.gpt.iframe;
	var size = event.detail.size;
	iframe.width = size[0];
	iframe.height = size[1];
}

/*
* function passed to the gpt library that is run when an ad completes rendering
*/
function onRenderEnded(event) {
	var detail;
	var data = {
		gpt: {}
	};

	var gptSlotId = event.slot.getSlotId();
	var domId = gptSlotId.getDomId().split('-');
	var iframeId = 'google_ads_iframe_' + gptSlotId.getId();
	data.type = domId.pop();
	data.name = domId.join('-');
	detail = data.gpt;
	detail.isEmpty = event.isEmpty;
	detail.size = event.size;
	detail.creativeId = event.creativeId;
	detail.lineItemId = event.lineItemId;
	detail.serviceName = event.serviceName;
	detail.iframe = document.getElementById(iframeId);
	if(detail.size) {
		detail.iframe.style.width = detail.size[0] + 'px';
		detail.iframe.style.height = detail.size[1] + 'px';
	}
	utils.broadcast('rendered', data);
}

/*
//################
// Slot methods ##
//################
* Set of methods extended on to the slot constructor for GPT served slots
*/
var slotMethods = {
	/**
	* define a GPT slot
	*/
	defineSlot: function() {
		window.googletag.cmd.push(function() {
			this.gpt.id = this.name + '-gpt';
			this.inner.setAttribute('id', this.gpt.id);
			this.setUnitName();
			if (!this.outOfPage) {
				if (breakpoints && utils.isObject(this.sizes)) {
					this.initResponsive();
					this.gpt.slot = googletag.defineSlot(this.gpt.unitName, [], this.gpt.id).defineSizeMapping(this.gpt.sizes);
				} else {
					this.gpt.slot = googletag.defineSlot(this.gpt.unitName, this.sizes, this.gpt.id);
				}
			}
			else {
				this.gpt.slot = googletag.defineOutOfPageSlot(this.gpt.unitName, this.gpt.id);
			}
		}.bind(this));
		return this;
	},
	clearSlot: function(gptSlot){
		if (window.googletag.pubadsReady && window.googletag.pubads) {
			gptSlot = gptSlot || this.gpt.slot;
			return googletag.pubads().clear([gptSlot]);
		} else {
			return false;
		}
	},
	initResponsive: function() {
		window.googletag.cmd.push(function() {
			utils.on('breakpoint', function(event) {
				var slot = event.detail.slot;
				var screensize = event.detail.screensize;

				updatePageTargeting({ res: screensize });

				if (slot.hasValidSize(screensize) && !slot.responsiveCreative) {
					/* istanbul ignore else  */
					if (slot.gpt.iframe) {
						slot.fire('refresh');
					} else if (!this.defer) {
						slot.display();
					}
				}
			}, this.container);

			var mapping = googletag.sizeMapping();
			Object.keys(breakpoints).forEach(function(breakpoint) {
				if (this.sizes[breakpoint]) {
					mapping.addSize(breakpoints[breakpoint], this.sizes[breakpoint]);
				}
			}.bind(this));

			this.gpt.sizes = mapping.build();
		}.bind(this));
		return this;
	},
	/*
	*	Tell gpt to request an ad
	*/
	display: function() {
		window.googletag.cmd.push(function() {
			googletag.display(this.gpt.id);
		}.bind(this));
		return this;
	},
	/**
	* Set the DFP unit name for the slot.
	*/
	setUnitName: function() {
		window.googletag.cmd.push(function() {
			var unitName;
			var gpt = config('gpt') || {};
			var attr = this.container.getAttribute('data-o-ads-gpt-unit-name');

			if (utils.isNonEmptyString(attr)) {
				unitName = attr;
			} else if (utils.isNonEmptyString(gpt.unitName)) {
				unitName = gpt.unitName;
			} else {
				var network = gpt.network;
				var site = gpt.site;
				var zone = gpt.zone;
				unitName = '/' + network;
				unitName += utils.isNonEmptyString(site)  ? '/' + site : '';
				unitName += utils.isNonEmptyString(zone) ? '/' + zone : '';
			}
			this.gpt.unitName = unitName;
		}.bind(this));
		return this;
	},
	/**
	* Add the slot to the pub ads service and add a companion service if configured
	*/
	addServices: function(gptSlot) {
		window.googletag.cmd.push(function(gptSlot) {
			var gpt = config('gpt') || {};
			gptSlot = gptSlot || this.gpt.slot;
			gptSlot.addService(googletag.pubads());
			if (gpt.companions && this.companion !== false) {
				gptSlot.addService(googletag.companionAds());
			}
		}.bind(this, gptSlot));
		return this;
	},

	/**
	* Sets the GPT collapse empty mode for a given slot
	* values can be 'after', 'before', 'never'
	* after as in after ads have rendered is the default
	* true is synonymous with before
	* false is synonymous with never
	*/
	setCollapseEmpty: function() {
		window.googletag.cmd.push(function() {
			var mode = this.collapseEmpty || config('collapseEmpty');

			if (mode === true || mode === 'after') {
				this.gpt.slot.setCollapseEmptyDiv(true);
			} else if (mode === 'before') {
				this.gpt.slot.setCollapseEmptyDiv(true, true);
			} else if (mode === false || mode === 'never') {
				this.gpt.slot.setCollapseEmptyDiv(false);
			}
		}.bind(this));
		return this;
	},
	submitGptImpression : function() {
		if (this.outOfPage && this.gpt.iframe) {
			function getImpressionURL(iframe) {
				var trackingUrlElement = iframe.contentWindow.document.querySelector('[data-o-ads-impression-url]');
				if (trackingUrlElement) {
					return trackingUrlElement.dataset.oAdsImpressionUrl;
				} else {
					utils.log.warn('Impression URL not found, this is set via a creative template.');
					return false;
				}
			};
			var impressionURL = getImpressionURL(this.gpt.iframe);
			/* istanbul ignore else  */
			if(impressionURL){
				utils.attach(impressionURL, true,
					function(){
						utils.log.info('Impression Url requested');
					},
					function(){
						utils.log.info('CORS request to submit an impression failed');
					},
					true
				);
			}
		}
		else {
			utils.log.warn('Attempting to call submitImpression on a non-oop slot');
		}
	},
	/**
	* Sets page url to be sent to google
	* prevents later url changes via javascript from breaking the ads
	*/
	setURL: function(gptSlot) {
		window.googletag.cmd.push(function() {
			gptSlot = gptSlot || this.gpt.slot;
			var canonical = config('canonical');
			gptSlot.set('page_url', (canonical ? canonical : utils.getLocation()));
		}.bind(this));
		return this;
	},

	/**
	* Adds key values from a given object to the slot targeting
	*/
	setTargeting: function(gptSlot) {
		window.googletag.cmd.push(function() {
			gptSlot = gptSlot || this.gpt.slot;
			/* istanbul ignore else  */
			if (utils.isPlainObject(this.targeting)) {
				Object.keys(this.targeting).forEach(function(param) {
					gptSlot.setTargeting(param, this.targeting[param]);
				}.bind(this));
			}
		}.bind(this));
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
	googletag.cmd.push(function() {
		googletag.pubads().updateCorrelator();
	});
}

function updatePageTargeting(override) {
	if (window.googletag) {
		var params = utils.isPlainObject(override) ? override : targeting.get();
		setPageTargeting(params);
	}
	else {
		utils.log.warn('Attempting to set page targeting before the GPT library has initialized');
	}
}

module.exports.init = init;
module.exports.updateCorrelator = updateCorrelator;
module.exports.updatePageTargeting = updatePageTargeting;

module.exports.debug = function(){
	var log = utils.log;
	var conf = config('gpt');
	if(!conf){
		return;
	}

	log.start('gpt');
		log.attributeTable(conf);
	log.end();
};
