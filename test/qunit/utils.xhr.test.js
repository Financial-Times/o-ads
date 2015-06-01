/* jshint globalstrict: true */
/* globals QUnit: false */
'use strict';

QUnit.module('utils.createCORSRequest');

QUnit.test('We can make a CORS request', function(assert) {

	var server = this.server();
	server.respondWith("GET", "/some/article/comments.json",
		[200, { "Content-Type": "application/json" }, '[{ "id": 12, "comment": "Hey there" }]']);

	var callback = this.spy();
	this.ads.utils.createCORSRequest('/some/article/comments.json', 'GET', callback);
	server.respond();
	assert.ok(callback.withArgs('[{ "id": 12, "comment": "Hey there" }]'), 'We can make an xhr a request');
});
