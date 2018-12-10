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
	it('Ad call contains correct size, targeting and custom parameters specified by dfp_targeting config option', () => {
		// Spy on the ad call with cy.server() and cy.route()
		// see https://docs.cypress.io/guides/guides/network-requests.html for more details
		// Note: this only works with xhr not fetch at the mo - there are workarounds for fetch
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/Test-Ad.html");

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
	it.skip('Responsive ad renders correctly', () => {
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/Test-Ad-Responsive.html");
		cy.viewport(780, 500);	// w, h. W above 760px = Medium breakpoint;

		cy.wait('@AdLoaded').then(xhr => {
			const url = xhr.xhr.responseURL;
			const qsp = getQueryParams(url);

			expect(qsp.sz).to.equal('300x250');
		});
	});

	// it.skip('Google Test', () => {
	// 	cy.server();
	// 	cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
	// 	cy.visit("/demos/local/Google-Test.html");
	// 	cy.viewport(780, 500);	// w, h. W above 760px = Medium breakpoint;

	// 	cy.wait('@AdLoaded').then(xhr => {
	// 		const url = xhr.xhr.responseURL;
	// 		const qsp = getQueryParams(url);
	// 		console.log("Loaded");
	// 	});
	// });

	it('Targeting API ads the correct values to the ad call', () => {
		cy.server();
		cy.route('https://securepubads.g.doubleclick.net/gampad/**').as('AdLoaded');
		cy.visit("/demos/local/Individual-Ad-with-Custom-Targeting-Values.html");

		cy.wait('@AdLoaded').then(xhr => {
			const url = xhr.xhr.responseURL;
			const qsp = getQueryParams(url);
			const cust_params = getQueryParams(qsp.cust_params);
			console.log('cust_params', cust_params);
			// user props
			// TODO: Work out how to sign in a user before this ad call
			expect(cust_params).to.have.property('slv', 'anon');
			// This SHOULD be there, but I think is stripped out by GPT.
			// To investigate on this card: https://trello.com/c/IbpPFURi/314-the-loggedin-parameter-never-actually-makes-it-into-the-ad-call-because-its-a-boolean
			// expect(cust_params).to.have.property('loggedIn', 'false');

			// Content props
			expect(cust_params).to.have.property('auuid', '047b1294-75a9-11e6-b60a-de4532d5ea35');
			expect(cust_params).to.have.property('ad', 'bs06,bs07,bs11,e2,ft02,ft04,ft05,ft11,ft18,ft35,ft38,ft41,g1,s03,sm06');
			expect(cust_params).to.have.property('ca', '');

			const expectedTopics = ['Retail','US & Canadian companies',
				'Technology sector', 'Retail & Consumer', 'Companies',
				'Mobile devices', 'Brexit'];

			const actualTopics = (cust_params.topic || '').split(',');

			expect(actualTopics).to.have.members(expectedTopics);
		});
	});
});
