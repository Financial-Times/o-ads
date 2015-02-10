/* jshint strict: false */
/* globals jQuery: false, sinon: false, FT,  ok: false, QUnit: false, test: false */
/* these are the globals setup by Qunit, FT for our namespace and TEST for our mocks and helpers */
/* we also turn of use strict in the test as you may need to do something to do something strict mode won't allow in order to test/mock something */

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
