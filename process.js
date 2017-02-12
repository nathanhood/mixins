const postcss = require('postcss');
const fs = require('fs');
const variables = require('postcss-variables');
const mixins = require('postcss-js-mixins');
const plugins = [
	variables({
		globals: require('./variables')
	}),
	mixins({
		mixins: require('./mixins')
	})
];
const css = fs.readFileSync('./styles/wee.reset.pcss');

postcss(plugins).process(css, {
		syntax: require('postcss-wee-syntax')
	})
	.then(result => {
		fs.writeFileSync('./output.css', result);
	})
	.catch(err => {
		console.log(err);
	});