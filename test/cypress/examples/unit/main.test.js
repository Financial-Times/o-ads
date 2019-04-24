const Ads = require('../../../main.js').constructor;
const utils = require('../../../src/js/utils');

describe('Main', () => {
	beforeEach(() => {
		cy.clearCookie('FTConsent');
	});

	it.only('oAds.slotReady event fires after o.DOMContentLoaded', () => {
		document.body.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');
		new Ads();
		const oAdsReadySpy = cy.spy();
		utils.on('slotReady', oAdsReadySpy);

		/*
			cy runs two iframes. One loads the test, the other loads
			a locally running app (if set).

			window.document (here, refers to the test container)
			cy.document() refers to the app env
		*/
		document.dispatchEvent(new Event('o.DOMContentLoaded'));

		// Wait for event loop to finish
		cy.wait(0).then(() => {
			const eventDetail = oAdsReadySpy.args[0][0].detail;
			expect(oAdsReadySpy.callCount).to.equal(1);
			expect(eventDetail.name).to.equal('banlb2');
			expect(eventDetail.slot.sizes).to.deep.equal([[300, 250]]);
		});
	});


	context('Initialising', () => {
		it('oAds.initialised event is triggered', () => {
			const ads = new Ads();
			const oAdsInitSpy = cy.spy();
			utils.on('initialised', oAdsInitSpy);

			ads.init();

			const eventDetail = oAdsInitSpy.args[0][0].detail;
			expect(oAdsInitSpy.callCount).to.equal(1);
			expect(eventDetail).to.equal(ads);
			expect(ads.isInitialised).to.equal(true);

		});

		it('initAll() function is only triggered once', () => {
			const ads = new Ads();
			const gptInit = cy.spy(ads.gpt, 'init');

			expect(gptInit.callCount).to.equal(0);

			document.dispatchEvent(new Event('o.DOMContentLoaded'));
			expect(gptInit.calledOnce);

			document.dispatchEvent(new Event('o.DOMContentLoaded'));
			expect(gptInit.calledOnce);
		});

		it('Manual inits always trigger but DOM inits do not override', () => {
			const ads = new Ads();
			const gptInit = cy.spy(ads.gpt, 'init');

			expect(gptInit.callCount).to.equal(0);

			ads.init();
			expect(gptInit.calledOnce);

			document.dispatchEvent(new Event('o.DOMContentLoaded'));
			expect(gptInit.calledOnce);

			ads.init();
			expect(gptInit.calledTwice);
		});
	});
});
