/* jshint strict: false */

/*globals $,ok,equal,console,QUnit,initCookies,asyncTest,expect */

var FT = FT || {};
FT.test = FT.test || {};
FT.test.iframe = {};

FT.test.pollSpyObjectsCounter = 0;
FT.test.pollSpyMaximumCount = 10;
FT.test.pollSpyCountInterval = 30;

//define test spies
FT.test = FT.test || {};
FT.test.spyFacadeAddEncToLoc = {};
FT.test.spyFacadeTag = {};
FT.test.spyWindowJ07717DM_addEncToLoc = {};
FT.test.spyWindowJ07717DM_tag = {};

FT.test.pollAudSciObjectsCounter = 0;
FT.test.pollSciObjectsMaxCount = 15;
FT.test.pollSciObjectsInterval = 30;

var variants =  {
    "z89"  :   [
        {"name" : "AYSC", "type" : "cookie", "value" : "" },
        {"name" : "FTQA", "type" : "cookie", "value" : "integration;dfp_site=ftcom.5887.comment;dfp_zone=comment-index" }
    ],
    "z92"  :    [
        {"name": "AYSC", "type": "cookie", "value": "" },
        {"name": "FTQA", "type": "cookie", "value": "integration;dfp_site=ftcom.5887.world;dfp_zone=asia-pacific-india" }

    ],
    "z94" :    [
        {"name": "AYSC", "type": "cookie", "value": "" },
        {"name": "FTQA", "type": "cookie", "value": "integration;dfp_site=ftcom.5887.lex;dfp_zone=lex-index" }
    ],
    "z724" :    [
        {"name": "AYSC", "type": "cookie", "value": "" },
        {"name": "FTQA", "type": "cookie", "value": "integration;dfp_site=ftcom.5887.in-depth;dfp_zone=in-depth-wr-deal-makers" }
    ],
    "z97" :    [
        {"name": "AYSC", "type": "cookie", "value": "" },
        {"name": "FTQA", "type": "cookie", "value": "integration;dfp_site=ftcom.5887.management;dfp_zone=management-index" }
    ],
    "z158" :    [
        {"name": "AYSC", "type": "cookie", "value": "_22Ftemp_" },
        {"name": "FTQA", "type": "cookie", "value": "integration;dfp_site=ftcom.5887.alphaville;dfp_zone=alphaville-index" }
    ]

};

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
};

pollAudSciObjects();


function matchTags(obj) {

    var i, j, scriptTag, scriptTags = obj.scriptTags, regexp1 = new RegExp(obj.regexVal1), regexp2 = new RegExp(obj.regexVal2);

    for(i = 0, j = scriptTags.length; i < j; i++) {
    scriptTag = scriptTags[i];
    if (regexp1.test(scriptTag.src) && regexp2.test(scriptTag.src)) {
    return true;
    }
}
return false;

}

function adURLContainsSegment(pos) {

    var obj = {};

    obj.scriptTags = window.context.document.getElementById(pos).getElementsByTagName('script');
    obj.regexVal1 = "pos=" + pos;
    obj.regexVal2 = "a=([a-z])(\\d+);";

    return matchTags(obj);

}

function detectDownloadedScript() {

    var getStringRegex, obj = {};

    obj.scriptTags = window.context.document.getElementsByTagName('script');
    obj.regexVal1 = "pix04\\.revsci\\.net\\/J07717";
    //tests part of the GET string, specifically that the correct site and zone are passed to it.
    getStringRegex = "dfp_site%253D" + window.context.FT.env.dfp_site + "%2526dfp_zone%253D" + window.context.FT.env.dfp_zone + "%2526";
    obj.regexVal2 = getStringRegex.replace(".","\\\.");

    return matchTags(obj);
}

