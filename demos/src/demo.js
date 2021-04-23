import Ads from '../../main.js';
window.oads = Ads;

document.addEventListener("DOMContentLoaded", function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
