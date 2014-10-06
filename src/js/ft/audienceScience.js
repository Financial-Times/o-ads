/*new Revenue Science data capture
 *  modified by rbeltran 2008/12/10 03:00:26
 *   added position, responsibility,industry, counrty & comp. size
 */

FT.analytics.audSciPollCount = 0;
FT.analytics.maxAudSciPollCount = 10;
FT.analytics.audSciPollCountInterval = 30; //milliseconds

FT.analytics.populateAudSci = function () {
    var rsiAYSC = document.cookie.match(/AYSC=([^;]*)/) ? RegExp.$1 : "", rsiPos = rsiAYSC.match(/_07([^_]*)/) ? RegExp.$1 : null, rsiResp = rsiAYSC.match(/_06([^_]*)/) ? RegExp.$1 : null, rsiInd = rsiAYSC.match(/_05([^_]*)/) ? RegExp.$1 : null, rsiCoun = rsiAYSC.match(/_14([^_]*)/) ? RegExp.$1 : null, rsiCompSize = rsiAYSC.match(/_19([^_]*)/) ? RegExp.$1 : null, temppos = typeof rsiPos !== "undefined" ? rsiPos : "undefined", tempresp = typeof rsiResp !== "undefined" ? rsiResp : "undefined", tempind = typeof rsiInd !== "undefined" ? rsiInd : "undefined", tempcountry = typeof rsiCoun !== "undefined" ? rsiCoun : "undefined", tempcompsize = typeof rsiCompSize !== "undefined" ? rsiCompSize : "undefined", rsi_call = "<script type=\"text\/javascript\">", tempsec = typeof FTSection !== "undefined" ? FTSection : "undefined", temppage = typeof FTPage !== "undefined" ? FTPage : "undefined";
    FT.analytics.audienceScience.addEncToLoc("FTSectionCode", tempsec);
    FT.analytics.audienceScience.addEncToLoc("FTPageCode", temppage);
    FT.analytics.audienceScience.addEncToLoc("FTP", temppos);
    FT.analytics.audienceScience.addEncToLoc("FTR", tempresp);
    FT.analytics.audienceScience.addEncToLoc("FTI", tempind);
    FT.analytics.audienceScience.addEncToLoc("FTC", tempcountry);
    FT.analytics.audienceScience.addEncToLoc("FTCS", tempcompsize);
    FT.analytics.audienceScience.addEncToLoc("SubsLevel", FT.ads.metadata.user().subscription_level || "anon");
    if (FT && FT.env && FT.env.dfp_site && FT.env.dfp_zone) {
        FT.analytics.audienceScience.addEncToLoc('dfp_site', FT.env.dfp_site);
        FT.analytics.audienceScience.addEncToLoc('dfp_zone', FT.env.dfp_zone);
    }
    FT.analytics.audienceScience.tag();
};
//we repeatedly poll for the  existence of the global objects downloaded by the
//js.revsci.net/gateway/gw.js to overcome race condition
FT.analytics.pollAudSci = function() {
    FT.analytics.audSciPollCount ++;
    if ((typeof DM_addEncToLoc !== "undefined") && (typeof FT.analytics.audienceScience !== "undefined")) {
        //ok, global objects present - now we can call the facade methods and then call the tag
        FT.analytics.populateAudSci();
    }
    else if (FT.analytics.audSciPollCount < FT.analytics.maxAudSciPollCount) {
        //count limit not reached yet, so poll after timeout
        setTimeout(FT.analytics.pollAudSci,FT.analytics.audSciPollCountInterval);
    }
};

//call the polling function
FT.analytics.pollAudSci();