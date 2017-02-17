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
	timing: 'ease-in-out',
	delay: '0s'
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
	family: 'Arial, Helvetica, sans-serif',
	size: '1.6rem',
	weight: {
		normal: 'normal',
		bold: 'bold'
	},
	lineHeight: '1em'
};

variables.heading = {
	color: variables.font.color,
	family: 'Tahoma, Geneva, sans-serif',
	weight: variables.font.weight.bold,
	lineHeight: '1.4em',
	margin: {
		bottom: '2rem'
	}
};

variables.h1 = '3.6rem';
variables.h2 = '3.2rem';
variables.h3 = '2.8rem';
variables.h4 = '2.4rem';
variables.h5 = '2rem';
variables.h6 = '1.6rem';

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
	border: {
		color: false,
		radius: false
	},
	padding: variables.block.margin.bottom
};

variables.figCaption = {
	color: variables.colors.darkGray,
	style: 'italic',
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

variables.small = {
	size: '0.8em'
};

variables.quote = {
	color: variables.colors.darkestGray,
	family: 'Georgia, Times, serif',
	size: '2rem',
	style: 'italic',
	weight: 'normal',
	lineHeight: '1.4em',
	padding: {
		horizontal: '2em',
		vertical: '1em'
	}
};

variables.cite = {
	color: variables.colors.gray,
	family: variables.font.family,
	size: '1.8rem',
	style: 'normal',
	weight: 'normal',
	lineHeight: '1.2em',
	margin: {
		top: '1.4rem'
	},
	indicator: "'\\2014\\00a0'"
};

variables.rule = {
	color: variables.colors.lightGray,
	height: '1px',
	style: 'solid',
	margin: {
		vertical: variables.block.margin.bottom
	}
};

variables.address = {
	color: variables.colors.darkestGray,
	family: variables.font.family,
	size: variables.font.size,
	weight: 'normal',
	style: 'normal',
	lineHeight: variables.paragraph.lineHeight
};

variables.list = {
	color: variables.paragraph.color,
	lineHeight: variables.paragraph.lineHeight,
	margin: {
		bottom: variables.paragraph.margin.bottom,
		left: false
	},
	bullet: {
		style: 'disc',
		position: 'inside'
	}
};

variables.nestedList = {
	margin: {
		left: '2rem'
	}
};

variables.li = {
	margin: {
		bottom: '0.2rem'
	}
};

variables.dl = {
	margin: {
		bottom: variables.block.margin.bottom
	}
};

variables.dt = {
	color: variables.colors.darkerGray,
	family: variables.heading.family,
	size: '2rem',
	margin: {
		bottom: '0.2rem'
	}
};

variables.dd = {
	color: variables.colors.gray,
	family: variables.font.family,
	size: variables.font.size,
	margin: {
		bottom: '1rem'
	}
};

variables.print = {
	page: {
		margin: '2cm .5cm'
	}
};

variables.button = {
	color: variables.colors.white,
	family: variables.font.family,
	size: variables.font.size,
	weight: 'normal',
	padding: {
		horizontal: '3rem',
		vertical: '1.3rem'
	},
	margin: {
		bottom: 0
	},
	transition: {
		property: 'background-color',
		duration: '0.2s'
	},
	background: variables.colors.darkGray,
	border: {
		color: false,
		radius: variables.default.radius,
		width: 0
	}
};

variables.button.hover = {
	background: darken(variables.button.background, 5)
};

variables.button.active = {
	background: darken(variables.button.background, 10),
	transition: {
		property: 'none'
	}
};

variables.coloredButton = {
	class: '.colored-button',
	color: variables.colors.white,
	background: variables.link.color,
	border: {
		color: false,
		radius: variables.button.border.radius,
		width: variables.button.border.width
	}
};

variables.coloredButton.hover = {
	background: darken(variables.coloredButton.background, 5)
};

variables.coloredButton.active = {
	background: darken(variables.coloredButton.background, 10)
};

variables.button.disabled = {
	modifier: '.-is-disabled',
	color: variables.colors.darkGray,
	background: variables.colors.lightGray,
	border: {
		color: false
	},
	cursor: 'not-allowed'
};

variables.code = {
	color: variables.colors.darkestGray,
	family: 'monospace',
	size: variables.font.size,
	lineHeight: '1.4em',
	background: variables.colors.lighterGray,
	border: {
		color: false,
		radius: false
	},
	padding: {
		horizontal: '0.5em',
		vertical: '0.2em'
	},
	rounded: false
};

variables.code.block = {
	color: variables.colors.lightestGray,
	family: variables.code.family,
	size: '1.3rem',
	lineHeight: variables.paragraph.lineHeight,
	tabSize: 4,
	wrap: false,
	margin: {
		bottom: variables.block.margin.bottom
	},
	background: variables.colors.darkestGray,
	border: {
		color: variables.code.border.color,
		radius: false
	},
	padding: {
		horizontal: '2rem',
		vertical: '1.4rem'
	},
	rounded: false
};

variables.table = {
	size: variables.font.size,
	cell: {
		borderColor: variables.colors.lighterGray,
		lineHeight: variables.paragraph.lineHeight,
		padding: {
			horizontal: '1.6rem',
			vertical: '.6rem'
		}
	},
	striped: {
		background: variables.colors.lightestGray,
		position: 'odd'
	}
};

variables.table.caption = {
	background: variables.colors.lightestGray,
	style: 'italic',
	padding: {
		horizontal: variables.table.cell.padding.horizontal,
		vertical: '1.2rem'
	}
};

module.exports = variables;