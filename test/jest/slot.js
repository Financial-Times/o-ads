/* eslint-env jest */

import '@testing-library/jest-dom/extend-expect';
import Slot from '../../src/js/slot.js.js';

test('slot to export a "Slot" object', () => {
	expect(Slot).toBeDefined();
});

test('slot.addClass adds a class to the slot container', (done) => {
	document.body.innerHTML = '<div class="container"></div>';

	const container = document.querySelector('.container');
	const newSlot = new Slot(container);
	newSlot.addClass('sticky');

	setTimeout(() => {
		expect(container).toHaveClass('o-ads-sticky');
		done();
	}, 0);
});
