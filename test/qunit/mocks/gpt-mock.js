/* globals sinon: false, $: false */

"use strict";

var googletag = {};

var stubs = sinon.sandbox.create();

googletag.getEventLog = stubs.stub();
googletag.defineSizeMapping = stubs.stub();
googletag.display = stubs.stub();
googletag.enableServices = stubs.stub();
googletag.companionAds = stubs.stub();
googletag.content = stubs.stub();
googletag.disablePublisherConsole = stubs.stub();
googletag.sizeMapping = stubs.stub();
googletag.getVersion = stubs.stub();

function Slot(){
	this.addService = stubs.stub().returns(this);
	this.setCollapseEmptyDiv = stubs.stub().returns(this);
	this.renderEnded = stubs.stub().returns(this);
	this.setTargeting = stubs.stub().returns(this);
	this.defineSizeMapping = stubs.stub().returns(this);
	this.set = stubs.stub().returns(this);
}

googletag.defineUnit = stubs.stub().returns(new Slot());
googletag.defineSlot = stubs.stub().returns(new Slot());
googletag.defineOutOfPageSlot = stubs.stub().returns(new Slot());

googletag.sizeMapping = stubs.stub().returns({
	addSize: stubs.stub(),
	build: stubs.stub()
});


var pubads = {
	getName : stubs.stub(),
	fillSlot : stubs.stub(),
	setCookieOptions : stubs.stub(),
	setTagForChildDirectedTreatment : stubs.stub(),
	disableInitialLoad : stubs.stub(),
	enableSingleRequest : stubs.stub(),
	enableAsyncRendering : stubs.stub(),
	setPublisherProvidedId : stubs.stub(),
	refresh : stubs.stub(),
	getCorrelator : stubs.stub(),
	getVideoStreamCorrelator : stubs.stub(),
	isAdRequestFinished : stubs.stub(),
	isSlotAPersistentRoadblock : stubs.stub(),
	collapseEmptyDivs : stubs.stub(),
	clear : stubs.stub(),
	clearNoRefreshState : stubs.stub(),
	clearSlotTargeting : stubs.stub(),
	setLocation : stubs.stub(),
	definePassback : stubs.stub(),
	enableSyncRendering : stubs.stub(),
	enableVideoAds : stubs.stub(),
	getVideoContent : stubs.stub(),
	noFetch : stubs.stub(),
	onGoogleAdsJsLoad : stubs.stub(),
	setTargeting : stubs.stub(),
	clearTargeting : stubs.stub(),
	setCategoryExclusion : stubs.stub(),
	clearCategoryExclusions : stubs.stub(),
	setVideoContent : stubs.stub(),
	videoRefresh : stubs.stub(),
	setCentering : stubs.stub(),
	clearTagForChildDirectedTreatment : stubs.stub(),
	isEnabled : stubs.stub(),
	enable : stubs.stub(),
	getSlots : stubs.stub(),
	getSlotIdMap : stubs.stub(),
	getAttributeKeys : stubs.stub(),
	addEventListener : stubs.stub(),
	updateCorrelator : stubs.stub()
};

var listener;

pubads.addEventListener = function(method, func){
	listener = func;
};

pubads.display = function(name){
	listener({test: 89});
};

googletag.pubads = stubs.stub().returns(pubads);

googletag.cmd =  googletag.cmd || [];
googletag.cmd.push = function(fn){
	if($.isFunction(fn)) {
		fn.call(googletag);
		googletag.cmd.shift();
	}
};

window.googletag = module.exports.mock = googletag;
module.exports.restore = function (){
	(stubs.fakes || []).forEach(function(fake) {
		if (typeof fake.reset === 'function') {
			fake.reset();
		}
	});
};

