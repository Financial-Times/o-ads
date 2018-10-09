
describe("Individual ad", () => {
	it("Verify the leaderboard advert is displayed", () => {
		cy.visit("/demos/local/Individual-Ad.html").as('IndividualAd');
		cy.get('#leaderboard-gpt').should('be.visible');
		cy.get('[data-o-ads-name="leaderboard"] iframe').then($iframe => {
			// Doesn't work			
			const $body = $iframe.contents().find('body');
			console.log($body);
			cy.wrap($body).find('img').should('be.visible');
		});
	});
});