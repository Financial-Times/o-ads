(function (window, document, $, undefined) {
    function runTests() {
        module('Third party aud sci');

        test('getter function exists', function () {
            expect(1);
            ok(FT.ads.audsci.getAudSci, "the Get method exists.");
        });

        test('return value test', function () {
            //FT.ads.config.set('audSciLimit', 2);
            var rsi_segs = 'J07717_10089|J07717_10236|J07717_10288|J07717_10295|J07717_10299|J07717_10369|J07717_10555|J07717_10545|J07717_10633|J07717_10644|J07717_10645';
            var resultWithCookie = FT.ads.audsci.getAudSci(rsi_segs);
            var resultWithNoParams = FT.ads.audsci.getAudSci();
            var realAudSci = {'a' : ['z89', 'z236']};
            expect(5);

            strictEqual(typeof resultWithCookie, "object", "result is an object");
            deepEqual(resultWithNoParams, {}, "result with no params passed should be an empty object");
            deepEqual(resultWithCookie, realAudSci, "While the audSciLimit is 2, there should be only 2 segments in the results");

            FT.ads.config.set('audSciLimit', 10);
            resultWithCookie = FT.ads.audsci.getAudSci(rsi_segs);
            realAudSci = {'a' : ['z89', 'z236', 'z288', 'z295', 'z299', 'z369', 'z555', 'z545', 'z633', 'z644']};
            deepEqual(resultWithCookie, realAudSci, "While the audSciLimit is 10, there should be 10 segments in the results");

            FT.ads.config.set('audSciLimit', 15);
            rsi_segs = 'J07717_10659|J07717_10124|J07717_10134|J07717_10145|J07717_11498|J07717_10095|J07717_10842|J07717_10545|J07717_10814|J07717_10830|J07717_10876|J07717_11170|J07717_10911|J07717_11406|J07717_11407|J07717_10731|J07717_10649|J07717_0';
            realAudSci = {'a' : ['z659', 'z124', 'z134', 'z145', 'z1498', 'z95', 'z842', 'z545', 'z814', 'z830', 'z876', 'z1170', 'z911', 'z1406', 'z1407']};
            resultWithCookie = FT.ads.audsci.getAudSci(rsi_segs);
            deepEqual(resultWithCookie, realAudSci, "The test data contains an edge-case segment J07717_0, which should not be entered into the AudSci segments array");
        });
    }

    $(runTests);
}(window, document, jQuery));
