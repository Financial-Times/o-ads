/*xxxjshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*xxxglobal
    xxx$, FT, sinon, tests, module, test, deepEqual */

/*xxxproperties
    CONST, ads, asset, callCount, clock, delay, env, initDFP, refreshDelayMs,
    reset, restore, setup, spy, spyPageRefresh, startRefreshTimer, stub,
    stubReloadWindow, teardown, test, tick, useFakeTimers, userInteracting
*/


FT.ads.initDFP();

//set up test spies
FT.env.asset = "page";
FT.test = {};
FT.test.spyPageRefresh = sinon.spy(FT.ads, "pageRefresh");
FT.test.stubReloadWindow = sinon.stub(FT.ads, "reloadWindow");

function tests() {

    module("refresh", {
        setup: function () {
            FT.test.clock = sinon.useFakeTimers();
            FT.test.delay = 720 * 1000;
            FT.userInteracting = false;
        },
        teardown: function () {
            FT.test.clock = FT.test.clock.restore();
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

        FT.test.clock.tick(FT.test.delay * 2);
        deepEqual(FT.test.spyPageRefresh.callCount, 2, "Number of times spyPageRefresh() function should be called");
        deepEqual(FT.test.stubReloadWindow.callCount, 0, "Number of times stubReloadWindow() function should be called");
    });
}


$(tests);
