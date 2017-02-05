const { darken } = require('postcss-js-mixins/lib/colorHelpers');

let variables = {};

variables.unit = {
	default: 'rem',
	fontSize: 'rem',
	lineHeight: 'em'
};

variables.root = {
	fontSize: '62.5%'
};

variables.width = {
	min: 0,
	max: '1280px'
};

variables.bumper = {
	enabled: true,
	padding: '6%'
};

variables.block = {
	margin: {
		bottom: 4
	}
};

variables.grid = {
	margin: '5%',
	columns: 8,
	spaceless: false
};

variables.colors = {
	primary: '#349bb9',
	secondary: '#70c1b3',
	tertiary: '#f18f01',
	info: '#00f',
	success: '#008000',
	warning: '#f00',
	white: '#fff',
	lightestGray: darken('#fff', 4),
	lighterGray: darken('#fff', 10),
	lightGray: darken('#fff', 25),
	gray: darken('#fff', 35),
	darkGray: darken('#fff', 55),
	darkerGray: darken('#fff', 65),
	darkestGray: darken('#fff', 75),
	black: '#000'
};

variables.colors.body = {
	background: variables.colors.white
};

variables.base = {
	color: variables.colors.darkestGray,
	font: {
		family: 'Arial Helvetica sans-serif',
		size: 1.6,
		weight: {
			normal: 'normal',
			bold: 600
		}
	},
	lineHeight: '1em'
};

variables.abbr = {
	underline: 'dotted'
};

variables.border = {
	color: variables.colors.lightGray,
	style: 'solid',
	width: '1px'
};

module.exports = variables;