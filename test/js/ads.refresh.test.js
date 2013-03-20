FT.ads.initDFP();


if (typeof(FT._ads.utils.cookies.FTQA) !== "undefined") {

    envVars = FT._ads.utils.cookies.FTQA.split("%3B");

    for (j = 0; j < envVars.length; j++) {
        if (re.test(envVars[j])) {
            nameAndValue = envVars[j].split("%3D");
            FT.env[nameAndValue[0]] = nameAndValue[1];
            debugStr += nameAndValue[0] + ' = ' + nameAndValue[1] + ' ';
        }
    }

    //now we find what test mode we are in and either call DFP (Integration) or Mock the ad call (unit)
    testMode = unitOrIntegrationMode(FT._ads.utils.cookies.FTQA);

    if (testMode === 'unit') {
        //if unit test, then we override FT.lib.writeScript with the call to Mocking
        FT._ads.utils.writeScript = function (URL) {
            mockAdContent(URL, Tests); // Ads injected immediately
        };

        var Tests = {
            'intro':TestMockAd.intro,
            'banlb':TestMockAd.banlb3,
            'newssubs':TestMockAd.newssubs2,
            'tlbxrib':TestMockAd.tlbxrib,
            'mktsdata':TestMockAd.mktsdata,
            'hlfmpu':TestMockAd.hlfmpu,
            'doublet':TestMockAd.doublet,
            'refresh':TestMockAd.refresh
        };
    }

}

//set up test spies
FT.env.asset = "page";
FT.test = {};
FT.test.spyPageRefresh = sinon.spy(FT.ads, "pageRefresh");
FT.test.stubReloadWindow = sinon.stub(FT.ads, "reloadWindow");

function tests() {

    module("test-helpers", {
        setup:function () {
            FT.test.clock = sinon.useFakeTimers();
            FT.test.delay = 720*1000;
            FT.userInteracting = false;
        },
        teardown:function () {
            FT.test.clock = FT.test.clock.restore()
        }
    });

    test("test startRefreshTimer userInteracting = false", function () {
        FT.userInteracting = false;
        FT.test.spyPageRefresh.reset();
        FT.test.stubReloadWindow.reset();

        FT.ads.startRefreshTimer(FT.test.delay);

        FT.test.clock.tick(FT.test.delay + FT.ads.CONST.refreshDelayMs +  1000);
        deepEqual(FT.test.spyPageRefresh.callCount, 1, "Number of times spyPageRefresh() function should be called");
        deepEqual(FT.test.stubReloadWindow.callCount, 1, "Number of times stubReloadWindow() function should be called");
    });


    test("test startRefreshTimer userInteracting = true", function () {
        FT.userInteracting = true;
        FT.test.spyPageRefresh.reset();
        FT.test.stubReloadWindow.reset();

        FT.ads.startRefreshTimer(FT.test.delay);

        FT.test.clock.tick(FT.test.delay*2);
        deepEqual(FT.test.spyPageRefresh.callCount, 2, "Number of times spyPageRefresh() function should be called");
        deepEqual(FT.test.stubReloadWindow.callCount, 0, "Number of times stubReloadWindow() function should be called");
    });
}
;

$(tests);
