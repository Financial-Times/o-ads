
var Tests = {
    'intro': TestMockAd.intro,
    'banlb': TestMockAd.banlb3,
    'newssubs': TestMockAd.newssubs2,
    'tlbxrib': TestMockAd.tlbxrib,
    'mktsdata': TestMockAd.mktsdata,
    'hlfmpu': TestMockAd.hlfmpu,
    'doublet': TestMockAd.doublet,
    'refresh': TestMockAd.refresh
};

var testSegment, pollSpyObjectsCounter = 0, pollSpyMaximumCount = 10, pollSpyCountInterval = 30;

FT.ads.initDFP();
//now we find what test mode we are in and either call DFP (Integration) or Mock the ad call (unit)
testMode = unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

function matchTags(obj) {

    var i, j, scriptTags = obj.scriptTags, regexp1 = new RegExp(obj.regexVal1), regexp2 = new RegExp(obj.regexVal2);

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

obj.scriptTags = context.document.getElementById(pos).getElementsByTagName('script');
obj.regexVal1 = "pos=" + pos;
obj.regexVal2 = "a=z(\\d+);";

return matchTags(obj);

}

function detectDownloadedScript() {

    var getStringRegex, obj = {};

obj.scriptTags = context.document.getElementsByTagName('script');
obj.regexVal1 = "pix04\\.revsci\\.net\\/J07717";
//tests part of the GET string, specifically that the correct site and zone are passed to it.
getStringRegex = "dfp_site%253D" + context.FT.env.dfp_site + "%2526dfp_zone%253D" + context.FT.env.dfp_zone + "%2526";
obj.regexVal2 = getStringRegex.replace(".","\\\.");

return matchTags(obj);
}

function audienceScienceAssertions(seg) {

    if (testMode === 'unit'){
        //if unit test, then we override FT.lib.writeScript with the call to Mocking
        FT._ads.utils.writeScript = function (URL){
            mockAdContent(URL, Tests); // Ads injected immediately
        };
    }

    ok(context.FT.env, "FT.env should be defined");
    ok(context.FT._ads.utils.cookies, "FT._ads.utils.cookies should be defined");
    equal(context.FT._ads.utils.cookies.FT_U, undefined, "FT.cookies.FT_U should be ");
    ok(context.FT.env.useDFP, "FT.env.useDFP should be set to true");
    ok(!context.FT.env.isLegacyAPI, "legacy API should not be used");

    equal(context.FT.test.spyFacadeAddEncToLoc.callCount,9,"Number of times facade addEncToLoc() function should be called");
    ok(context.FT.test.spyFacadeAddEncToLoc.calledWith('dfp_site',context.FT.env.dfp_site),"facade addEncToLoc() function called with dfp_site parameter");
    ok(context.FT.test.spyFacadeAddEncToLoc.calledWith('dfp_zone',context.FT.env.dfp_zone),"facade addEncToLoc() function called with dfp_zone parameter");
    equal(context.FT.test.spyFacadeTag.callCount,1,"Number of times facade tag() function should be called.");

    equal(context.FT.test.spyWindowJ07717DM_addEncToLoc.callCount,10,"Number of times window.J07717.DM_addEncToLoc() function should be called");
    ok(context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith('dfp_site',context.FT.env.dfp_site),"window.J07717.DM_addEncToLoc() function called with dfp_site parameter");
    ok(context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith('dfp_zone',context.FT.env.dfp_zone),"window.J07717.DM_addEncToLoc() function called with dfp_zone parameter");
    equal(context.FT.test.spyWindowJ07717DM_tag.callCount,1,"Number of times window.J07717.DM_tag() function should be called.");

    ok(detectDownloadedScript(),"rev sci cookie generator script should be downloaded and have dfp_site and dfp_zone appended as part of GET string");
    ok(adURLContainsSegment('banlb'),"audience science segment should be present within the ad URL");

}

//have to wait to make sure objects are set up before running tests on spies
function pollSpyObjects () {

    window.context = iframe.contentWindow;

    pollSpyObjectsCounter ++;
    if ((typeof context.FT.test !== "undefined")
        && (typeof context.FT.test.spyFacadeAddEncToLoc !== "undefined")
            && (typeof context.FT.test.spyFacadeAddEncToLoc.calledWith !== "undefined")
                && (typeof context.FT.test.spyWindowJ07717DM_addEncToLoc !== "undefined")
                    && (typeof context.FT.test.spyWindowJ07717DM_addEncToLoc.calledWith !== "undefined")

        ) {
        QUnit.start();
        audienceScienceAssertions(testSeg);
        QUnit.stop();
    } else if (pollSpyObjectsCounter < pollSpyMaximumCount) {
        setTimeout(pollSpyObjects, pollSpyCountInterval);
    }

}

$(function() {
    iframe = document.createElement('iframe');

    initCookies(FT._ads.utils.cookie('FTQA'));
    var i, j, cookies, cookie, cookieValues, dataValues,
    iframeSrc = location.href.split('/');

    iframe.src = '../images/audiencescience-iframe.html';

    var initialLoad = true;
    $(iframe).load(function (){
    if(!initialLoad) {
        //QUnit.start();
        //audienceScienceAssertions(testSeg);
        pollSpyObjectsCounter = 0;
        pollSpyObjects();
        //QUnit.stop();
    } else {
        QUnit.start();
        initialLoad = false;
    }
});

for (testSegment in variants) {
    asyncTest("Audience Science tests: " + testSegment, function (testSegment) {
        return function () {
            expect(15);
            var dataValues = '';
            testSeg = testSegment;
            for (k=0; k < variants[testSeg].length; k++ ) {
                dataValues += ' ' + variants[testSeg][k].name + ': ' + variants[testSeg][k].value;
                FT._ads.utils.cookie(variants[testSeg][k].name, variants[testSeg][k].value, {path: '/', domain: '.ft.com'});
            }

            console.log("Audience Science tests:" + testSeg + ' ' + dataValues);
            iframe.contentDocument.location.reload(true);
        }
    }(testSegment));

cookieValues = '';
dataValues = "";
}


document.body.appendChild(iframe);
});
