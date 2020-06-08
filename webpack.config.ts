import { Configuration } from "webpack";
import * as path from 'path';

module.exports = (env: any, argv: Configuration) => <Configuration>{
	entry: {
		bundle: ['./src/main.ts']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.css', '.svelte'],
		mainFields: ['browser', 'module', 'main'],
	},
	output: {
		path: __dirname + '/out',
		filename: '[name].js',
		chunkFilename: '[name].[id].js',
	},
	devtool: argv.mode == 'production' ? false : 'source-map',
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
					},
				},
			},
			{ test: /\.css/, loader: ['style-loader', 'css-loader'] },
			{ include: /\.ts$/, loader: 'ts-loader' },
		],
	},
	devServer: {
		contentBase: path.join(__dirname, 'out'),
		
		port: 8000,
	}
};
