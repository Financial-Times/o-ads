"use strict";

var fn, googletag = window.googletag || {};

var stubs = googletag.sinon = sinon.sandbox.create();
//var stubs = sinon;
googletag.getEventLog = stubs.stub();
googletag.defineSizeMapping = stubs.stub();
googletag.display = stubs.stub();
googletag.enableServices = stubs.stub();
googletag.companionAds = stubs.stub();
googletag.content = stubs.stub();
googletag.disablePublisherConsole = stubs.stub();
googletag.sizeMapping = stubs.stub();
googletag.getVersion = stubs.stub();
var gptSlot = {
     addService: stubs.stub(),
     setCollapseEmptyDiv: stubs.stub(),
     renderEnded: stubs.stub(),
     setTargeting: stubs.stub(),
     defineSizeMapping: stubs.stub(),
     set: stubs.stub()
};

googletag.defineUnit = stubs.stub().returns(gptSlot);
googletag.defineSlot = stubs.stub().returns(gptSlot);
googletag.defineOutOfPageSlot = stubs.stub().returns(gptSlot);

googletag.sizeMapping = stubs.stub().returns({
  addSize: stubs.stub(),
  build: stubs.stub()
});


googletag.pubads = stubs.stub().returns({
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
    forceExperiment : stubs.stub(),
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
    display : stubs.stub(),
    getSlots : stubs.stub(),
    getSlotIdMap : stubs.stub(),
    getAttributeKeys : stubs.stub(),
    addEventListener : stubs.stub(),
    updateCorrelator : stubs.stub()
});


googletag.cmd =  googletag.cmd || [];

googletag.cmd.push = function(fn){
    if($.isFunction(fn)) {
        fn.call(googletag);
    }
};

stubs.cmdPush = sinon.spy(googletag.cmd, 'push');

while (fn = googletag.cmd.pop()) {
    if($.isFunction(fn)) {
        fn.call(googletag)
    }
}
