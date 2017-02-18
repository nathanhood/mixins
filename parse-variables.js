let vars;

function getProp(keys) {
	let segs = keys.toString().split('.'),
		key = segs.shift(),
		value = null;

	if (vars[key]) {
		value = vars[key];

		while (segs.length && value.hasOwnProperty(segs[0])) {
			value = value[segs[0]];
			segs.shift();
		}
	}

	return value;
}

function traverse(obj) {
	let props = Object.keys(obj),
		i;

	for (i = 0; i < props.length; i++) {
		let value = obj[props[i]],
			type = typeof value;

		if (type === 'object') {
			traverse(value);
		} else if (type === 'string' && /^\$/.test(value)) {
			obj[props[i]] = getProp(value.replace(/^\$/, ''));
		}
	}
}

module.exports = (variables = {}) => {
	vars = Object.assign({}, variables);

	traverse(variables);

	return vars;
};