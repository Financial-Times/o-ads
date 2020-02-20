/* eslint-env jest */
/* global jsdom */

import gpt from '../../src/js/ad-servers/gpt';

describe('setup', () => {
	it('strips search terms', () => {
		// @ts-ignore jsdom
		jsdom.reconfigure({
			url: 'https://www.ft.com/search?q=goog'
		});

		const setTargetingSpy = jest.fn();

		// @ts-ignore googletag
		window.googletag = {
			cmd: { push: jest.fn() },
			enableServices: jest.fn(),
			pubads: () => ({
				setTargeting: setTargetingSpy,
				addEventListener: jest.fn(),
				setRequestNonPersonalizedAds: jest.fn(),
				enableAsyncRendering: jest.fn()
			})
		};

		gpt.setup({});

		expect(setTargetingSpy).toBeCalledWith('url', 'https://www.ft.com/search');
	});
});