function audienceScienceAssertions() {

    ok(window.context.FT.env, "FT.env should be defined");
    ok(window.context.FT._ads.utils.cookies, "FT._ads.utils.cookies should be defined");
    equal(window.context.FT._ads.utils.cookies.FT_U, undefined, "FT.cookies.FT_U should be ");
    ok(window.context.FT.env.useDFP, "FT.env.useDFP should be set to true");
    ok(!window.context.FT.env.isLegacyAPI, "legacy API should not be used");
    ok(window.context.FT.ads.metadata.user(), "FT.ads.metadata.user() should be defined");

    equal(window.context.FT.test.spyFacadeAddEncToLoc.callCount,10,"Number of times facade addEncToLoc() function should be called");
    ok(window.context.FT.test.spyFacadeAddEncToLoc.calledWith('dfp_site',window.context.FT.env.dfp_site),"facade addEncToLoc() function called with dfp_site parameter");
    ok(window.context.FT.test.spyFacadeAddEncToLoc.calledWith('dfp_zone',window.context.FT.env.dfp_zone),"facade addEncToLoc() function called with dfp_zone parameter");

    if (document.cookie.match("_22Ftemp_")){  //SubsLevel should be set correctly according to the user grabbed from AYSC cookie
        ok(window.context.FT.test.spyFacadeAddEncToLoc.calledWith('SubsLevel','int'),"facade addEncToLoc() function called with SubsLevel int for internal");
    } else {
        ok(window.context.FT.test.spyFacadeAddEncToLoc.calledWith('SubsLevel','anon'),"facade addEncToLoc() function called with SubsLevel anon");
    }

    equal(window.context.FT.test.spyFacadeTag.callCount,1,"Number of times facade tag() function should be called.");

    equal(window.context.FT.test.spyWindowJ07717DM_addEncToLoc.callCount,11,"Number of times window.J07717.DM_addEncToLoc() function should be called");
    ok(window.context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith('dfp_site',window.context.FT.env.dfp_site),"window.J07717.DM_addEncToLoc() function called with dfp_site parameter");
    ok(window.context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith('dfp_zone',window.context.FT.env.dfp_zone),"window.J07717.DM_addEncToLoc() function called with dfp_zone parameter");
    equal(window.context.FT.test.spyWindowJ07717DM_tag.callCount,1,"Number of times window.J07717.DM_tag() function should be called.");

    ok(detectDownloadedScript(),"rev sci cookie generator script should be downloaded and have dfp_site and dfp_zone appended as part of GET string");
    ok(adURLContainsSegment('banlb'),"audience science segment should be present within the ad URL");

}

//have to wait to make sure objects are set up before running tests on spies
function pollSpyObjects () {

    window.context = FT.test.iframe.contentWindow;

    FT.test.pollSpyObjectsCounter ++;
    if ((typeof window.context.FT.test !== "undefined") && (typeof window.context.FT.test.spyFacadeAddEncToLoc !== "undefined") && (typeof window.context.FT.test.spyFacadeAddEncToLoc.calledWith !== "undefined") && (typeof window.context.FT.test.spyWindowJ07717DM_addEncToLoc !== "undefined") && (typeof window.context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith !== "undefined")) {
        QUnit.start();
        audienceScienceAssertions();
        QUnit.stop();
    } else if (FT.test.pollSpyObjectsCounter < FT.test.pollSpyMaximumCount) {
        setTimeout(pollSpyObjects, FT.test.pollSpyCountInterval);
    }

}

$(function() {

    var cookieValues, dataValues;
    FT.test.iframe = document.createElement('iframe');

    //initCookies(FT._ads.utils.cookie('FTQA'));

    FT.test.iframe.src = '../images/audiencescience-iframe.html';

    var initialLoad = true;
    $(FT.test.iframe).load(function (){
    if(!initialLoad) {
        FT.test.pollSpyObjectsCounter = 0;
        pollSpyObjects();
    } else {
        QUnit.start();
        initialLoad = false;
    }
});

for (var testSegment in variants) {
    asyncTest("Audience Science tests: " + testSegment, function (testSegment) {
        return function () {
            expect(17);
            var dataValues = '', k, testSeg = testSegment;
            for (k=0; k < variants[testSeg].length; k++ ) {
                dataValues += ' ' + variants[testSeg][k].name + ': ' + variants[testSeg][k].value;
                FT._ads.utils.cookie(variants[testSeg][k].name, variants[testSeg][k].value, {path: '/', domain: '.ft.com'});
            }

            console.log("Audience Science tests:" + testSeg + ' ' + dataValues);
            FT.test.iframe.contentDocument.location.reload(true);
        };
    }(testSegment));

cookieValues = '';
dataValues = "";
}


document.body.appendChild(FT.test.iframe);
});
