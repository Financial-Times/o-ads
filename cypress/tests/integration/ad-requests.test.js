// const queryString = require('query-string');

// function getQueryParams(url) {
// 	const o = {};
// 	url.slice(url.indexOf('?')+1)
// 		.split('&')
// 		.forEach(p => {
// 			const pp = p.split('=');
// 			o[decodeURIComponent(pp[0])] = decodeURIComponent(pp[1]);
// 		});
// 	console.log('o', o);
// 	return o;
// }

describe('Integration tests', () => {
	context('Simple ad', () => {
		it('makes a request to the correct url', () => {
			// Spy on the ad call with cy.server() and cy.route()
			// see https://docs.cypress.io/guides/guides/network-requests.html for more details
			// Note: this only works with xhr not fetch at the mo - there are workarounds for fetch
			cy.server();
			cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
			
			cy.visit("/demos/local/test-ad.html");
			
			// // Wait for the ad call to be made, then assert on the query string
			// cy.wait('@AdLoaded').then(xhr => {
			// 	const qs = queryString.parse(xhr.url);
			// 	const cust_params = queryString.parse(qs.cust_params);

			// 	// const qsp = getQueryParams(xhr.url);
			// 	// console.log('qsp', qsp);
			// 	console.log('qs', qs);
			// 	console.log('cust_params', qs.cust_params);

			// 	// Test the size is set correctly
			// 	expect(qs.sz).to.equal("728x90");
			// 	// expect()

			// });
		});
	});
});