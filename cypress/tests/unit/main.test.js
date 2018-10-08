const Ads = require('../../../main.js').constructor;
const utils = require('../../../src/js/utils');

describe('Main', () => {
	beforeEach(() => {
		cy.clearCookie('FTConsent');
	});

	// NOT WORKING
	it('oAds.ready event fires after o.DOMContentLoaded', () => {
		document.body.insertAdjacentHTML('beforeend', '<div data-o-ads-name="banlb2" data-o-ads-formats="MediumRectangle"></div>');
		
		const ads = new Ads();

		const oAdsReadySpy = cy.spy();

		utils.on('ready', oAdsReadySpy);

		document.dispatchEvent(new Event('o.DOMContentLoaded'));

		cy.wait(10000);

		expect(oAdsReadySpy.callCount).to.equal(1);


		// // NOT WORKING
		// document.body.addEventListener('oAds.ready', function(event) {
		// 	console.log(event.detail.name);
		// 	console.log('oh heeey');
		// 	expect(event.detail.name).to.equal('banlb2', 'our test slot is requested');
		// 	expect(event.detail.slot.sizes).to.deep.equal([[300, 250]], 'with the correct sizes');
		// });
		
	});


});