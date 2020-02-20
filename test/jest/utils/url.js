/* eslint-env jest */

import {
	stripUrlParams,
	filterNestedParams,
	SEARCH_PARAMS
} from '../../../src/js/utils/url';

describe('filterNestedParams', () => {
	describe.each([
		[['', SEARCH_PARAMS], ''],
		[['q=goog', SEARCH_PARAMS], ''],
		[['q=goog&a=1&b=2&c=3', SEARCH_PARAMS], 'a=1&b=2&c=3'],
		[['q=goog&a=1&b=2&c=3', ["a", "b", "x"]], 'q=goog&c=3'],
		[['q=goog&a=1&b=2&c=3', null], 'q=goog&a=1&b=2&c=3'],
		[['q=goog&a=1&b=2&c=3', undefined], 'q=goog&a=1&b=2&c=3'],
		[['q=goog&a=1&b=2&c=3', []], 'q=goog&a=1&b=2&c=3'],
	])('filterNestedParams(%s)', (input, expected) => {
		test(`returns ${expected}`, () => {
			// @ts-ignore: destructuring is correct
			expect(filterNestedParams(...input)).toBe(expected);
		});
	});
});

describe('it can consume an instance of window.location', () => {
	const location = {
		href: 'https://www.ft.com/search?q=goog',
		origin: 'https://www.ft.com',
		protocol: 'https:',
		host: 'www.ft.com',
		hostname: 'www.ft.com',
		port: '',
		pathname: '/search',
		search: '?q=goog',
		hash: '',
		toString: function() {
			return this.href;
		}
	};
	const filters = { root: SEARCH_PARAMS };

	describe.each([[{ href: location, filters }, 'https://www.ft.com/search']])(
		'stripUrlParams(%o)',
		({ href, filters }, expected) => {
			test(`returns ${expected}`, () => {
				expect(stripUrlParams({ href, filters })).toBe(expected);
			});
		}
	);
});

describe('it can consume strings', () => {
	const filters = { root: SEARCH_PARAMS };

	describe.each([
		[
			{ href: 'https://www.ft.com/search?q=goog', filters },
			'https://www.ft.com/search'
		],
		[
			{ href: 'https://www.ft.com/search?kw=goog', filters },
			'https://www.ft.com/search'
		],
		[
			{
				href:
					'https://www.ft.com/search?q=goog&dateRange=now-30d&sort=relevance&expandRefinements=true&contentType=video',
				filters: { root: [...SEARCH_PARAMS, 'contentType'] }
			},
			'https://www.ft.com/search?dateRange=now-30d&sort=relevance&expandRefinements=true'
		]
	])('stripUrlParams(%o)', (input, expected) => {
		test(`returns ${expected}`, () => {
			expect(stripUrlParams(input)).toBe(expected);
		});
	});
});

describe('It can consume complex nested URLs', () => {
	const filters = {
		root: ['gdfp_req', 'correlator', 'missing'],
		cust_params: [...SEARCH_PARAMS, 'url', 'missing']
	};

	describe.each([
		[
			'https://securepubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=1582019632810904&output=json_html&impl=fif&sc=1&sfv=1-0-4&iu=%2F5887%2Fft.com/world&sz=320x50&fluid=height&scp=pos%3Dnative&d_imp=1&ga_sid=1582019632810&cust_params=device_spoor_id%3Dck6rpj5hv00012z5t4piclqpi%26guid%3D01168978-c5e1-4701-a2bb-6d0771485525%26slv%3Dreg%26loggedIn%3Dtrue%2605%3Dacc%2606%3Dfin%2607%3Dan%26cc%3Dy%26pt%3Dstr%26nlayout%3Ddefault%26mvt%3DsubscriberCohort%25253Aon%25252Cxteaserpagesv2%25253Avariant%25252CadsAppLazyloadingThresholdsMVT%25253Acontrol%25252CmanageCancellationJourney%25253Acontrol%25252Candroidactionbar%25253Avariant%25252CmyFTTopicCarousel%25253Acontrol%25252CmyFTDedupingStrategy%25253Acontrol%26rootid%3Dck6rpn4z500012z5tpu7jw1fk%26ts%3D20200218095352%26res%3Dextra%26ftpb%3D1%26url%3Dhttps%253A%252F%252Fwww.ft.com%252Fworld%26q%3Dgoog',
			'https://securepubads.g.doubleclick.net/gampad/ads?output=json_html&impl=fif&sc=1&sfv=1-0-4&iu=%2F5887%2Fft.com%2Fworld&sz=320x50&fluid=height&scp=pos%3Dnative&d_imp=1&ga_sid=1582019632810&cust_params=device_spoor_id%3Dck6rpj5hv00012z5t4piclqpi%26guid%3D01168978-c5e1-4701-a2bb-6d0771485525%26slv%3Dreg%26loggedIn%3Dtrue%2605%3Dacc%2606%3Dfin%2607%3Dan%26cc%3Dy%26pt%3Dstr%26nlayout%3Ddefault%26mvt%3DsubscriberCohort%25253Aon%25252Cxteaserpagesv2%25253Avariant%25252CadsAppLazyloadingThresholdsMVT%25253Acontrol%25252CmanageCancellationJourney%25253Acontrol%25252Candroidactionbar%25253Avariant%25252CmyFTTopicCarousel%25253Acontrol%25252CmyFTDedupingStrategy%25253Acontrol%26rootid%3Dck6rpn4z500012z5tpu7jw1fk%26ts%3D20200218095352%26res%3Dextra%26ftpb%3D1'
		]
	])('stripUrlParams(doubleclickUrl)', (input, expected) => {
		test(`returns ${expected}`, () => {
			expect(stripUrlParams({ href: input, filters })).toBe(expected);
		});
	});
});
