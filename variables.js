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

variables.default = {
	radius: '3px',
	opacity: 0.2,
	duration: '0.2s',
	timing: 'ease-in-out'
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
		bottom: '4rem'
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

variables.font = {
	color: variables.colors.darkestGray,
	family: 'Arial Helvetica sans-serif',
	size: '1.6rem',
	weight: {
		normal: 'normal',
		bold: 600
	},
	lineHeight: '1em'
};

variables.mark = {
	color: variables.font.color,
	background: 'yellow'
};

variables.abbr = {
	underline: 'dotted'
};

variables.border = {
	color: variables.colors.lightGray,
	style: 'solid',
	width: '1px'
};

variables.paragraph = {
	color: variables.font.color,
	weight: variables.font.weight.normal,
	lineHeight: '1.7em',
	margin: {
		bottom: '2rem'
	}
};

variables.figure = {
	borderColor: false,
	rounded: false,
	padding: variables.block.margin.bottom
};

variables.figCaption = {
	color: variables.colors.darkGray,
	fontStyle: 'italic',
	lineHeight: variables.paragraph.lineHeight
};

variables.link = {
	color: variables.colors.primary,
	decoration: 'none'
};

variables.link.hover = {
	color: darken(variables.link.color, 10),
	decoration: 'none'
};

variables.link.active = {
	color: darken(variables.link.color, 20)
};

variables.selection = {
	color: variables.colors.white,
	background: variables.link.color
};

module.exports = variables;