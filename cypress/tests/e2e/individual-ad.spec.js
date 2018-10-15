
describe("Individual ad", () => {
	it("Verify the leaderboard advert is displayed", () => {
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
});