/**
 * Call the API for validating if a user is a human or a bot
 */
function BotVsHuman() {}

BotVsHuman.prototype.validate = function(url) {
	return fetch(url);
};

module.exports = new BotVsHuman();