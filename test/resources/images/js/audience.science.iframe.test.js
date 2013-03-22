/* jshint strict: false */

/*globals sinon */

//define test spies
var FT = FT || {};
FT.test = FT.test || {};
FT.test.spyFacadeAddEncToLoc = {};
FT.test.spyFacadeTag = {};
FT.test.spyWindowJ07717DM_addEncToLoc = {};
FT.test.spyWindowJ07717DM_tag = {};

FT.test.pollAudSciObjectsCounter = 0;
FT.test.pollSciObjectsMaxCount = 15;
FT.test.pollSciObjectsInterval = 30;

function pollAudSciObjects () {
    FT.test.pollAudSciObjectsCounter ++;
    //have to wait to make sure objects are set up before setting up spies
    if ((typeof window.J07717 !== "undefined") && (typeof FT.analytics.audienceScience !== "undefined")) {

        FT.test.spyFacadeAddEncToLoc = sinon.spy(FT.analytics.audienceScience, "addEncToLoc");
        FT.test.spyFacadeTag = sinon.spy(FT.analytics.audienceScience, "tag");
        FT.test.spyWindowJ07717DM_addEncToLoc = sinon.spy(window.J07717,"DM_addEncToLoc");
        FT.test.spyWindowJ07717DM_tag = sinon.spy(window.J07717,"DM_tag");
    }

    else if (FT.test.pollAudSciObjectsCounter < FT.test.pollSciObjectsMaxCount) {
        //count limit not reached yet, so poll after timeout
        setTimeout(pollAudSciObjects,FT.test.pollSciObjectsInterval);
    }
}

pollAudSciObjects();