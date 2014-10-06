(function (win, doc, undefined) {
    "use strict";
    var Metadata = {};

    Metadata.getLoginInfo = function () {
        var loggedIn = false,
        eid = FT._ads.utils.getCookieParam('FT_U', 'EID') || null,
        remember = FT._ads.utils.cookie('FT_Remember');

        //TODO fix the utils hash method to not error when undefined is passed
        // then we can get rid of the test for the split method
        if (!eid && remember && FT._ads.utils.isFunction(remember.split)) {
            remember = remember.split(':');
            eid = !!(remember[0].length) ? remember[0] : eid;
        }

        if (eid || FT._ads.utils.cookie('FTSession')) {
            loggedIn = true;
        }

        return {eid: eid, loggedIn: loggedIn};
    };

    Metadata.getAyscVars = function(obj){
        var subsLevelReplaceLookup = {
            'edt': { '22': /^edit$/, '97': /^.*/ },
            'int': { '22': /^Ftemp$/, '97': /^.*/ },
            'cor': { '22': /^[N]*[PL][01][PL]*[1]*[PL][12][A-Za-z][A-Za-z]/, '97': /^c$/ },
            'lv1': { '22': /^[PL]*[0]*[PL]1[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
            'lv2': { '22': /^[N]*[PL]*[0]*[PL]2[A-Za-z][A-Za-z]/, '97': /^[^c]$/ },
            'reg': { '22': /^[PL]0[A-Za-z][A-Za-z]/, '97': /^[^c]$/ }
        },
        regex_key_names = ['22', '97'],
        leading_zero_key_names = [ '19', '21' ],
        substr_key_names = ['24=0=3=cn'];

        function fieldSubstr(SubStrKeyNames, obj) {
            var i, value;
            for(i=0; i < SubStrKeyNames.length; i++){
                value = FT._ads.utils.isString(obj) ? obj.charAt(i) : obj[i];
                if (value === false) {
                    continue;
                }
                else{
                    var SubStrItems = SubStrKeyNames[i].split("="),
                    ayscField = SubStrItems[0],
                    val = obj[ayscField],
                    newField;
                    if (val !== undefined) {
                        newField = SubStrItems[3];
                        obj[newField] = val.substring(SubStrItems[1], SubStrItems[2]);
                    }
                }
                return obj;
            }
        }

        function detectERights(obj) {
            if (FT._ads.utils.cookie("FT_U")) {
                var erights = FT._ads.utils.cookie("FT_U").split("="),
                keyname = erights[0],
                val = erights[1];
                if ((keyname !== undefined) && (val === undefined)) {
                    obj[keyname] = val;
                }
            }
            return obj;
        }

        function stripLeadingZeros(KeysToStrip, obj) {
            var idx, l;
            for (idx = 0, l = KeysToStrip.length; idx < l; idx++) {
                if (obj[KeysToStrip[idx]]) {
                    obj[KeysToStrip[idx]] = obj[KeysToStrip[idx]].replace(/^0+/, "");
                }
            }
            return obj;
        }

        function fieldRegex(RegexKeyNames, obj) {
            var prop;
            function innerReplace(keyName, property) {
                var value = obj[keyName];
                if (value === undefined) {
                    return;
                } else if ((myState !== "failed") && (value.match(property[keyName]))) {
                    myState = "passed";
                } else {
                    myState = "failed";
                    return;
                }
            }

            for(prop in subsLevelReplaceLookup){
                var myState = "initial";
                if (subsLevelReplaceLookup.hasOwnProperty(prop)) {
                    for(var i=0;i<RegexKeyNames.length;i++){
                        innerReplace(RegexKeyNames[i], subsLevelReplaceLookup[prop]);
                    }

                    if (myState === "passed") {
                        obj.slv = prop;
                    }
                }
            }
          return obj;
        }

        function prepareAdVars(AllVars) {
              //now we filter the AYSC values prior to adding them to the baseAdvert
              //define fields where we need to strip leading zeros - should be in config
              AllVars = stripLeadingZeros(leading_zero_key_names, AllVars);
              //now assign new corporate codes based on certain regex of old code values
              AllVars = fieldRegex(regex_key_names, AllVars);
              //now take a substring of an input value - used for creating new continent codes - put in config?
              AllVars = fieldSubstr(substr_key_names, AllVars);
              //now add any erights value from the FT_U cookie
              AllVars = detectERights(AllVars);
              return AllVars;
        }



        var out = {},
        item, q;
        if (FT._ads.utils.cookie("AYSC")) {
            q = FT._ads.utils.cookie("AYSC").split("_");

            for (var i = 0, j = q.length; i < j; i++) {
                item = q.pop();
                if (!!item) {
                    var key, val,
                    m = item.match(/^(\d\d)([^_]+)/);

                    if (m) {
                        key = m[1];
                        val = m[2];
                        out[key] = val;
                    }
                }
            }
        }

        var x = prepareAdVars(out);
        return FT._ads.utils.extend({}, obj, x);
    };


/**
 * getEid derives the eid of the current user first from the FT_U cookie then
 * the FT_Remember cookie if FT_U is unset. An object with the key eid and the derived eid value is
 * returned, if no value is availble null will be returned as the object value
 * @name fetchEid
 * @memberof Targeting
 * @lends Targeting
*/

    Metadata.user= function () {
        var ayscProp, ayscVal,
        asyc = this.getAyscVars({}),
        result = {},
        valueFilter = /(PVT)|(x+)/i,
        loginInfo = this.getLoginInfo(),
        ayscProps = {
            homepage_edition: '28',
            corporate_access_id_code: '27',
            phone_area_code: '26',
            continent: '24',
            subscription_level: 'slv',
            active_personal_investor: '20',
            company_size: '19',
            post_code: '12',
            job_position: '07',
            job_responsibility: '06',
            industry: '05',
            state: '04',
            gender: '02',
            DB_company_size: '40',
            DB_industry: '41',
            DB_company_turnover: '42',
            cameo_country_code: '43',
            cameo_local_code: '44',
            DB_country_code: '45',
            cameo_investor_code: '46',
            cameo_property_code: '51'
        };

        for (ayscProp in ayscProps) {
            ayscVal = asyc[ayscProps[ayscProp]];
            if (ayscVal && !(valueFilter.test(ayscVal))) {
                result[ayscProp] = ayscVal;
            }
        }

        result.eid = loginInfo.eid;
        result.loggedIn = loginInfo.loggedIn;
        return result;
    };

    Metadata.page = function(){
        var result = {};
        result.uuid = window.pageUUID ? window.pageUUID :
                      FT._ads.utils.isFunction(window.getUUIDFromString) ? getUUIDFromString(document.location.href) : undefined;
        result.auuid = window.articleUUID || undefined;
        result.dfpSite = FT.ads.config('dfp_site');
        result.dfpZone = FT.ads.config('dfp_zone');
        if (FT._ads.utils.isNonEmptyString(window.siteMapTerm)) {result.siteMapTerm = window.siteMapTerm;}
        if (FT._ads.utils.isNonEmptyString(window.navEdition)) {result.navEdition = window.navEdition;}
        if (FT._ads.utils.isNonEmptyString(window.brandName)) {result.brandName = window.brandName;}
        if (FT._ads.utils.isNonEmptyString(window.primaryThemeName)) {result.primaryThemeName = window.primaryThemeName;}
        return result;
    };

    FT._ads.utils.extend(FT.ads, {metadata:  Metadata});
}(window, document));
