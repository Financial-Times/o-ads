(function (window, document, $, undefined) {
    function runTests() {
        module('Third party targeting');
        test('fetchAudSci', function () {
            expect(4);
            TEST.beginNewPage({
                config: {audSci: true},
                cookies: {
                    "rsi_segs" : "J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645"
                }
            });

            var result = FT.ads.targeting();
            strictEqual(typeof result, "object", "result is an object");
            deepEqual(result.a, ["z89", "z236", "z288", "z295", "z299", "z369", "z555", "z545", "z633", "z644", "z645"], "No audSciLimit set");

            FT.ads.config("audSciLimit", 2);
            result = FT.ads.targeting();
            strictEqual(typeof result, "object", "result is an object");
            deepEqual(result.a, ['z89', 'z236'], "While the audSciLimit is 2, there should be only two segments in the results");

        });

        test('getFromConfig', function () {
            TEST.beginNewPage({config: {}});
            var result = FT.ads.targeting();
            deepEqual(result, {}, 'No dfp_targeting returns no targetting params');

            FT.ads.config('dfp_targeting', '');
            var result = FT.ads.targeting();
            deepEqual(result, {}, 'Empty string dfp_targeting returns null');

            FT.ads.config('dfp_targeting', 'some=test;targeting=params');
            var result = FT.ads.targeting();
            deepEqual(result, {some: 'test', targeting: 'params'}, 'Simple params are parsed correctly');

            FT.ads.config('dfp_targeting', 'some=test;;targeting=params');
            var result = FT.ads.targeting();

            deepEqual(result, {some: 'test', targeting: 'params'}, 'Double semi-colons still parse correctly');

            FT.ads.config('dfp_targeting', 'some=test;  ;targeting=params;for=gpt');
            var result = FT.ads.targeting();

            deepEqual(result, {some: 'test', targeting: 'params', 'for': 'gpt'}, 'Double semi-colons with spaces still parse correctly');

            FT.ads.config('dfp_targeting', 's@me=test;;targeting=par@ms$\'');
            var result = FT.ads.targeting();

            deepEqual(result, {'s@me': 'test', targeting: 'par@ms$\''}, 'Special characters parse correctly');

        });

        test('Krux', function () {
            TEST.beginNewPage({config: { krux: true } });
            var result = FT.ads.targeting();
            strictEqual( $.type(Krux), "function", "Krux is a function.");

            if (FT._ads.utils.isStorage(window.localStorage)) {
                TEST.beginNewPage({config: { cookieConsent: false, krux: true, timestamp: false}, localStorage: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
                var result = FT.ads.targeting();
                deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "krux segments in localStorage returned correctly");
                equal(result.kuid, 'kxuser', "krux user id returned correctly from localStorage");
                equal(result.khost, encodeURIComponent(location.hostname), "krux host returned correctly");
                equal(result.bht, "true", "Behavioural flag is set, when local storage is used");

            } else {
                ok(true, 'localstorage unavailable in this browser')
            }

            TEST.beginNewPage({config: { krux: true}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.targeting();
            deepEqual(result.ksg, ["seg1", "seg2", "seg3", "seg4"], "krux returns segments from cookies");
            equal(result.kuid, 'kxuser', "krux user id returned correctly  from cookies");
            equal(result.khost, encodeURIComponent(location.hostname), "krux host returned correctly");
            equal(result.bht, "true", "Behavioural flag is set, when cookies are used");

            TEST.beginNewPage({config: { krux: true, kruxLimit: 2}, cookies: { kxsegs: 'seg1,seg2,seg3,seg4', kxuser: 'kxuser'}});
            var result = FT.ads.targeting();
            deepEqual(result.ksg, ["seg1", "seg2"], "krux returns 2 segments");
        });

        test('cookieConsent', function () {

            TEST.beginNewPage({
                config: {cookieConsent: true},
                cookies: { cookieconsent: 'accepted'}
            });
            var result = FT.ads.targeting();
            equal(result.cc, 'y', 'Cookie consent accepted is reported');

            TEST.beginNewPage({
                config: { cookieConsent: true },
                cookies: {}
            });
            var result = FT.ads.targeting();
            equal(result.cc, 'n', 'Cookie consent not accepted is reported');
        });

        test('encodedIP', function (){

            TEST.beginNewPage({cookies: { FTUserTrack : "203.190.72.182.1344916650137365"}});
            var result = FT.ads.targeting();
            equal(result.loc, 'cadzbjazhczbic', "complete FTUserTrack information");

            TEST.beginNewPage({cookies: { FTUserTrack : "203.190.72.182"}});
            var result = FT.ads.targeting();
            equal(result.loc, 'cadzbjazhczbic', "203.190.72.182 - incomplete FTUserTrack information");

            TEST.beginNewPage({cookies: { FTUserTrack : "203.190.72."}});
            var result = FT.ads.targeting();
            equal(result.loc,'cadzbjazhcz', "203.190.72. - incomplete FTUserTrack information");

            TEST.beginNewPage({cookies: { FTUserTrack : "203.190.72.182.aaaaa"}});
            var result = FT.ads.targeting();
            equal(result.loc,'cadzbjazhczbic', "203.190.72.182.aaaaa - incomplete FTUserTrack information");

        });

        test("social referrer", function () {
            var result;
            TEST.beginNewPage({referrer: "", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            deepEqual(result, {}, "No document referrer, return no targeting params");
            equal(result.socref, undefined, "No document referrer, socref key returns undefined");

            TEST.beginNewPage({referrer: "http://t.co/cjPOFshzk2", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "twi", "Already logged in, twitter should be mapped from t.co to twi");

            TEST.beginNewPage({referrer: "http://www.facebook.com/l.php?", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "fac", "Already logged in, facebook should be mapped from facebook.com to fac");

            TEST.beginNewPage({referrer: "http://www.linkedin.com/company/4697?trk=NUS-body-company-name", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "lin", "Already logged in, linkedin should be mapped from linkedin.com to lin");

            TEST.beginNewPage({referrer: "http://www.drudgereport.com/", config: {  socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "dru", "Already logged in, drudge should be mapped from drudgereport.com to dru");

            TEST.beginNewPage({referrer: "http://www.ft.com/cms/s/ed72d2ac-cf4e-11e2-be7b-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fed72d2ac-cf4e-11e2-be7b-00144feab7de.html&_i_referer=http%3A%2F%2Ft.co%2F9So3Xw9qFH", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "twi", "via login, twitter should be mapped from t.co to twi");


            TEST.beginNewPage({referrer: "http://www.ft.com/cms/s/cece477a-ceca-11e2-8e16-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Fcece477a-ceca-11e2-8e16-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.facebook.com%2Fl.php%3Fu%3Dhttp%253A%252F%252Fon.ft.com%252FZSTiyP%26h%3DLAQGl0DzT%26s%3D1", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "fac", "Via login, facebook should be mapped from facebook.com to fac");

            TEST.beginNewPage({referrer: "http://www.ft.com/cms/s/af925250-c765-11e2-9c52-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Faf925250-c765-11e2-9c52-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.linkedin.com%2Fcompany%2F4697%3Ftrk%3DNUS-body-company-name", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "lin", "Via login, linkedin should be mapped from linkedin.com to lin");

            TEST.beginNewPage({referrer: "http://www.ft.com/cms/s/af925250-c765-11e2-9c52-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Faf925250-c765-11e2-9c52-00144feab7de.html&_i_referer=http%3A%2F%2Fwww.drudgereport.com%2F", config: { socialReferrer: true }});
            result = FT.ads.targeting();
            equal(result.socref, "dru", "Via login, drudge should be mapped from drudgereport.com to dru");
        });

        test('Page referrer', function () {
            var result;

            TEST.beginNewPage({ referrer: '', config: { pageReferrer: true }});
            result = FT.ads.targeting();
            deepEqual(result, {}, "with no referrer no targetting param is added");
            equal(result.rf, undefined, "calling rf returns undefined");

            TEST.beginNewPage({referrer: 'http://www.example.com/some/page?some=param', config: {  pageReferrer: true }});
            result = FT.ads.targeting();
            equal(result.rf, 'some/page?some=param', "referrer is returned without domain");
        });


        test("AYSC", function () {
            var result;
            TEST.beginNewPage({cookies: {AYSC : "_011967_02M_04greater%2520london_05ITT_06TEC_07MA_12SE19HL_13GBR_14GBR_15UK_17london_18london_190500_20n_2112_22P0P2Tools_24europe_25PVT_26PVT_273f5a2e_40forty_41fortyone_42fortytwo_43fortythree_44fortyfour_45fortyfive_46fortysix_47fortyseven_48fortyeight_49fortynine_50fifty_51fiftyone_52fiftytwo_53fiftythree_54fiftyfour_55fiftyfive_56fiftysix_57fiftyseven_58fiftyeight_59fiftynine_60sixty_"}});
            result = FT.ads.targeting();
            deepEqual(result, {'14': "gbr", '19': "500", '20': "n", '21': "12", '27': "3f5a2e", '40': "forty", '41': "fortyone", '42': "fortytwo", '43': "fortythree", '44': "fortyfour", '45': "fortyfive", '46': "fortysix", '47': "fortyseven", 48: "fortyeight", 49: "fortynine", '50': "fifty", '51': "fiftyone", '52': "fiftytwo", '53': "fiftythree", '54': "fiftyfour", '55': "fiftyfive", '56': "fiftysix", '57': "fiftyseven", '58': "fiftyeight", '59': "fiftynine", '60': "sixty", '07': "ma", '06': "tec", '05': "itt", '02': "m", '01': "1967", slv: "lv2", cn: "eur"}, "AYSC values are returned correctly.");
            var result;
            TEST.beginNewPage({cookies: {AYSC : "_01_02X_04greater%2Blondon_05MAP_06TEC_07TS_12_13GBR_14GBR_15gb_17london_18islington_19xxxx_20x_22P0P2Tools_24europe_25PVT_26PVT_27PVT_96PVT_97_98PVT_"}});
            result = FT.ads.targeting();
            deepEqual(result, {"05": "map","06": "tec","07": "ts","14": "gbr","cn": "eur","slv": "lv2"}, "AYSC values are returned correctly; using 'real' aysc values");
        });

        test("search term", function () {
            var result;

            TEST.beginNewPage({querystring: 'q=  this  is  ', config: { cookieConsent: false, timestamp: false},});
            result = FT.ads.targeting();
            equal(result.kw, "this is", "excess space removed");

            TEST.beginNewPage({querystring: 'q=  this  is  '});
            result = FT.ads.targeting('  THIS  IS  ');
            equal(result.kw, "this is", "lowercased");

            TEST.beginNewPage({querystring: "q= ^ this+is 'it' ; "});
            result = FT.ads.targeting();
            equal(result.kw, "this is it", "DFP restricted characters removed");

            TEST.beginNewPage({querystring: "q= %5E this%2Bis %27it%27 %3B %20 "});
            result = FT.ads.targeting();
            equal(result.kw, "this is it", "DFP restricted characters removed even if escaped");

            TEST.beginNewPage({querystring: "q=  this.is%2Eit"});
            result = FT.ads.targeting();
            equal(result.kw, "this.is.it", "full-stop escaped as it means something to DFP");

            TEST.beginNewPage({querystring: "q=`!" + '"' + "_%26$%^*_()_+-_={}[]_:@~ '_#<>?,_./|\\"});
            result = FT.ads.targeting();
            equal(result.kw, "`!\"_&$% *_()_ -_={}[]_:@~ _#<>?,_./|\\", "remaining punctuation encoded");

            TEST.beginNewPage({querystring: "q=uk:PSON"});
            result = FT.ads.targeting();
            equal(result.kw, "uk:pson", "uk:PSON from tearsheet");

            TEST.beginNewPage({querystring: "q=PSON.GB%3APLU"});
            result = FT.ads.targeting();
            equal(result.kw, "pson.gb:plu", "PSON.GB:PLU from tearsheet");

            TEST.beginNewPage({querystring: ""});
            result = FT.ads.targeting();
            equal(result.kw, undefined, "no query string, kw param should be undefined");

            TEST.beginNewPage({querystring: "searchField=power%20my%20world&null=&termId="});
            result = FT.ads.targeting();
            equal(result.kw, "power my world", "lexicon: searchField in URL");

            TEST.beginNewPage({querystring: "q=rock+my+world"});
            result = FT.ads.targeting();
            equal(result.kw, "rock my world", "alphaville: q in URL");

            TEST.beginNewPage({querystring: "s=uk:PSON"});
            result = FT.ads.targeting()
            equal(result.kw, "uk:pson", "tearsheet uk:PSON: query in URL");

            TEST.beginNewPage({querystring: "s=PSON.GB%3APLU&vsc_appId=ts&ftsite=FTCOM&searchtype=equity"});
            result = FT.ads.targeting();
            equal(result.kw, "pson.gb:plu", "tearsheet PSON.GB:PLU: query in URL");

            TEST.beginNewPage({querystring: "s=PSON%3ALSE&vsc_appId=ts&ftsite=FTCOM&searchtype=equity"});
            result = FT.ads.targeting();
            equal(result.kw, "pson:lse", "tearsheet PSON:LSE: query in URL");

            TEST.beginNewPage({querystring: "view=company&time=123837238384&selectedResultGroup=&query=pearson&country=&issueType="});
            result = FT.ads.targeting();
            equal(result.kw, "pearson", "search on markets quoted string: query in URL");

            TEST.beginNewPage({querystring: "query=rock%20my%20world"});
            result = FT.ads.targeting();
            equal(result.kw, "rock my world", "search on markets quoted string: query in URL");

            TEST.beginNewPage({querystring: "queryText=rock+my+world&x=0&y=0&aje=true&dse=&dsz="});
            result = FT.ads.targeting();
            equal(result.kw, "rock my world", "search from articles/video: queryText in URL");

            TEST.beginNewPage({querystring: "queryText=rock+my+world&ftsearchType=type_news"});
            result = FT.ads.targeting();
            equal(result.kw, "rock my world", "search from home page, etc: queryText in URL");

            TEST.beginNewPage({querystring: "queryText=rock+my+world"});
            result = FT.ads.targeting();
            equal(result.kw, "rock my world", "search: queryText in URL");
        });

        test("timestamp", function () {
            TEST.beginNewPage({ config: { timestamp: true }, date: 1384788607340 });
            result = FT.ads.targeting();
            equal(result.ts, '20131118153007', "timestamp value returns correctly");

            // Fast forward one hour
            TEST.sinon.clock.tick(3600000);
            result = FT.ads.targeting();
            equal(result.ts, '20131118163007', "fast forward one hour and timestamp value returns correctly");
        });

        test("Library Version", function () {
            TEST.beginNewPage({ config: { version: true }});
            result = FT.ads.targeting();
            equal(result.ver, 'gpt-$' + '{project.version}', "library version returned correctly");
        });
   }
    $(runTests);
}(window, document, jQuery));
