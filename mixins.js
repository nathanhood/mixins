const decl = require('postcss-js-mixins/lib/declaration');
const rule = require('postcss-js-mixins/lib/rule');
const { isObject, isEmpty, isPercentage, isColor, prefix, isNumber, hexToRgba, calcOpacity, isString, unit } = require('postcss-js-mixins/lib/helpers');


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
			}``

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
		 * Columns
		 *
		 * @param {Array} [args]
		 * @param {Array} [args[]] - count
		 * @param {Array} [args[]] - gap
		 * @param {Array} [args[]] - rule style
		 * @param {Array} [args[]] - rule width
		 * @returns {Array}
		 */
		columns(...args) {
			let props = [
				decl('column-count', 2),
				decl('column-rule-width', '1px')
			];

			if (isEmpty(args)) {
				return props;
			}

			props[0] = decl('column-count', args[0]);

			if (args[1]) {
				props.push(decl('column-gap', args[1]));
			}

			if (args[2]) {
				props.push(decl('column-rule-style', args[2]));
			}

			if (args[3]) {
				props[1] = decl('column-rule-width', args[3]);
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
		 * @param {Array|Object} args
		 * @returns {Array}
		 */
		dropShadow(...args) {
			let keywords = [ 'light', 'dark' ],
				defaults = {
					opacity: vars.default.opacity,
					x: '1px',
					y: '1px',
					blur: 0
				};

			if (isEmpty(args)) {
				let { opacity, x, y, blur } = defaults;

				return this.filter(`drop-shadow(${x} ${y} ${blur} rgba(0, 0, 0, ${opacity}))`);
			}

			if (isString(args[0])) {
				if (args.length === 1) {
					return this.filter(`drop-shadow(${args[0]})`);
				}
				
				// TODO: Can't pass single values with key value pairs
				// else if (args.length > 1) {
				// 	let { x, y } = Object.assign(defaults, args[1]);
				//
				// 	return this.filter(`drop-shadow(${x} ${y})`);
				// }

				return false;
			}

			if (isObject(args[0]) && args[0].hasOwnProperty('color')) {
				let { x, y, blur, color } = Object.assign(defaults, args[0]);

				return this.filter(`drop-shadow(${x} ${y} ${blur} ${color})`);
			}

			return false;
		},

		/**
		 * Fixed positioning
		 *
		 * @param {string|number|Object} [args[]] - top or object of positions
		 *	 @param {string|number} [args[].top]
		 *	 @param {string|number} [args[].right]
		 *	 @param {string|number} [args[].bottom]
		 *	 @param {string|number} [args[].left]
		 * @param {string|number} [args[]] - right
		 * @param {string|number} [args[]] - bottom
		 * @param {string|number} [args[]] - left
		 * @return {Array}
		 */
		fixed(...args) {
			props = [
				decl('position', 'fixed')
			];

			if (isObject(args[0])) {
				props = props.concat(decl.createManyFromObj(args[0]));
			} else if (! isEmpty(args)) {
				props = props.concat(decl.createMany([
					'top',
					'right',
					'left',
					'bottom'
				], args));
			}

			return props;
		},

		/**
		 * Flex
		 *
		 * @param {Array|Object} [args]
		 * 	 @param {number} [args[].grow]
		 * 	 @param {number} [args[].shrink]
		 * 	 @param {string} [args[].basis]
		 * @returns {Array}
		 */
		flex(...args) {
			// TODO: Need to set defaults even when passing parameters as an
			// object
			if (isObject(args)) {
				return decl.createManyFromObj(args, 'flex');
			}

			return [
				decl('flex-grow', args[0] || 0),
				decl('flex-shrink', args[1] || 0),
				decl('flex-basis', args[2] || 'auto')
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
		 * @param {Array} [args]
		 * @param {string|number|Object} [args[]] - font-family or object of properties
		 *	 @param {string|number} [args[].family]
		 *	 @param {string|number} [args[].size]
		 *	 @param {string|number} [args[].weight]
		 *	 @param {string|number} [args[].lineHeight]
		 *	 @param {string|number} [args[].style]
		 * @param {string|number} [args[]] - font-size
		 * @param {string|number} [args[]] - font-weight
		 * @param {string|number} [args[]] - line-height
		 * @param {string|number} [args[]] - font-style
		 * @return {Array}
		 */
		font(...args) {
			props = [];

			if (isObject(args[0])) {
				props = props.concat(decl.createManyFromObj(args[0], 'font', ['lineHeight']));
			} else if (! isEmpty(args)) {
				props.push(decl('font-family', args[0]));

				if (args[1]) {
					props.push(decl('font-size', args[1]));
				}

				if (args[2]) {
					props.push(decl('font-weight', args[2]));
				}

				if (args[3]) {
					props.push(decl('line-height', args[3]));
				}

				if (args[4]) {
					props.push(decl('font-style', args[4]));
				}
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
		 * @param  {Array} [args[]] - width
		 * @param  {Array} [args[]] - height
		 * @return {Array}
		 */
		inlineBlock(...args) {
			let props = [
				this.display('inline-block')
			];

			if (isObject(args[0])) {
				props = props.concat(decl.createManyFromObj(args[0]));
			} else if (! isEmpty(args)) {
				props.push(decl('width', args[0]));

				if (args[1]) {
					props.push(decl('height', args[1]));
				}
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
		 * @param {Array} args
		 * @returns {Array}
		 */
		loadFont(...args) {
			let defaults = {
				style: 'normal',
				weight: 'normal'
			};

			if (isObject(args[0])) {
				let props = this.font({
						family: args[0].name,
						weight: args[0].weight || 'normal',
						style: args[0].style || 'normal'
					}),
					file = args[0].file || args[0].name,
					filePath = `${vars.font.path}${file}`;

				props.push(decl('src', `url('${filePath}.woff2'), url('${filePath}.woff'), url('${filePath}.ttf')`));

				return rule('@font-face', props);
			}
		},

		/**
		 * Margin
		 *
		 * @param {Array} args
		 * @returns {Array|boolean}
		 */
		margin(...args) {
			let keywords = ['horizontal', 'vertical'],
				result = false;

			if (isObject(args[0])) {
				return decl.createManyFromObj(args[0], 'margin');
			}

			if (keywords.includes(args[0])) {
				let keyword = args.shift();

				if (args.length < 2) {
					args.push(args[0]);
				}

				if (keyword === 'horizontal') {
					result = decl.createMany(['left', 'right'], args, 'margin');
				} else if (keyword === 'vertical') {
					result = decl.createMany(['top', 'bottom'], args, 'margin');
				}
			}

			return result;
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
		padding(...args) {
			let keywords = ['horizontal', 'vertical'],
				result = false;

			if (isObject(args[0])) {
				return decl.createManyFromObj(args[0], 'padding');
			}

			if (keywords.includes(args[0])) {
				let keyword = args.shift();

				if (args.length < 2) {
					args.push(args[0]);
				}

				if (keyword === 'horizontal') {
					result = decl.createMany(['left', 'right'], args, 'padding');
				} else if (keyword === 'vertical') {
					result = decl.createMany(['top', 'bottom'], args, 'padding');
				}
			}

			return result;
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
				this.margin({ left: (margin * -1) + '%' })[0],
				decl('max-width', (100 + margin) + '%'),
				this.clearfix()
			]
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

			return this.margin({ left: (margin * -1) + '%' })
				.concat(decl('max-width', (100 + margin) + '%'));
		},

		/**
		 * Grid row reset
		 *
		 * @return {Array}
		 */
		rowReset() {
			return this.margin({ left: 0 })
				.concat(decl('max-width', 'none'));
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
		spaced(value) {
			if (isEmpty(value) || isObject(value)) {
				value = vars.block.margin.bottom;
			}

			return this.margin({ bottom: value });
		},

		/**
		 * Add a specified margin bottom, width, height, and display block
		 *
		 * @param {Array} [args]
		 * @param {string|number|Object} [args[]] - spaced value or object of width/height
		 *	 @param {string|number} [args[].width]
		 *	 @param {string|number} [args[].height]
		 * @param {string|number} [args[]] - width
		 * @param {string|number} [args[]] - height
		 * @return {Array}
		 */
		spacedBlock(...args) {
			let props = this.spaced(...args);

			if (isObject(args[0])) {
				props = props.concat(decl.createManyFromObj(args[0]));
				props = props.concat(this.block());
			} else if (args.length > 1) {
				args.shift();
				props = props.concat(this.block(...args));
			} else {
				props = props.concat(this.block());
			}

			return props;
		},

		/**
		 * Transition shorthand declaration
		 *
		 * @param {Array} [args]
		 * @param {string|Object} [args[]] - transition property or object
		 *	 @param {string} [args[].property]
		 *	 @param {string} [args[].duration]
		 *	 @param {string} [args[].timing]
		 *	 @param {string} [args[].delay]
		 * @param {string} [args[]] - transition duration
		 * @param {string} [args[]] - transition timing
		 * @param {string} [args[]] - transition delay
		 * @returns {Declaration}
		 */
		transition(...args) {
			let defaults = {
					property: 'all',
					duration: vars.default.duration,
					timing: vars.default.timing,
					delay: vars.default.delay
				},
				property, duration, timing, delay;

			if (args[0] === false) {
				return false;
			}

			if (args[0] === 'none') {
				return decl('transition', 'none');
			}

			if (isObject(args[0])) {
				let config = Object.assign(defaults, args[0]);

				return decl('transition', `${config.property} ${config.duration} ${config.timing} ${config.delay}`);
			}

			property = args[0] || defaults.property;
			duration = args[1] || defaults.duration;
			timing = args[2] || defaults.timing;
			delay = args[3] || defaults.delay;

			return decl('transition', `${property} ${duration} ${timing} ${delay}`);
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
				props.push(this.border('none'));
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