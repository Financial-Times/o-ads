/* globals sinon: false */
const stubs = sinon.sandbox.create();

window.oz_insight = function() {
	window.oz_callback({ estimate: {tier: 400}});
};

module.exports.mock = stubs.stub();

module.exports.restore = function() {
	(stubs.fakes || []).forEach(function(fake) {
		if (typeof fake.reset === 'function') {
			fake.reset();
		}
	});
};
