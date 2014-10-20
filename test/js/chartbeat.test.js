(function (window, document, $, undefined) {
    function runTests() {
        QUnit.module('Chartbeat');

        test('the refreshAd method is called before gpt begins refreshing the ad', function () {
            var decorateRefresh = sinon.spy(FT.ads.cb, 'decorateRefresh');
            var cbRefresh = sinon.spy(FT.ads.cb, 'refresh');
            var gptRefresh = sinon.spy(FT.ads.gpt, 'refresh');

            window.pSUPERFLY = {refreshAd: sinon.stub};
            FT.ads.cb.init(FT.ads);
            ok(decorateRefresh.called, 'initialising chartbeat decorates the gpt refresh method.');

            FT.ads.gpt.refresh();
            ok(cbRefresh.called, 'whenever gpt refresh is called cb refresh is called too.');
            ok(gptRefresh.called, 'whenever gpt refresh is called cb refresh is called too.');
        });

    }

    $(runTests);
}(window, document, jQuery));


