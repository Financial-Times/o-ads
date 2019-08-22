const { URL } = require('url');

// This function checks that if a request is made that matches the urlRegEx
// then it contains all the expectedParams and they are not empty
module.exports.checkRequestWithParams = (page, urlRegEx, expectedParams) => {
	const promise = new Promise((resolve, reject) => {
		page.on('requestfinished', (request) => {
			const requestedUrl = request.url();
			// We don't look at other requests made by the same page
			if (requestedUrl.match(urlRegEx)) {
				const url = new URL(requestedUrl);
				const query  = url.searchParams;
				expectedParams.forEach( param => {
					try {
						expect(query.get(param)).toBeTruthy();
					} catch(err) {
						reject(err);
					}
				});
				resolve(true);
			}
		});
	}, 10000);

	return promise;
};
