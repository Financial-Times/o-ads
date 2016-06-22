
/**
* The Reporter instance adds a "Report broken Ad"
* link to a container (Slot) and provides methods
* to report the loaded advert to a given endpoint
* @constructor
*/
function Reporter (container) {
	this.config = {
		next_ads_reporter_url: 'TO_BE_FINALISED', // app that handles POST report
		slack_channel: 'https://financialtimes.slack.com/messages/general', // slack channel for reporting broken ads
		default_text: 'Report broken Ad', // default text on the link
		css_class: 'o-ads__report-link' // link css class
	};
	this.adData = null;
	this.container = container; // store ref to container
	this.link = this.addLinkToContainer(); // add link and store ref
	this.onClickHandler = this.addEvent('click', this.onClick, this); // store ref to handler for use within promise
}

/**
* Given an event type, a handler and a caller, will addEventListener on link
* done in this way so we store a reference to the handler for later use (i.e removal)
* @returns event handler
*/
Reporter.prototype.addEvent = function (event, handler, caller) {
	let _handler;
	this.link.addEventListener(event, _handler = function (e) {
		handler.call(caller, e);
	});
	return _handler;
};

/**
* Given an event type and a ref to the handler function to remove, will removeEventListener on link
*/
Reporter.prototype.removeEvent = function (event, handler) {
	this.link.removeEventListener(event, handler);
};

/**
* Adds the link to the container
* by default it simply links to the config.slack_channel
* @returns link
*/
Reporter.prototype.addLinkToContainer = function () {
	let href = document.createElement('a');
	href.setAttribute('href', this.config.slack_channel);
	href.classList.add(this.config.css_class);
	href.innerHTML = this.config.default_text;
	// attatch the link
	this.container.appendChild(href);
	return this.container.lastChild;
};

/**
* Changes the innerHTML of the link
* @returns this
*/
Reporter.prototype.updateLink = function (html) {
	this.link.innerHTML = html;
	return this;
};

/**
* Click event handler for the link
* will replace the default href behaviour (going to config.slack_channel)
*/
Reporter.prototype.onClick = function (e) {
	e.preventDefault();
	this.dispatch(this.adData);
};

/**
* Given data, store within Reporter
* Data is set via a gpt callback in slots.js - initRendered,
* initRendered passes this to slot.js - setReporter, which calls this func
* @returns this
*/
Reporter.prototype.setData = function (data) {
	this.adData = data;
	return this;
};

/**
* Given data, POST to config.next_ads_reporter_url and handle response
*/
Reporter.prototype.dispatch = function (data) {
	const _self = this; // access within promise chain

	// remove the event listener, we dont want to trigger dispatch again
	// will revert to href link whether success or fail
	_self.removeEvent('click', _self.onClickHandler);

	if (!this.adData) {
		_self.updateLink('Insufficient Ad data, try #slack');
		return;
	}

	const opts = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(data)
	};

	fetch(_self.config.next_ads_reporter_url, opts)
		.then(function (response) {
			if (response.status !== 200) {
				throw Error(response.statusText || response.status);
			}
			return response.text(); // read and pass on the response.text()
		})
		.then(function (response) {
			_self.updateLink('&#10004; ' + response + ', follow up on #slack');
		})
		.catch(function (err) {
			_self.updateLink('&#10008; Failed to report Ad, try #slack');
			return console.error(`Failed to report Ad: ${err}`); // log out error
		});
};

module.exports = Reporter;
