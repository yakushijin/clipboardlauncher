const path = require('path');

module.exports = {
	mode: 'none',
	entry: './res/js/main.js',
	output: {
		  filename: 'bundle.js',
		  path: path.join(__dirname, 'public')
	},
	module: {
	  rules: [
		{
		  test: /\.(js|jsx)$/,
		  exclude: /node_modules/,
		  loader: 'babel-loader',
		  options: {
			presets: ["@babel/preset-env","@babel/preset-react"],
		  }
		}
	  ]
	}
  };
