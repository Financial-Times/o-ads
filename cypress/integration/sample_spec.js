describe('My First Test', function() {
	it('Does not do much!', function() {
	  expect(true).to.equal(false);
	})

	it('Visits the Kitchen Sink', function() {
		cy.visit('https://example.cypress.io')
	})
  })
