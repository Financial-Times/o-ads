/* eslint-env jest */
/* global jsdom */

import gpt, { DEFAULT_LAZY_LOAD } from '../../src/js/ad-servers/gpt';
import log from '../../src/js/utils/log';
import GoogleTagMock from './testUtils/GoogleTagMock';

jest.mock('./testUtils/GoogleTagMock');

describe('setup', () => {
	beforeEach(() => {
		window.googletag = new GoogleTagMock();
	});

	describe ('setTargeting()', () => {

		test('should strip search terms', () => {
			// @ts-ignore jsdom
			jsdom.reconfigure({
				url: 'https://www.ft.com/search?q=goog'
			});

			gpt.setup({});

			expect(global.googletag.pubads().setTargeting)
				.toBeCalledWith('url', 'https://www.ft.com/search');
		});

	});

	describe('enableLazyLoad()', () => {

		test('should explicitly disable lazy load', () => {
			gpt.setup({
				enableLazyLoad: false,
			});

			expect(global.googletag.pubads().enableLazyLoad)
				.not.toBeCalled();
		});

		test('should enable lazy load with default parameters, if lazy loadLoadConf is true', () => {
			gpt.setup({
				enableLazyLoad: true,
			});

			expect(global.googletag.pubads().enableLazyLoad)
				.toBeCalledWith(DEFAULT_LAZY_LOAD);
		});

		test('should enable lazy load with custom parameters, if lazyLoadConf is a config object', () => {
			const gptConfig = {
				enableLazyLoad: {
					fetchMarginPercent: 300,
					renderMarginPercent: 200,
				}
			};
			gpt.setup(gptConfig);

			expect(global.googletag.pubads().enableLazyLoad)
				.toBeCalledWith(
					Object.assign({}, DEFAULT_LAZY_LOAD, gptConfig.enableLazyLoad)
				);
		});

		test('should not enable lazy load, if lazyLoadCong is not a boolean or an object', () => {
			const enableLazyLoad = 'what';
			const spyConsoleWarn = jest.spyOn(log, 'warn');

			gpt.setup({ enableLazyLoad });

			expect(spyConsoleWarn).toBeCalledWith('lazyLoadConf must be either an object or a boolean', enableLazyLoad);
			expect(global.googletag.pubads().enableLazyLoad)
				.not.toBeCalled();

			spyConsoleWarn.mockReset();
		});

	});

});
