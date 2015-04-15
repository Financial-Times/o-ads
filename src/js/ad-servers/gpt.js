/*globals googletag: true */

/**
* @fileOverview
* ad server modukes for o-ads implementing Google publisher tags ad requests.
*
* @author Robin Marr, robin.marr@ft.com
*/

"use strict";
var config = require('../config');
var utils = require('../utils');
var targeting = require('../targeting');
var breakpoints = false;
var responsive;

/*
#############################
## Initialisation handlers ##
#############################
*/

/*
* Initialise Google publisher tags functionality
*/
function init() {
	var gptConfig = config('gpt') || {};
	initGoogleTag();
	initResponsive();
	utils.on('ready', onReady.bind(null, slotMethods), document.documentElement);
	googletag.cmd.push(setup.bind(null, gptConfig));
}

/*
* initalise the googletag global namespace and add the google publish tags library to the page
*/
function initGoogleTag() {
	if (!window.googletag){
		// set up a place holder for the gpt code downloaded from google
		window.googletag = {};
		// this is a command queue used by GPT any methods added to it will be
		// executed when GPT code is available, if GPT is already available they
		// will be executed immediately
		window.googletag.cmd = [];
	}
	utils.attach('//www.googletagservices.com/tag/js/gpt.js', true);
}

/*
* if responsive configurations exist start listening for breakpoint changes
*/
function initResponsive() {
	breakpoints = config('responsive');
	if (utils.isObject(breakpoints) ) {
		responsive = utils.responsive(breakpoints, onBreakpointChange);
	}
}

/*
###################################
## Global configuration handlers ##
###################################
*/

/*
* Configure the GPT library for the current page
* this method is pushed onto the googletag command queue and run
* when the library is available
*/
function setup(gptConfig){
	enableVideo(gptConfig);
	enableCompanions(gptConfig);
	setRenderingMode(gptConfig);
	setPageTargeting(targeting.get());
	setPageCollapseEmpty(gptConfig);
	setRenderEnded();
	googletag.enableServices();
}

/*
* set the gpt rendering mode to either sync or async
* default is async
*/

function setRenderingMode(gptConfig){
	var rendering = gptConfig.rendering;
	if(rendering === 'sync') {
		googletag.pubads().enableSyncRendering();
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
		Object.keys(targeting).forEach(function (param){
			googletag.cmd.push(setTargeting.bind(null, param, targeting[param]));
		});
	} else {
		utils.log.warn('invalid targeting object passed', targeting);
	}
	return targeting;
}

/**
* Sets the GPT collapse empty mode for the page
* values can be 'after', 'before', 'never', 'ft'
* after as in after ads have rendered is the default
* true is synonymous with before
* false is synonymous with never
*/
function setPageCollapseEmpty(gptConfig) {
	var mode = gptConfig.collapseEmpty;

	if (mode === 'after' || mode === undefined) {
		mode = undefined;
	} else if (mode === 'before' || mode === true) {
		mode = true;
	} else if (mode === 'never' || mode === false) {
		mode = false;
	}
	googletag.pubads().collapseEmptyDivs(mode);
}

/*
* Set an the event handler for the gpt render ended event
*/
function setRenderEnded(){
	googletag.pubads().addEventListener('slotRenderEnded', onRenderEnded);
}

/**
* When companions are enabled we delay the rendering of ad slots until
* either a master is returned or all slots are returned without a master
*/
function enableCompanions(gptConfig) {
	if(gptConfig.companions){
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
		if (!utils.isScriptAlreadyLoaded(url)){
			utils.attach(url, true);
		}
		googletag.pubads().enableVideoAds();
	}
}

/*
####################
## Event handlers ##
####################
*/

/*
* Event handler for when a slot is ready for an ad to rendered
*/
function onReady(slotMethods, event){
	var slot = event.detail.slot;
	if (slot.server === 'gpt') {
		// extend the slot with gpt methods
		utils.extend(slot, slotMethods);

		// setup the gpt configuration the ad
		googletag.cmd.push(function (slot){
			slot.defineSlot()
			   .addServices()
			   .setCollapseEmpty()
			   .setTargeting()
			   .setURL();

			utils.broadcast('defined', {
				name: slot.name,
				slot: slot
			}, slot.container);
		}.bind(null, slot));
	}
}


function onRender(event){
	event.detail.slot.display();
}

/*
* Event handler for when a slot requests the ad be flipped
*/
function onRefresh(event){
	googletag.pubads().refresh(event.detail.slot.gpt.id);
}

/*
* Event handler for when a breakpoint is hit
*/
function onBreakpointChange(breakpoint){

}

function onRenderEnded(event) {
	var gptSlotId = event.slot.getSlotId();
	var domId = gptSlotId.getDomId().split('-');
	var iframeId = 'google_ads_iframe_' + gptSlotId.getId();

	event.iframe = document.getElementById(iframeId);
	event.name = domId[0];
	utils.broadcast('renderEnded', event);
}

