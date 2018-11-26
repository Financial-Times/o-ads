function getQueryParams(url) {
	const o = {};
	url.slice(url.indexOf('?')+1).split('&').forEach(p => {
		const key = p.slice(0, p.indexOf('='));
		const value = p.slice(p.indexOf('=')+1);
		o[decodeURIComponent(key)] = decodeURIComponent(value);
	});
	return o;
}

// Integration tests check the ad requests are made properly
// We can spy on the ad calls and assert on the underlying xhr
// object, including query parameters and response headers.
describe('Integration tests', () => {
	it.skip('Ad makes a request to the correct url', () => {
		// Spy on the ad call with cy.server() and cy.route()
		// see https://docs.cypress.io/guides/guides/network-requests.html for more details
		// Note: this only works with xhr not fetch at the mo - there are workarounds for fetch
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/test-ad.html");

		// Wait for the ad call to be made, then assert on the query string
		cy.wait('@AdLoaded').then(xhr => {
			// xhr.url gives you the url but it is decoded. We don't want that
			// as some params include subparameters as encoded strings
			const url = xhr.xhr.responseURL;
			const qsp = getQueryParams(url);
			const cust_params = getQueryParams(qsp.cust_params);
			console.log('qsp', qsp);
			console.log('cust_params', cust_params);

			// Check sizes are converted and set
			expect(qsp.sz).to.equal('300x250|180x50|160x600|728x90|970x90|970x66|300x600|970x250|300x1050|320x50|88x31|120x60|2x2');
			// Check targeting is set
			expect(qsp.scp).to.equal('pos=top');
			// Check custom parameters are set
			expect(cust_params).to.have.property('testparam', 'hello');
			//
		});
	});

	// NOT WORKING - ads requests never fire when responsive formats are set - find out why
	it('Responsive ad renders correctly', () => {
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/test-ad-responsive.html");
		cy.viewport(780, 500);	// w, h. W above 760px = Medium breakpoint;

		cy.wait('@AdLoaded').then(xhr => {
			const url = xhr.xhr.responseURL;
			const qsp = getQueryParams(url);

			expect(qsp.sz).to.equal('300x250');
		});
	});

	it('Google Test', () => {
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/google-test.html");
		cy.viewport(780, 500);	// w, h. W above 760px = Medium breakpoint;

		cy.wait('@AdLoaded').then(xhr => {
			const url = xhr.xhr.responseURL;
			const qsp = getQueryParams(url);
			console.log("Loaded");
		});
	});
});