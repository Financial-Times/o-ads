function getQueryParams(url) {
	console.log('url', url.slice(url.indexOf('?')+1));
	const o = {};
	url.slice(url.indexOf('?')+1)
		.split('&')
		.forEach(p => {
			const key = p.slice(0, p.indexOf('='));
			const value = p.slice(p.indexOf('=')+1);
			o[decodeURIComponent(key)] = decodeURIComponent(value);
		});
	return o;
}

describe('Integration tests', () => {
	context('Simple ad', () => {
		it('makes a request to the correct url', () => {
			// Spy on the ad call with cy.server() and cy.route()
			// see https://docs.cypress.io/guides/guides/network-requests.html for more details
			// Note: this only works with xhr not fetch at the mo - there are workarounds for fetch
			cy.server();
			cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
			cy.visit("/demos/local/test-ad.html");

			// Wait for the ad call to be made, then assert on the query string
			cy.wait('@AdLoaded').then(xhr => {
				const qsp = getQueryParams(xhr.url);
				const cust_params = getQueryParams(qsp.cust_params);
				console.log('qsp', qsp);
				console.log('cust_params', cust_params);

				// Size is set correctly
				expect(qsp.sz).to.equal("728x90");
				// Targeting is set correctly
				expect(qsp.scp).to.equal("pos=top");

			});
		});
	});
});