/*
##################
## Slot methods ##
##################
* Set of methods extended on to the slot constructor for GPT served slots
*/
var slotMethods = {
/*
* object to hold all gpt options
*/
	gpt: {},
	addListeners: function(){
		utils.on('render', onRender, this.container);
		utils.on('refresh', onRefresh, this.container);
	},
/**
* define a GPT slot
*/
	defineSlot: function () {
		this.gpt.id = this.name + '-gpt';
		this.inner.setAttribute('id', this.gpt.id);
		this.setUnitName();

		if (breakpoints && utils.isObject(this.sizes)) {
			var mapping = googletag.sizeMapping();

			Object.keys(breakpoints).forEach(function (breakpoint) {
				if (this.sizes[breakpoint]){
					mapping.addSize(breakpoints[breakpoint], this.sizes[breakpoint]);
				}
			}.bind(this));
			this.gpt.slot = googletag.defineSlot(this.gpt.unitName, [0,0], this.gpt.id).defineSizeMapping(mapping.build());
		} else {
			this.gpt.slot = googletag.defineSlot(this.gpt.unitName, this.sizes, this.gpt.id);
		}

		return this;
	},
/**
* creates a container for an out of page ad and then makes the ad request
*/
	defineOutOfPage: function () {
		var oopId = this.name + '-oop';
		if (this.outOfPage){
			this.addContainer(this.container, {id: oopId});

			this.gpt.oop = googletag.defineOutOfPageSlot(this.gpt.unitName, this.oopId)
			           .addService(googletag.pubads());

			this.setTargeting(this.gpt.oop);
			this.setURL(this.gpt.oop);
			googletag.display(oopId);
		}
		return this;
	},
/*
*	Tell gpt to request an ad
*/
	display: function (id) {
		id = id || this.gpt.id;
		googletag.display(this.gpt.id);
		return this;
	},
/**
* Set the DFP unit name for the slot.
*/
	setUnitName: function () {
		var unitName;
		var gptUnitName = config('gptUnitName');

		if (utils.isNonEmptyString(gptUnitName)) {
			unitName = gptUnitName;
		} else {
			var network = config('network');
			var site = config('dfp_site');
			var zone = config('dfp_zone');
			unitName = '/' + network;
			unitName += utils.isNonEmptyString(site)  ? '/' + site : '';
			unitName += utils.isNonEmptyString(zone ) ? '/' + zone : '';
		}
		this.gpt.unitName = unitName;
		return this;
	},
/**
* Add the slot to the pub ads service and add a companion service if configured
*/
	addServices: function (gptSlot) {
		gptSlot = gptSlot || this.gpt.slot;
		gptSlot.addService(googletag.pubads());
		if (config('companions') && this.companion !== false) {
			gptSlot.addService(googletag.companionAds());
		}
		return this;
	},

/**
* Sets the GPT collapse empty mode for a given slot
* values can be 'after', 'before', 'never'
* after as in after ads have rendered is the default
* true is synonymous with before
* false is synonymous with never
*/
	setCollapseEmpty: function () {
		var mode = this.collapseEmpty || config('collapseEmpty');

		if (mode === true || mode === 'after') {
			this.gpt.slot.setCollapseEmptyDiv(true);
		} else if (mode === 'before') {
			this.gpt.slot.setCollapseEmptyDiv(true, true);
		} else if (mode === false || mode === 'never') {
			this.gpt.slot.setCollapseEmptyDiv(false);
		}
		return this;
	},

/**
* Sets page url to be sent to google
* prevents later url changes via javascript from breaking the ads
*/
	setURL: function (gptSlot) {
		gptSlot = gptSlot || this.gpt.slot;
		var canonical = config('canonical');
		if (canonical) {
			gptSlot.set("page_url", canonical || utils.getLocation());
		}
		return this;
	},

/**
* Adds key values from a given object to the slot targeting
*/
	setTargeting: function (gptSlot) {
		gptSlot = gptSlot || this.gpt.slot;
		if (utils.isPlainObject(this.targeting)) {
			Object.keys(this.targeting).forEach(function(param){
				this.gpt.slot.setTargeting(param, this.targeting[param]);
			}.bind(this));
		}
		return this;
	}
};

/*
######################
## External methods ##
######################
*/

/**
* The correlator is a random number added to ad calls.
* It is used by the ad server to determine which impressions where served to the same page
* Updating is used to tell the ad server to treat subsequent ad calls as being on a new page
*/
function updateCorrelator() {
	googletag.cmd.push(function () {
		googletag.pubads().updateCorrelator();
	});
}

module.exports.init = init;
module.exports.updateCorrelator = updateCorrelator;
