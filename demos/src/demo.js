/*global require*/
'use strict';

window.oads = require('../../main.js');
document.addEventListener("DOMContentLoaded", function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
