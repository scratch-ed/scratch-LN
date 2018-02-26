/**
 * tests for generating xml from text.
 *
 *
 * setup: https://mochajs.org/#getting-started and https://x-team.com/blog/setting-up-javascript-testing-tools-for-es6/.
 * use `mocha --compilers js:babel-register --require babel-polyfill` for the transpiler!
 * Based on http://chaijs.com/plugins/chai-string/
 * equalIgnoreSpaces: ignores spaces and newlines
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */
import parseTextToXML from './../parser/parserUtils.js'
let chai = require('chai');
chai.use(require('chai-string'));
let assert = require('chai').assert;

/*
    describe('', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('');
            let expected = '';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

 */

describe('scripts_pen', function() {
    describe('pen up', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('pen up');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">' +
                '  <variables/>\n' +
                '  <block id="0" type="pen_penup" x="10" y="10">' +
                '    <next/>' +
                '  </block>' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});

describe('build_in_variable', function() {
    describe('(mouse x)', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(mouse x)');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="10">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sensing_mousex" x="10" y="10"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('<mouse down?>', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('<mouse down?>');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="10">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sensing_mousedown" x="10" y="10"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});

describe('variables', function() {
    describe('variable', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(m)');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="10">\n' +
                '  <variables>\n' +
                '    <variable type="" id="var0">m</variable>\n' +
                '  </variables>\n' +
                '  <block type="data_variable" id="0" x="10" y="10">\n' +
                '    <field name="VARIABLE" id="var0">m</field>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});
