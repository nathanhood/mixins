const postcss = require('postcss');
const fs = require('fs');
const variables = require('postcss-variables');
const mixins = require('postcss-js-mixins');
const nested = require('postcss-nested');
const globalVars = require('./variables')();
const plugins = [
	variables({
		globals: globalVars
	}),
	mixins({
		mixins: require('./mixins')(globalVars)
	}),
	nested()
];

const css = fs.readFileSync('./styles/components/tables.pcss');

postcss(plugins).process(css, {
		syntax: require('postcss-wee-syntax')
	})
	.then(result => {
		fs.writeFileSync('./output.css', result);
	})
	.catch(err => {
		console.log(err);
	});