(function (window, document) {
    "use strict";

    var fn, googletag = window.googletag || {};
    //googletag = {};
    googletag.getEventLog = sinon.stub();
    googletag.defineOutOfPageSlot = sinon.stub();
    googletag.defineSlot = sinon.stub();
    googletag.defineUnit = sinon.stub();
    googletag.defineSizeMapping = sinon.stub();
    googletag.display = sinon.stub();
    googletag.enableServices = sinon.stub();
    googletag.companionAds = sinon.stub();
    googletag.content = sinon.stub();
    googletag.disablePublisherConsole = sinon.stub();
    googletag.sizeMapping = sinon.stub();
    googletag.getVersion = sinon.stub();


    googletag.defineSlot = sinon.stub().returns({
         addService: sinon.stub(),
         setCollapseEmptyDiv: sinon.stub(),
         renderEnded: sinon.stub(),
         setTargeting: sinon.stub(),
         defineSizeMapping: sinon.stub()
    });

   googletag.sizeMapping = sinon.stub().returns({
      addSize: sinon.stub(),
      build: sinon.stub()
   });


    googletag.pubads = sinon.stub().returns({
        getName : sinon.stub(),
        fillSlot : sinon.stub(),
        setCookieOptions : sinon.stub(),
        setTagForChildDirectedTreatment : sinon.stub(),
        disableInitialLoad : sinon.stub(),
        enableSingleRequest : sinon.stub(),
        enableAsyncRendering : sinon.stub(),
        setPublisherProvidedId : sinon.stub(),
        refresh : sinon.stub(),
        getCorrelator : sinon.stub(),
        getVideoStreamCorrelator : sinon.stub(),
        isAdRequestFinished : sinon.stub(),
        isSlotAPersistentRoadblock : sinon.stub(),
        collapseEmptyDivs : sinon.stub(),
        clear : sinon.stub(),
        clearNoRefreshState : sinon.stub(),
        clearSlotTargeting : sinon.stub(),
        setLocation : sinon.stub(),
        definePassback : sinon.stub(),
        enableSyncRendering : sinon.stub(),
        enableVideoAds : sinon.stub(),
        forceExperiment : sinon.stub(),
        getVideoContent : sinon.stub(),
        noFetch : sinon.stub(),
        onGoogleAdsJsLoad : sinon.stub(),
        setTargeting : sinon.stub(),
        clearTargeting : sinon.stub(),
        setCategoryExclusion : sinon.stub(),
        clearCategoryExclusions : sinon.stub(),
        setVideoContent : sinon.stub(),
        videoRefresh : sinon.stub(),
        setCentering : sinon.stub(),
        clearTagForChildDirectedTreatment : sinon.stub(),
        isEnabled : sinon.stub(),
        enable : sinon.stub(),
        display : sinon.stub(),
        getSlots : sinon.stub(),
        getSlotIdMap : sinon.stub(),
        getAttributeKeys : sinon.stub()
    });

    googletag.cmd =  googletag.cmd || [];

    googletag.cmd.push = function(fn){
        if($.isFunction(fn)) {
            fn.call(googletag);
        }
    };

    while (fn = googletag.cmd.pop()) {
        if($.isFunction(fn)) {
            fn.call(googletag)
        }
    }

}(window, document))
