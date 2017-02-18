'use strict';

const expect = require('chai').expect;
const parser = require('./parse-variables');
const fs = require('fs');
const variablesJSON = fs.readFileSync('./cases/variables.json', 'utf-8');

describe('parser', () => {
	it('should parse variables', () => {
		let result = parser(require('./variables'));

		fs.writeFileSync('./cases/variablesParsed.json', JSON.stringify(result));

		expect(fs.readFileSync('./cases/variablesParsed.json', 'utf-8')).to.equal(variablesJSON);
	});
});