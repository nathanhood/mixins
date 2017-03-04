const decl = require('postcss-js-mixins/lib/declaration');
const rule = require('postcss-js-mixins/lib/rule');
const { isObject, isEmpty, isPercentage, isColor, prefix, isNumber, hexToRgba, calcOpacity, isString, unit, toNumber, toPercentage } = require('postcss-js-mixins/lib/helpers');

module.exports = (vars = {}) => {
	return {
		/**
		 * Absolute positioning
		 *
		 * @param {string|number} [top]
		 * @param {string|number} [right]
		 * @param {string|number} [bottom]
		 * @param {string|number} [left]
		 * @returns {Array}
		 */
		absolute(top, right, bottom, left) {
			let props = [
				decl('position', 'absolute')
			];

			if (top) {
				props.push(decl('top', top));
			}

			if (right) {
				props.push(decl('right', right));
			}

			if (bottom) {
				props.push(decl('bottom', bottom));
			}

			if (left) {
				props.push(decl('left', left));
			}

			return props;
		},

		/**
		 * Background
		 *
		 * @param {number|string} [color]
		 * @param {number|string} [opacity] - Opacity or filename
		 * @param {string} [repeat] - Repeat or attachment
		 * @param {number|string} [attachment] - Attachment or x
		 * @param {number|string} [x] - X or y
		 * @param {number|string} [y]
		 * @returns {Object}
		 */
		background(color = vars.colors.body.background, opacity, repeat, attachment, x, y) {
			let prop = color;

			if (prop === 0) {
				return decl('background', 'transparent');
			}

			if (opacity) {
				if (isNumber(opacity)) {
					prop = hexToRgba(prop, opacity);
				} else {
					prop += ` ${opacity}`;
				}
			}

			if (repeat) {
				prop += ` ${repeat}`;
			}

			if (attachment) {
				prop += ` ${attachment}`;
			}

			if (x) {
				prop += ` ${x}`;
			}

			if (y) {
				prop += ` ${y}`;
			}

			return decl('background', prop);
		},

		/**
		 * Display block
		 *
		 * @param {number|string} [width]
		 * @param {number|string} [height]
		 * @returns {Array}
		 */
		block(width, height) {
			let props = [
				this.display('block')
			];

			if (width) {
				props.push(decl('width', width));
			}

			if (height) {
				props.push(decl('height', height));
			}

			return props;
		},

		/**
		 * Font weight bold
		 *
		 * @returns {Object}
		 */
		bold() {
			return decl('font-weight', vars.font.weight.bold);
		},

		/**
		 * Border
		 *
		 * @param args
		 * @returns {*}
		 */
		border(...args) {
			let keywords = [
					'top',
					'right',
					'bottom',
					'left',
					'vertical',
					'horizontal'
				],
				defaultValues = [
					vars.border.width,
					vars.border.style,
					vars.border.color
				],
				borders = [],
				keyword = null,
				values = [];

			if (args[0] === false || args[0] === 0 || args[0] === 'none') {
				return decl('border', 'none');
			}

			// Default border
			if (isEmpty(args)) {
				return decl('border', defaultValues.join(' '));
			}

			if (keywords.includes(args[0])) {
				keyword = args[0];
				args.splice(0, 1);
			}

			values.push(unit(args[1] || defaultValues[0], 'border-width'));
			values.push(unit(args[2] || defaultValues[1], 'border-style'));
			values.push(unit(args[0] || defaultValues[2], 'border-color'));

			if (keyword == 'vertical') {
				borders = [
					'border-top',
					'border-bottom'
				];
			} else if (keyword == 'horizontal') {
				borders = [
					'border-left',
					'border-right'
				];
			} else if (keyword) {
				borders.push(prefix(keyword, 'border'));
			}

			if (borders.length) {
				return decl.createMany(borders, values.join(' '));
			}

			return decl('border', values.join(' '));
		},

		/**
		 * Apply default value to box sizing
		 *
		 * @param {string} value
		 * @returns {Declaration}
		 */
		boxSizing(value = 'border-box') {
			return decl('box-sizing', value);
		},

		/**
		 * A block level element, centered with margin
		 *
		 * @param {number|string} [maxWidth]
		 * @param {number|string} [margin]
		 * @returns {Array}
		 */
		centeredBlock(maxWidth, margin) {
			let props = [
				decl('display', 'block'),
				decl('margin-left', 'auto'),
				decl('margin-right', 'auto')
			];

			if (maxWidth) {
				props.push(decl('max-width', maxWidth));
			}

			if (margin) {
				props.push(decl('margin-bottom', margin));
			}

			return props;
		},

		/**
		 * Clear left, right, or both
		 *
		 * @param {string} [value=both]
		 * @returns {Object}
		 */
		clear(value = 'both') {
			return decl('clear', value);
		},

		/**
		 * Clearfix
		 *
		 * @return {Object}
		 */
		clearfix() {
			return rule('&:after', [
				this.clear(),
				this.content(),
				this.display('block')
			]);
		},

		/**
		 * Color
		 *
		 * @param  {string} value
		 * @return {Object}
		 */
		color(value) {
			return decl('color', value);
		},

		/**
		 * Grid column
		 *
		 * @param {number|string} [keyword]
		 * @param {number} [share]
		 * @param {number} [columns]
		 * @param {string} [margin]
		 * @returns {Array}
		 */
		column(keyword, share, columns = vars.grid.columns, margin = vars.grid.margin) {
			let props = [
					decl('float', 'left')
				],
				width = (1 / parseInt(columns)) * parseInt(share);

			if (! keyword) {
				props.push(decl('width', '100%'));

				return props;
			}

			if (isPercentage(keyword)) {
				props.push(decl('width', keyword));

				return props;
			}

			if (keyword === 'spaced') {
				return props.concat([
					decl('margin-left', margin),
					decl('width', toPercentage((width) - toNumber(margin)))
				]);
			}

			// If not 'spaced', arguments are shifted
			if (isNumber(keyword)) {
				columns = share || columns;
				share = keyword;
			}

			props.push(decl('width', toPercentage((1 / parseInt(columns)) * parseInt(share))));

			return props;
		},

		/**
		 * Modify grid column
		 *
		 * @param {number|string} keyword
		 * @param {number} [share]
		 * @param {number} [columns]
		 * @param {string} [margin]
		 * @returns {Array|Object}
		 */
		columnModify(keyword, share, columns = vars.grid.columns, margin = vars.grid.margin) {
			let width = (1 / parseInt(columns)) * parseInt(share);

			if (isPercentage(keyword)) {
				return decl('width', keyword);
			}

			if (keyword === 'spaced') {
				return [
					decl('margin-left', margin),
					decl('width', toPercentage((width) - toNumber(margin)))
				];
			}

			// If not 'spaced', arguments are shifted
			if (isNumber(keyword)) {
				columns = share || columns;
				share = keyword;
			}

			return decl('width', toPercentage((1 / parseInt(columns)) * parseInt(share)));
		},

		/**
		 * Columns
		 *
		 * @param {number} count
		 * @param {number} gap
		 * @param {string} style
		 * @param {number|string} width
		 * @returns {Array}
		 */
		columns(count = 2, gap, style, width = '1px') {
			let props = [
				decl('column-count', count),
				decl('column-rule-width', width)
			];

			if (gap) {
				props.push(decl('column-gap', gap));
			}

			if (style) {
				props.push(decl('column-rule-style', style));
			}

			return props;
		},

		/**
		 * Conditionally add min-width property to both html and body elements
		 *
		 * @returns {*}
		 */
		containerMinWidth() {
			let minWidth = vars.width.min;

			if (minWidth !== 0) {
				return rule('html, body', [
					decl('min-width', minWidth)
				]);
			}

			return false;
		},

		/**
		 * Empty content block
		 *
		 * @returns {Declaration}
		 */
		content() {
			return decl('content', '\'\'');
		},

		/**
		 * Set display
		 *
		 * @param  {string} value
		 * @return {Object}
		 */
		display(value) {
			return decl('display', value);
		},

		/**
		 * Filter
		 *
		 * @param {string} value
		 * @returns {Object}
		 */
		filter(value) {
			return decl('filter', value);
		},

		/**
		 * Blur
		 *
		 * @param {string} value
		 * @returns {Object}
		 */
		blur(value = '2px') {
			return this.filter(`blur(${value})`);
		},

		/**
		 * Brightness
		 *
		 * @param {number} value
		 * @returns {Object}
		 */
		brightness(value = 0.5) {
			return this.filter(`brightness(${value})`);
		},

		/**
		 * Contrast
		 *
		 * @param {number} value
		 * @returns {Object}
		 */
		contrast(value = 1.5) {
			return this.filter(`contrast(${value})`);
		},

		/**
		 * Grayscale
		 *
		 * @param {number} value
		 * @returns {Object}
		 */
		grayscale(value = 1) {
			return this.filter(`grayscale(${value})`);
		},

		/**
		 * Hue rotate
		 *
		 * @param {string} value
		 * @returns {Object}
		 */
		hueRotate(value = '180deg') {
			return this.filter(`hue-rotate(${value})`);
		},

		/**
		 * Invert
		 *
		 * @param {number} value
		 * @returns {Object}
		 */
		invert(value = 1) {
			return this.filter(`invert(${value})`);
		},

		/**
		 * Saturate
		 * @param {number} value
		 * @returns {Object}
		 */
		saturate(value = 0.5) {
			return this.filter(`saturate(${value})`);
		},

		/**
		 * Sepai
		 *
		 * @param {number} value
		 * @returns {Object}
		 */
		sepia(value = 0.5) {
			return this.filter(`sepia(${value})`);
		},

		/**
		 * Drop shadow
		 *
		 * @param {string} color
		 * @param {string} x
		 * @param {string} y
		 * @param {number} blur
		 * @param {number} opacity
		 * @returns {object}
		 */
		dropShadow(color, x = '1px', y = '1px', blur = 0, opacity = vars.default.opacity) {
			let colorResult = color;

			if (! color) {
				colorResult = `rgba(0, 0, 0, ${opacity})`;
			}

			if (color === 'light') {
				colorResult = `rgba(255, 255, 255, ${opacity})`;
			} else if (color === 'dark') {
				colorResult = `rgba(0, 0, 0, ${opacity})`;
			}

			return this.filter(`drop-shadow(${x} ${y} ${blur} ${colorResult})`);
		},

		/**
		 * Fixed positioning
		 *
		 * @param {number|string} [top]
		 * @param {number|string} [right]
		 * @param {number|string} [bottom]
		 * @param {number|string} [left]
		 * @returns {Array}
		 */
		fixed(top, right, bottom, left) {
			let props = [
				decl('position', 'fixed')
			];

			if (top) {
				props.push(decl('top', top));
			}

			if (right) {
				props.push(decl('right', right));
			}

			if (bottom) {
				props.push(decl('bottom', bottom));
			}

			if (left) {
				props.push(decl('left', left));
			}

			return props;
		},

		/**
		 * Flex
		 *
		 * @param {number} grow
		 * @param {number} shrink
		 * @param {string} basis
		 * @returns {Array}
		 */
		flex(grow = 0, shrink = 0, basis = 'auto') {
			return [
				decl('flex-grow', grow),
				decl('flex-shrink', shrink),
				decl('flex-basis', basis)
			];
		},

		/**
		 * Flex container
		 *
		 * @param {Array|Object} [args]
		 * 	 @param {string} [args[].direction]
		 * 	 @param {string} [args[].wrap]
		 * 	 @param {string} [args[].justify-content]
		 * 	 @param {string} [args[].align-items]
		 * 	 @param {string} [args[].align-content]
		 * @returns {Array}
		 */
		flexContainer(...args) {
			// TODO: Need to figure out how to handle passing parameters as
			// object with defaults

			return [
				this.display(args[0] || 'flex'),
				decl('flex-direction', args[1] || 'row'),
				decl('flex-wrap', args[2] || 'nowrap'),
				decl('justify-content', args[3] || 'flex-start'),
				decl('align-items', args[4] || 'stretch'),
				decl('align-content', args[5] || 'stretch')
			];
		},

		/**
		 * Font
		 *
		 * @param {string} [family]
		 * @param {number} size
		 * @param {number|string} weight
		 * @param {string} lineHeight
		 * @param {string} style
		 * @returns {Array}
		 */
		font(family = vars.font.family, size, weight, lineHeight, style) {
			let props = [
				decl('font-family', family)
			];

			if (size) {
				props.push(decl('font-size', size));
			}

			if (weight) {
				props.push(decl('font-weight', weight));
			}

			if (lineHeight) {
				props.push(decl('line-height', lineHeight));
			}

			if (style) {
				props.push(decl('font-style', style));
			}

			return props;
		},

		/**
		 * Default styling for headings
		 *
		 * @returns {Array}
		 */
		heading() {
			return [
				decl('color', vars.heading.color),
				decl('font-family', vars.heading.family),
				decl('font-weight', vars.heading.weight),
				decl('line-height', vars.heading.lineHeight),
				decl('margin-bottom', vars.heading.margin.bottom),
				rule('small', [
					decl('font-weight', 'normal')
				])
			];
		},

		/**
		 * Display inline
		 *
		 * @return {Object}
		 */
		inline() {
			return this.display('inline');
		},

		/**
		 * Display inline block
		 *
		 * @param {number|string} [width]
		 * @param {number|string} [height]
		 * @returns {Array}
		 */
		inlineBlock(width, height) {
			let props = [
				decl('display', 'inline-block')
			];

			if (width) {
				props.push(decl('width', width));
			}

			if (height) {
				props.push(decl('height', height));
			}

			return props;
		},

		/**
		 * Font style italic
		 *
		 * @return {Object}
		 */
		italic() {
			return decl('font-style', 'italic');
		},

		/**
		 * Float left or position left
		 *
		 * @param {string} [value]
		 * @return {Object}
		 */
		left(value) {
			if (isEmpty(value)) {
				return decl('float', 'left');
			}

			return decl('left', value);
		},

		/**
		 * Show element
		 *
		 * @return {Object}
		 */
		hidden() {
			return this.visibility('hidden');
		},

		/**
		 * Hide element
		 *
		 * @return {Object}
		 */
		hide() {
			return this.display('none');
		},

		/**
		 * Load font
		 *
		 * @param {string} name
		 * @param {string} [file]
		 * @param {string} [weight]
		 * @param {string} [style]
		 * @returns {*}
		 */
		loadFont(name, file = name, weight = 'normal', style = 'normal') {
			if (! name) {
				return false;
			}

			let props = [],
				filePath = `${vars.font.path}${file}`;

			props = props.concat(this.font(name, null, weight, null, style));
			props.push(decl('src', `url('${filePath}.woff2'), url('${filePath}.woff'), url('${filePath}.ttf')`));

			return rule('@font-face', props);
		},

		/**
		 * Margin
		 *
		 * @param {string} keyword
		 * @param {number|string} top
		 * @param {number|string} right
		 * @param {number|string} bottom
		 * @param {number|string} left
		 * @returns {Array|Object}
		 */
		margin(keyword, top, right, bottom, left) {
			let keywords = ['none', 'horizontal', 'vertical'],
				props = [];

			if (keywords.includes(keyword)) {
				let bottom = right || top,
					args = [top, bottom];

				if (keyword === 'none') {
					return decl('transition', 'none');
				}

				if (keyword === 'horizontal') {
					return decl.createMany(['left', 'right'], args, 'margin');
				}

				if (keyword === 'vertical') {
					return decl.createMany(['top', 'bottom'], args, 'margin');
				}
			}

			if (top) {
				props.push(decl('margin-top', top));
			}

			if (right) {
				props.push(decl('margin-right', right));
			}

			if (bottom) {
				props.push(this.spaced(bottom));
			}

			if (left) {
				props.push(decl('margin-left', left));
			}

			return props;
		},

		/**
		 * Output min-width and/or min-height
		 *
		 * @param {string|number} width
		 * @param {string|number} height
		 * @return {Array}
		 */
		minSize(width, height) {
			let props = [
				decl('min-width', width)
			];

			if (! height) {
				props.push(decl('min-height', width));
			} else {
				props.push(decl('min-height', height));
			}

			return props;
		},

		/**
		 * Opacity
		 *
		 * @param  {string} value
		 * @return {Object}
		 */
		opacity(value) {
			return decl('opacity', calcOpacity(value));
		},

		/**
		 * Set opacity to 1
		 *
		 * @return {Object}
		 */
		opaque() {
			return this.opacity(1);
		},

		/**
		 * Padding
		 *
		 * @param {Array} args
		 * @returns {Array|boolean}
		 */
		padding(keyword, top, right, bottom, left) {
			let keywords = ['horizontal', 'vertical'],
				props = [];

			if (keywords.includes(keyword)) {
				let bottom = right || top,
					args = [top, bottom];

				if (keyword === 'horizontal') {
					return decl.createMany(['left', 'right'], args, 'padding');
				}

				if (keyword === 'vertical') {
					return decl.createMany(['top', 'bottom'], args, 'padding');
				}
			}

			if (top) {
				props.push(decl('padding-top', top));
			}

			if (right) {
				props.push(decl('padding-right', right));
			}

			if (bottom) {
				props.push(decl('padding-bottom', bottom));
			}

			if (left) {
				props.push(decl('padding-left', left));
			}

			return props;
		},

		/**
		 * Placeholder
		 *
		 * @param color
		 * @returns {*[]}
		 */
		placeholder(color = vars.input.placeholder.color) {
			let props = [
				decl('color', color)
			];

			return [
				rule('&:-moz-placeholder', props),
				rule('&::-moz-placeholder', props),
				rule('&:-ms-input-placeholder', props),
				rule('&::-webkit-input-placeholder', props)
			];
		},

		/**
		 *
		 * @param {string} value
		 * @returns {array}
		 */
		resizable(value = 'both') {
			return [
				decl('overflow', 'hidden'),
				decl('resize', value)
			];
		},

		/**
		 * Float right or position right
		 *
		 * @param {string} [value]
		 * @return {Object}
		 */
		right(value) {
			if (isEmpty(value)) {
				return decl('float', 'right');
			}

			return decl('right', value);
		},

		/**
		 * Border radius
		 *
		 * @param args
		 */
		rounded(...args) {
			let props = [
					decl('background-clip', 'border-box')
				],
				keywords = ['top', 'right', 'bottom', 'left'],
				radius = vars.default.radius,
				keyword = args[0],
				corners = [];

			if (isEmpty(args)) {
				props.push(decl('border-radius', radius));
			} else if (args[0] === false) {
				return false;
			} else if (! keywords.includes(args[0])) {
				props.push(decl('border-radius', args[0]));
			} else {
				if (keyword === 'top') {
					corners = ['top-left-radius', 'top-right-radius'];
				} else if (keyword === 'right') {
					corners = ['top-right-radius', 'bottom-right-radius'];
				} else if (keyword === 'bottom') {
					corners = ['bottom-left-radius', 'bottom-right-radius'];
				} else if (keyword === 'left') {
					corners = ['top-left-radius', 'bottom-left-radius'];
				}

				props = props.concat(decl.createMany(corners, args[1] || radius, 'border'));
			}

			return props;
		},

		/**
		 * Grid row
		 *
		 * @param  {string|number} margin
		 * @return {Array}
		 */
		row(margin) {
			margin = margin || vars.grid.margin.replace('%', '');
			margin = parseInt(margin);

			return [
				decl('margin-left', `${margin * -1}%`),
				decl('max-width', `${margin + 100}%`),
				this.clearfix()
			];
		},

		/**
		 * Grid row modify
		 *
		 * @param  {string|number} margin
		 * @return {Array}
		 */
		rowModify(margin) {
			margin = margin || vars.grid.margin.replace('%', '');
			margin = parseInt(margin);

			return [
				decl('margin-left', `${margin * -1}%`),
				decl('max-width', `${margin + 100}%`)
			];
		},

		/**
		 * Grid row reset
		 *
		 * @return {Array}
		 */
		rowReset() {
			return [
				decl('margin-left', 0),
				decl('max-width', 'none')
			];
		},

		/**
		 * Shadow
		 *
		 * @param args
		 * @returns {*}
		 */
		shadow(...args) {
			let keywords = ['dark', 'light'];

			if (isEmpty(args)) {
				return decl('box-shadow', `1px 1px 0 0 rgba(0, 0, 0, ${vars.default.opacity})`);
			}

			if (keywords.includes(args[0])) {
				let keyword = args.shift(),
					rgb = keyword === 'dark' ?
						'0, 0, 0' :
						'255, 255, 255',
					opacity = args[0] || vars.default.opacity;

				return decl('box-shadow', `1px 1px 0 0 rgba(${rgb}, ${opacity})`)
			}

			return false;
		},

		/**
		 * Show element
		 *
		 * @return {Object}
		 */
		show() {
			return this.display('inherit');
		},

		/**
		 * Output width and/or height
		 *
		 * @param  {string} width
		 * @param  {string} height
		 * @return {Array}
		 */
		size(width, height) {
			let props = [
				decl('width', width)
			];

			if (! height) {
				props.push(decl('height', width));
			} else {
				props.push(decl('height', height));
			}

			return props;
		},

		/**
		 * Add a specified margin bottom.
		 *
		 * @return {Array}
		 */
		spaced(value = vars.block.margin.bottom) {
			return decl('margin-bottom', value);
		},

		/**
		 * Spaced block
		 *
		 * @param {number|string} [margin]
		 * @param {number|string} [width]
		 * @param {number|string} [height]
		 * @returns {Array}
		 */
		spacedBlock(margin = vars.block.margin.bottom, width, height) {
			let props = [
				decl('display', 'block'),
				this.spaced(margin)
			];

			if (width) {
				props.push(decl('width', width));
			}

			if (height) {
				props.push(decl('height', height));
			}

			return props;
		},

		/**
		 * Transition shorthand declaration
		 *
		 * @param {string} [property]
		 * @param {string} [duration]
		 * @param {string} [easing]
		 * @param {string} [delay]
		 * @returns {Object}
		 */
		transition(property = 'all', duration = vars.default.duration, easing = vars.default.timing, delay = '0s') {
			if (property === 'none') {
				return decl('transition', 'none');
			}

			return decl('transition', `${property} ${duration} ${easing} ${delay}`);
		},

		/**
		 * Set opacity to 0
		 *
		 * @return {Object}
		 */
		transparent() {
			return this.opacity(0);
		},

		/**
		 * List style: none
		 *
		 * @return {Object}
		 */
		unstyled() {
			return decl('list-style', 'none');
		},

		/**
		 * Show element
		 *
		 * @return {Object}
		 */
		visible() {
			return this.visibility('visible');
		},

		/**
		 * Visibility
		 *
		 * @param  {string} [value]
		 * @return {Object}
		 */
		visibility(value) {
			return decl('visibility', value);
		},

		/**
		 * Code block defaults
		 *
		 * @param {string|boolean} borderColor
		 * @param {boolean} blockWrap
		 * @returns {Array}
		 * @private
		 */
		_codeBlockDefaults(borderColor, blockWrap) {
			let props = [];

			if (borderColor && borderColor !== false) {
				props = props.concat(this.border('none'));
			}

			if (blockWrap) {
				props.push(decl('white-space', 'pre-wrap'));
				props.push(decl('word-wrap', 'break-word'));
			} else {
				props.push(decl('overflow', 'auto'));
				props.push(decl('white-space', 'pre'));
			}

			return props;
		}
	};
};