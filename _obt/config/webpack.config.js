module.exports = {
	// Fail out on the first error instead of tolerating it.
	// By default webpack will log these errors in red in the terminal,
	// as well as the browser console when using HMR,
	// but continue bundling.
	bail: true,
	module: {
		rules: [
			// Disable require.ensure as it's not a standard language feature.
			{ parser: { requireEnsure: false } },
			// Process JS with Babel.
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['@babel/plugin-transform-runtime'],
						},
					},
				],
			},

			// Components which are importing html/mustache/txt/text files into their JS:
			// markets-chat, o-chat, web-chat
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: require.resolve('raw-loader'),
			},
			{
				test: /\.mustache$/,
				exclude: /node_modules/,
				use: require.resolve('raw-loader'),
			},
			{
				test: /\.txt$/,
				exclude: /node_modules/,
				use: require.resolve('raw-loader'),
			},
			{
				test: /\.text$/,
				exclude: /node_modules/,
				use: require.resolve('raw-loader'),
			},
		],
	},
	output: {
		devtoolModuleFilenameTemplate: '[resource-path]',
		filename: 'main.js',
	},
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
};
