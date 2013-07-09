(function (window, document, $, undefined) {
    function runTests() {
        module('Third party aud sci');

        test('getters and setters', function () {
            expect(1);
            ok(FT.ads.audsci.getAudSci, "the Get method exists.");
        });

        test('return value', function () {
            FT.ads.config.audSciLimit = 2;
            var realCookie = 'cookies=true; TRK_REF=null; GZIP=1; FTUserTrack=10.116.140.74.131941244638466718; __utma=138983524.2281482980145567500.1247646493.1247646493.1247646493.1; __utma=37533111.2274214351443377200.1249906596.1250598929.1250611539.9; __utmz=37533111.1249906596.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); ebNewBandWidth_.falcon.ft.com=36%3A1256046918783; rsi_segs=J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645; VWCUK200=L102309/Q29326_5050_1128_102309_4_123109_117695x117675x102309x1x1_117693x117673x102309x3x3; AYSC=_011967_02X_04greater%2520london_05ITT_06TEC_07MA_12SE19HL_13GBR_14GBR_17london_18london_19xxxx_20n_22P0P2Tools_24europe_25PVT_26PVT_27PVT_; ft_ncookie=1; rsi_ct=2009_11_17:84; FTMD=qv%2Ctw; JSESSIONID=SXLqKBNHThDJDYR5sMPqSBHJdtJMWLVR91TGWnKWnSc84Q1J5qjD!897560414; FT_s=sc=16_pr=P0P2Tools; __utmc=138983524; ft_ccookie=1; FTSession=-5953344332261857739; FT_P=exp=1241704665098&prod=71; FT_User=USERID=4004326601:EMAIL=brent.cowgill@ft.com:FNAME=:LNAME=:TIME=%5BThu%2C+07-May-2009+13%3A27%3A45+GMT%5D:USERNAME=brent.cowgill@ft.com:REMEMBER=_REMEMBER_:GROUPS=_UK_:RESOURCES=_nbe_countedcount_fttools_ftalert_portfolio_extelapp_:PRODUCTS=_P0_Tools_:ERIGHTSID=4326601:X=MCwCFB8ulocZZdc1uxPKmPysIxRTFkh4AhR6K9K38pcAen6z3ogTVcFVESeQ8A%3D%3D; FT_U=_EID=4326601_PID=4004326601_TIME=%5BThu%2C+07-May-2009+13%3A27%3A45+GMT%5D_SKEY=9e7iw%2BskQZwnnX2e29as1w%3D%3D_RI=1_; FTQA=debug%2Cinterval%3D25%2Ctimeout%3D300%2Cqunit%3Dexpand';
            var resultWithCookie = FT.ads.audsci.getAudSci(realCookie);
            var resultWithNoParams = FT.ads.audsci.getAudSci();
            var realAudSci = ';a=z89;a=z236';

            expect(5);

            strictEqual(typeof resultWithCookie, "string", "result is a string");
            strictEqual(resultWithNoParams, '', "result with no params passed should be empty string");

            strictEqual(resultWithCookie, realAudSci, "While the audSciLimit is 2, there should be only 2 segments in the results");

            FT.ads.config.audSciLimit = 10;
            resultWithCookie = FT.ads.audsci.getAudSci(realCookie);
            realAudSci = ';a=z89;a=z236;a=z288;a=z295;a=z299;a=z369;a=z555;a=z545;a=z633;a=z644';

            strictEqual(resultWithCookie, realAudSci, "While the audSciLimit is 10, there should be 10 segments in the results");

            FT.ads.config.audSciLimit = 15;
            realCookie = "SIVISITOR=Mi45MjguMDI0NjA3MDEyMDQ4NC4xMzcyNjczMjk2MTI5LjZmM2U4YmFj*; FTUserTrack=62.173.203.142.1372673035962738; opFTData=%26v%3D6; op553homepagegum=a0600eq0bn2979v0596m340da; op553homepageliid=a0600eq0bn2979v0596m340da; op553homepagerecommendationsgum=a0bt1030ul2971t0791fuf2979s04n3i3dbc7; op553homepagerecommendationsliid=a0bt1030ul2971t0791fuf2979s04n3i3dbc7; op553globalheadergum=a08014v1302971s06q50lc2979s04u36c5648; op553globalheaderliid=a08014v1302971s06q50lc2979s04u36c5648; AYSC_C=S; cookieconsent=seen; opTrackSess=%26t%3D1%26vt%3D1; opTrackSessIDOL=%26sesid%3D1D8428C7-14F0-4E4B-9256-65300E42C912%26ref%3D0; op553iai-anonymous-register-newgum=a0cd0tm0392972t01d4uk52979s04g3yvaf0a; op553iaianonymousregisternewliid=a0cd0tm0392972t01d4uk52979s04g3yvaf0a; FT_M=D=D|F=|R=0; opPageCount=33x1372673295966%26sub%3D1; ebNewBandWidth_.howtospendit.ft.com=1819%3A1373367734868; __utma=138983524.388860043.1373367614.1373367614.1373367614.1; __utmb=138983524.3.10.1373367614; __utmc=138983524; __utmz=138983524.1373367614.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); rsi_segs=J07717_10659|J07717_10124|J07717_10134|J07717_10145|J07717_11498|J07717_10095|J07717_10842|J07717_10830|J07717_10876|D08734_71928|J07717_11170|J07717_11406|J07717_11407|J07717_10649|J07717_0"
            realAudSci = ";a=z659;a=z124;a=z134;a=z145;a=z1498;a=z95;a=z842;a=z830;a=z876;a=z1170;a=z1406;a=z1407;a=z649";
            resultWithCookie = FT.ads.audsci.getAudSci(realCookie);
            strictEqual(resultWithCookie, realAudSci, "The test data contains an edge-case segment J07717_0, which should not be entered into the AudSci string");
        });
    }

    $(runTests);
}(window, document, jQuery));
