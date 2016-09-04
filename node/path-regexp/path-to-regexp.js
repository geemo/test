'use strict';

module.exports = pathToRegexp;

const PATH_REGEXP = new RegExp([
	'(\\\\.)',
	'([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([?*+])?',
	'([.+*?=:\\/|{}[\\]/^$\\-])'
].join('|'), 'g');

function pathToRegexp(path, opts){
	opts = opts || {};

	const strict = opts.strict;
	const end = opts.end || true;
	const flag = opts.sensitive ? '' : 'i';
	const keys = [];
	let index = 0;

	if(path instanceof RegExp) {
		const groups = path.source.match(/\(?!\?\)/g) || [];

		groups.forEach((key, index) => {
			keys.push({
				name: index,
				delimiter: null,
				optional: false,
				repeat: false
			});
		});

		return _attachKeys(path, keys);
	} else if (Array.isArray(path)) {
		path = path.map(val => {
			return pathToRegexp(val, opts);
		});

		return _attachKeys(new RegExp(`(?:${path.join('|')})`, 'g'));
	} else {
		path = path.replace(PATH_REGEXP, (match, escaped, prefix, key, capture, group, stuffix, escape) => {
			if (escaped) return escaped;

			if (escape) return `\\${escape}`;

			const repeat = stuffix === '+' || stuffix === '*';
			const optional = stuffix === '?' || stuffix === '*';

			keys.push({
				name: key || index++,
				delimiter: prefix,
				optional: optional,
				repeat: repeat
			});

			capture = capture || group || `[^${prefix || '\\/'}]+?`;

			if(repeat) 
				capture = capture + `(?:${prefix + capture})*`;
			
			if(optional)
				return `(?:${prefix}(${capture}))`;

			return `${prefix}(${capture})`;
		});

		const endsWithSlash = path[path.length - 1] === '/';

		if(!strict)
			path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';

		if(!end)
			path += strict && endsWithSlash ? '' : '(?=\\/(?!\\/)|$)';
		else 
			path += '$';

		return _attachKeys(new RegExp(`^${path}`, flag), keys);
	}
}

function _attachKeys(reg, keys) {
	reg.keys = keys;

	return reg;
}

function _escapeGroup() {
	return group.replace(/([=!:$\/()])/g, '\\$1');
}