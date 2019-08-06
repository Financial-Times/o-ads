// babel.config.js
module.exports = api => {
	const config = {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: 'current',
					},
				},
			],
		],
	};

	if (api.env('test')) {
		config.plugins = ['babel-plugin-rewire'];
	}

	return config;
};
