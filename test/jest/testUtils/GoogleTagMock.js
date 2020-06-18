/* eslint-env jest */

const pubadsMock = {
	addEventListener: jest.fn(),
	enableAsyncRendering: jest.fn(),
	enableLazyLoad: jest.fn(),
	setRequestNonPersonalizedAds: jest.fn(),
	setTargeting: jest.fn(),
};

const googleTagMock = jest.fn().mockImplementation(() => ({
 	cmd: { push: jest.fn() },
 	enableServices: jest.fn(),
 	pubads: () => pubadsMock,
}));

export default googleTagMock;
