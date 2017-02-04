const parse = require('../lib/parse');
const cases = require('postcss-parser-tests');
const expect = require('chai').expect;
const fs = require('fs');

describe('parse', () => {
	cases.each((name, css, json) => {
		it('should parse ' + name, () => {
			let parsed = cases.jsonify(parse(css, { from: name }));

			expect(parsed).to.equal(json);
		});
	});
});

describe('parse mixins', () => {
	it('should parse mixins', () => {
		let root = parse('a { custom(); }'),
			node = root.first.first;

		expect(node.type).to.equal('mixin');
		expect(node.name).to.equal('custom');
	});

	it('should require semi-colon at end of mixin', () => {
		try {
			parse('a { custom() }');
		} catch(e) {
			expect(e.reason).to.equal('Unknown word');
		}
	});

	it('should parse comma separated values as arguments', () => {
		let root = parse(".block { mixin(1, bold, url('test.png'), #000, rgb(0, 0, 0)); }"),
			node = root.first.first;

		expect(JSON.stringify(node.arguments)).to.equal('["1","bold","url(\'test.png\')","#000","rgb(0, 0, 0)"]');
	});

	it('should parse key: value pair as argument', () => {
		let root = parse(".block { mixin(key: value); }"),
			node = root.first.first;

		expect(JSON.stringify(node.arguments[0])).to.equal('{"key":"value"}');
	});

	it('should parse many key: value pairs as arguments', () => {
		let root = parse(".block { mixin(padding: 1, weight: bold, background: url('test.png')); }"),
			node = root.first.first;

		expect(JSON.stringify(node.arguments[0])).to.equal('{"padding":"1","weight":"bold","background":"url(\'test.png\')"}');
	});

	it('should parse font-family arguments', () => {
		let root = parse(".block { mixin('Open Sans' Arial sans-serif); }"),
			node = root.first.first;

		expect(JSON.stringify(node.arguments)).to.equal('["\'Open Sans\', Arial, sans-serif"]');
	});

	it('should parse font-family arguments as key: value', () => {
		let root = parse(".block { mixin(family: 'Open Sans' Arial sans-serif, color: #000); }"),
			node = root.first.first;

		expect(JSON.stringify(node.arguments[0])).to.equal('{"family":"\'Open Sans\', Arial, sans-serif","color":"#000"}');
	});
});

describe('parse comments', () => {
	it('should parse block comments', () => {
		let root = parse(fs.readFileSync(__dirname + '/cases/block-comment.css', 'utf-8')),
			node = root.first;

		expect(node.type).to.equal('comment');
		expect(node.text).to.equal('------------------------------------*\\\n\t# Comment\n\\*------------------------------------');
	});
});