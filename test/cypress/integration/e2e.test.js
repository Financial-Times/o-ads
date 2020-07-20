/* eslint-disable strict */

/**
 * E2E Tests check the responses from DFP are correct under
 * specific o-ads config options. If these tests fail, check
 * the creatives in DFP haven't changed and are targeted correctly.
 * You can ask ad-ops to do this if unsure.
 *
 * These all live in the DFP site: test.5887.origami
 */
describe('E2E tests', () => {
	it('Ad loads the correct creative', () => {
		cy.visit("/demos/local/Individual-Ad.html").as('IndividualAd');
		cy.get('#leaderboard-gpt').should('be.visible');
		// Wait for the iframe to load
		// Note - the iframe doesn't have an "src" attribute, it's populated
		// by the gpt script (I think), so we need to wait for its
		// data-load-complete attribute
		cy.get('iframe[data-load-complete]').then($iframe => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).find('img')
				.should('be.visible')
				.should('have.attr', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097');
		});
	});


	it('Ad is lazy loaded correctly', () => {
		cy.visit("/demos/local/Individual-Ad-Lazy-Load.html").as('LazyLoadedAd');
		cy.get('#leaderboard-gpt')
			.should('be.hidden')
			.scrollIntoView()
			.should('be.visible');

		cy.get('iframe[data-load-complete]').then($iframe => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).find('img')
				.should('be.visible')
				.should('have.attr', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097');
		});
	});

	/*
		This doesn't work in cypress.
		The intersection observer that is created to lazy load the ad has the
		root element as the browser window. Because the test is loaded in an
		iframe, this doesn’t work, as it’s the iframe window that we need to
		have the IntersectionObserver use as its root. It’s a known issue and
		the spec was intentionally designed this way to allow for easy cross
		frame observing. Unfortunately this means we can’t test lazy loading
		margins in cypress.
	*/
	it.skip('Ad with wiewport margin is loaded correctly ', () => {
		cy.visit("/demos/local/Individual-Ad-Lazy-Load-Margin.html").as('LazyLoadedMarginAd');

		cy.get('#leaderboard-gpt').should('be.visible');

		cy.get('iframe[data-load-complete]').then($iframe => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).find('img')
				.should('be.visible')
				.should('have.attr', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097');
		});
	});


	it('Master and companion creatives are loaded correctly', () => {
		cy.visit("/demos/local/Master-and-Companion.html").as('MasterCompanionAd');

		// Verify master ad is displayed
		cy.get('div[data-o-ads-name="leaderboard"] iframe[data-load-complete]').then($iframe => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).find('img')
				.should('be.visible')
				.should('have.attr', 'src', 'https://tpc.googlesyndication.com/simgad/12593654562240684097');
		});

		// Verify companion ad is displayed
		cy.get('div[data-o-ads-name="rectangle"] iframe[data-load-complete]').then($iframe => {
			const $body = $iframe.contents().find('body');
			cy.wrap($body).find('img')
				.should('be.visible')
				.should('have.attr', 'src', 'https://tpc.googlesyndication.com/simgad/11544125268120182564');
		});
	});
});