const webpack = require('webpack');
const { merge } = require('webpack-merge');

const devConfig = {
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.NormalModuleReplacementPlugin(/^sinon$/, require.resolve('sinon')),
		new webpack.NormalModuleReplacementPlugin(/^sinon\/pkg\/sinon$/, require.resolve('sinon')),
		new webpack.NormalModuleReplacementPlugin(/^proclaim$/, require.resolve('proclaim')),
	],
	devtool: 'inline-source-map',
};

const config = merge(require('./webpack.config'), devConfig);

module.exports = config;
