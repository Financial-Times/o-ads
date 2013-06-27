(function (window, document, $, undefined) {
    window.testMode  = unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);
    console.log(testMode, FT._ads.utils.cookies.FTQA);
    function runTests() {
        module('Third Party');
        // Clear the Audience Science cookie value so real cookies are ignored in the test plan
        FT.env.audsci = '';
        FT.env.formats.hlfmpu = '336x850';
        FT.env.formats.mpusky = '160x60';

        var urlPrefix = 'http://ad.doubleclick.net/adj/test.5887.dev/master-companion-test;sz=';
        var urlPrefixUK = 'http://ad.uk.doubleclick.net/adj/test.5887.dev/master-companion-test;sz=';
        var realCookie = 'cookies=true; TRK_REF=null; GZIP=1; FTUserTrack=10.116.140.74.131941244638466718; __utma=138983524.2281482980145567500.1247646493.1247646493.1247646493.1; __utma=37533111.2274214351443377200.1249906596.1250598929.1250611539.9; __utmz=37533111.1249906596.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); ebNewBandWidth_.falcon.ft.com=36%3A1256046918783; rsi_segs=J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645; VWCUK200=L102309/Q29326_5050_1128_102309_4_123109_117695x117675x102309x1x1_117693x117673x102309x3x3; AYSC=_011967_02X_04greater%2520london_05ITT_06TEC_07MA_12SE19HL_13GBR_14GBR_17london_18london_19xxxx_20n_22P0P2Tools_24europe_25PVT_26PVT_27PVT_; ft_ncookie=1; rsi_ct=2009_11_17:84; FTMD=qv%2Ctw; JSESSIONID=SXLqKBNHThDJDYR5sMPqSBHJdtJMWLVR91TGWnKWnSc84Q1J5qjD!897560414; FT_s=sc=16_pr=P0P2Tools; __utmc=138983524; ft_ccookie=1; FTSession=-5953344332261857739; FT_P=exp=1241704665098&prod=71; FT_User=USERID=4004326601:EMAIL=brent.cowgill@ft.com:FNAME=:LNAME=:TIME=%5BThu%2C+07-May-2009+13%3A27%3A45+GMT%5D:USERNAME=brent.cowgill@ft.com:REMEMBER=_REMEMBER_:GROUPS=_UK_:RESOURCES=_nbe_countedcount_fttools_ftalert_portfolio_extelapp_:PRODUCTS=_P0_Tools_:ERIGHTSID=4326601:X=MCwCFB8ulocZZdc1uxPKmPysIxRTFkh4AhR6K9K38pcAen6z3ogTVcFVESeQ8A%3D%3D; FT_U=_EID=4326601_PID=4004326601_TIME=%5BThu%2C+07-May-2009+13%3A27%3A45+GMT%5D_SKEY=9e7iw%2BskQZwnnX2e29as1w%3D%3D_RI=1_; FTQA=debug%2Cinterval%3D25%2Ctimeout%3D300%2Cqunit%3Dexpand';
        var realAudSci = ';a=z89;a=z236;a=z288;a=z295;a=z299;a=z369;a=z555;a=z545;a=z633;a=z644';

        test("getAudSci", function () {
            expect(13);

            FT.env.audSciLimit = 2;

            var params = FT.env.getAudSci('');
            equal(FT.env.cookie, '', 'FT.env.cookie should be');
            equal(params, '', 'No rsi_segs cookie should have no params');
            equal(FT.env.audSci, params, 'FT.env.audSci should be the deepEqual');

            var result = ';a=z89;a=z236';
            var cookie = 'rsi_segs=J07717_10089|J07717_10236|J07717_10288|J07717_10299';
            params = FT.env.getAudSci(cookie);
            equal(FT.env.cookie, cookie, 'FT.env.cookie should be');
            equal(params, result, 'only first two aud sci values should be present');
            equal(FT.env.audSci, params, 'FT.env.audSci should be the deepEqual');

            cookie = 'rsi_segs=J07717_10089|H19283_13383|J07717_10236|J07717_10288|J07717_10299';
            params = FT.env.getAudSci(cookie);
            equal(FT.env.cookie, cookie, 'FT.env.cookie should be');
            equal(params, result, 'only FT segment values should be present');

            cookie = 'prsi_segs=J07717_10089|H19283_13383|J07717_10236|J07717_10288|J07717_10299';
            params = FT.env.getAudSci(cookie);
            equal(FT.env.cookie, cookie, 'FT.env.cookie should be');
            equal(params, '', 'only rsi_segs cookie matched. should be nothing');

            // Real Cookie test:
            cookie = realCookie;
            result = realAudSci;
            FT.env.audSciLimit = 10;
            params = FT.env.getAudSci(cookie);
            equal(FT.env.cookie, cookie, 'FT.env.cookie should be');
            equal(params, result, 'only first 10 aud sci values should be present');

            // AudSci disabled test.
            FT.env.audSciLimit = 0;
            params = FT.env.getAudSci(cookie);
            equal(params, '', 'no aud sci values should be present');

        });

        test("getURL", function () {
            expect(8);

            FT.env.tile = 0;
            var pos = 'square';
            var sz = '1x1,2x2,3x3,4x4';
            FT.env.formats[pos] = sz;
            FT.env.audSci = '';
            var urlResult = urlPrefix + sz + ';pos=' + pos + ';key=value;tile=1;ord=' + FT.env.ord + '?';
            var url = FT.env.getURL(pos);

            equal(FT.env.pos, pos, 'FT.env.pos should be');
            equal(FT.env.sz, sz, 'FT.env.sz should be');
            equal(url, urlResult, 'Returned url should be');
            equal(FT.env.url, url, 'FT.env.url should be deepEqual');

            url = FT.env.getURL('invalidpos');
            equal(url, undefined, 'invalid ad position, URL should be undefined');
            equal(FT.env.sz, undefined, 'FT.env.sz should be');

            var saved = FT.env.targeting;
                FT.env.server = 'uk.';
                FT.env.targeting = ';q=banks;author=john';

            urlResult = urlPrefixUK + sz + ';pos=' + pos + FT.env.targeting + ';tile=2;ord=' + FT.env.ord + '?';
            url = FT.env.getURL(pos);
            equal(url, urlResult, 'Returned url has server and targeting in it');
            FT.env.server = '';
            FT.env.targeting = saved;

            FT.env.audSciLimit = 10;
            FT.env.audSci = undefined;
            FT.env.cookie = realCookie;
            urlResult = urlPrefix + sz + ';pos=' + pos + FT.env.targeting + realAudSci + ';tile=3;ord=' + FT.env.ord + '?';
            url = FT.env.getURL(pos);
            equal(url, urlResult, 'Returned url has audsci targeting in it');

            FT.env.audSciLimit = 0;
            FT.env.audSci = '';
            FT.env.cookie = '';
        });

        test("getTag", function () {
            expect(3);

            FT.env.tile = 0;
            var pos = 'circle';
            var sz = '5x5,6x6';
            FT.env.formats[pos] = sz;
            FT.env.audSci = '';
            var tagResult = urlPrefix + sz + ';pos=' + pos + ';key=value;tile=1;ord=' + FT.env.ord + '?';
            tagResult = '<' + 'script src="' + tagResult + '"><' + '/script>';
            var tag = FT.env.getTag(pos);

            // We have to replace script with s c r i p t or else displaying the results of the tests
            // causes a document.write to blank out the test page afterwards.
            tag = tag.replace(/script/g, 's c r i p t');
            tagResult = tagResult.replace(/script/g, 's c r i p t');
            FT.env.tag = FT.env.tag.replace(/script/g, 's c r i p t');

            equal(FT.env.tag, tagResult, 'FT.env.tag should be');
            equal(tag, FT.env.tag, 'Returned tag should be');
            tag = FT.env.getTag('invalidpos');
            equal(tag, undefined, 'invalid ad position, tag should be undefined');

        });

        if (testMode === 'integration') {
            test("adCall", function () {
                expect(6);

                var Positions = [ 'banlb', 'newssubs', 'hlfmpu', 'mpu', 'mpusky' ];
                for (var idx = 0; idx < Positions.length; ++idx)
                {
                    var ist = Positions[idx] === 'banlb' ? ';dcopt=ist' : '';
                    var url = '^' + urlPrefix + '\\d+x\\d+(,\\d+x\\d+)*' + ist + ';pos=' + Positions[idx] + ';key=value;tile=' + (idx + 1) + ';ord=' + FT.env.ord + '\\?$';
                    var rRegex = new RegExp(url);
                    matches(FT.env.Requests[Positions[idx]], rRegex, Positions[idx] + " Ad call URL");
                }
                var rDiv = $('#adCalls').find('script');
                equal(rDiv.length, 2 * Positions.length + 1, "2 script tags injected per valid call to adCall()");
            });
        }
    }

    $(runTests);
}(window, document, jQuery));
