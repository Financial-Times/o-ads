(function (window, document, $, undefined) {
    function runTests() {
        module('Third party targeting');

        test('fetchAudSci', function () {

            var rsi_segs = 'J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645';
            FT.ads.config('audSciLimit', 2);
            FT.ads.config('rsi_segs', rsi_segs);
            var resultWithCookie = FT.ads.targeting(rsi_segs);
            var resultWithNoParams = FT.ads.targeting();
            var realAudSci = {'a' : ['z89', 'z236']};

            expect(4);
            strictEqual(typeof resultWithCookie, "object", "result is an object");
            deepEqual(resultWithCookie.a, realAudSci.a, "While the audSciLimit is 2, there should be only 2 segments in the results");

            FT.ads.config('audSciLimit', 10);
            resultWithCookie = FT.ads.targeting(rsi_segs);
            realAudSci = {'a' : ['z89', 'z236', 'z288', 'z295', 'z299', 'z369', 'z555', 'z545', 'z633', 'z644']};
            deepEqual(resultWithCookie.a, realAudSci.a, "While the audSciLimit is 10, there should be 10 segments in the results");


            rsi_segs = 'J07717_10659|J07717_10124|J07717_10134|J07717_10145|J07717_11498|J07717_10095|J07717_10842|J07717_10545|J07717_10814|J07717_10830|J07717_10876|J07717_11170|J07717_10911|J07717_11406|J07717_11407|J07717_10731|J07717_10649|J07717_0';
            FT.ads.config('audSciLimit', 15);
            FT.ads.config('rsi_segs', rsi_segs);
            resultWithCookie = FT.ads.targeting(rsi_segs);
            realAudSci = {'a' : ['z659', 'z124', 'z134', 'z145', 'z1498', 'z95', 'z842', 'z545', 'z814', 'z830', 'z876', 'z1170', 'z911', 'z1406', 'z1407']};

            deepEqual(resultWithCookie.a, realAudSci.a, "The test data contains an edge-case segment J07717_0, which should not be entered into the AudSci segments array");
        });

        test('getEid', function () {
            FT.ads.config('FT_U', null);
            FT.ads.config('FT_Remember', null);
            var result = FT.ads.targeting();

            equal(result.eid, null, 'No FT_U or FT_Remember returns null')

            FT.ads.config('FT_U', '_EID=1111111_PID=4009036331_TIME=%5BTue%2C+06-Aug-2013+11%3A54%3A53+GMT%5D_SKEY=lUM4QDoONobvNQGGJP3ETA%3D%3D_RI=0_I=1_');
            var result = FT.ads.targeting();

            equal(result.eid, '1111111', 'FT_U set returns correct eid (1111111)');

            FT.ads.config('FT_U', null);
            FT.ads.config('FT_Remember', '222222:TK1583990837682794904:FNAME=Bat:LNAME=man:EMAIL=batman@not.wayne.enterprises.com');
            var result = FT.ads.targeting();

            equal(result.eid, '222222', 'FT_Remember set returns correct eid (222222)');

            FT.ads.config('FT_U', '_EID=333333_PID=4009036331_TIME=%5BTue%2C+06-Aug-2013+11%3A54%3A53+GMT%5D_SKEY=lUM4QDoONobvNQGGJP3ETA%3D%3D_RI=0_I=1_');
            FT.ads.config('FT_Remember', '444444:TK1583990837682794904:FNAME=Bat:LNAME=man:EMAIL=batman@not.wayne.enterprises.com');
            var result = FT.ads.targeting();

            equal(result.eid, '333333', 'FT_U and FT_Remember set returns eid (333333) from FT_U');
        });

        test('getFromConfig', function () {
            FT.ads.config('FT_U', null);
            FT.ads.config('FT_Remember', null);
            FT.ads.config('rsi_segs', null);
            FT.ads.config.clear('dfp_targeting');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null}, 'No dfp_targeting returns no targetting params');

            FT.ads.config('dfp_targeting', '');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null, }, 'Empty string dfp_targeting returns null');

            FT.ads.config('dfp_targeting', 'some=test;targeting=params');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null, some: 'test', targeting: 'params'}, 'Simple params are parsed correctly');

            FT.ads.config('dfp_targeting', 'some=test;;targeting=params');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null, some: 'test', targeting: 'params'}, 'Double semi-colons still parse correctly');

            FT.ads.config('dfp_targeting', 'some=test;  ;targeting=params;for=gpt');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null, some: 'test', targeting: 'params', 'for': 'gpt'}, 'Double semi-colons still parse correctly');

            FT.ads.config('dfp_targeting', 's@me=test;;targeting=par@ms$\'');
            var result = FT.ads.targeting();

            deepEqual(result, {eid: null, 's@me': 'test', targeting: 'par@ms$\''}, 'Special characters parse correctly');

        });
    }

    $(runTests);
}(window, document, jQuery));
