'use strict';

const BaseStringifier = require('postcss/lib/stringifier');

class Stringifier extends BaseStringifier {
	mixin(node) {
		let string = node.name + '(' + Stringifier.transformArguments(node) + ');';

		this.builder(string, node);
	}

	/**
	 * Convert mixin arguments back to string (both key: value pairs and simple)
	 *
	 * @param {object} node
	 * @returns {string}
	 */
	static transformArguments(node) {
		let result = '',
			args = node['arguments'],
			firstArg = args[0],
			objKeys;

		if (typeof firstArg === 'string') {
			return args.map((arg, i) => {
					if (node.fontArgs[i.toString()]) {
						return arg.replace(/,/g, '');
					}

					return arg;
				}).join(', ');
		}

		objKeys = Object.keys(firstArg);

		objKeys.forEach((key, i) => {
			// Strip commas if argument is a font family argument
			let arg = node.fontArgs[key] ?
				firstArg[key].replace(/,/g, '') :
				firstArg[key];

			result += `${key}: ${arg}`;

			if (i < objKeys.length - 1) {
				result += ', ';
			}
		});

		return result;
	}
}

module.exports = Stringifier;