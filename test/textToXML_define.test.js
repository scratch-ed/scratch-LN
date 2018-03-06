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
describe('ifelse', function() {

});
 */
describe('define', function() {
    describe('define', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('define BLUB {(d)} {<f>}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="arg" id="var0">d</variable>\n' +
                '    <variable type="arg" id="var1">f</variable>\n' +
                '  </variables>\n' +
                '  <block type="procedures_definition" id="0" x="10" y="10">\n' +
                '    <statement name="custom_block">\n' +
                '      <shadow type="procedures_prototype">\n' +
                '        <mutation proccode=" BLUB %s %b" argumentnames="[&quot;d&quot;,&quot;f&quot;]" warp="false" argumentids="[&quot;var0&quot;,&quot;var1&quot;]"/>\n' +
                '      </shadow>\n' +
                '    </statement>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('define', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('define {<A>} BLA {(D)} {<B>} BLA {(C)} \n' +
                'pen up');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="arg" id="var0">A</variable>\n' +
                '    <variable type="arg" id="var1">D</variable>\n' +
                '    <variable type="arg" id="var2">B</variable>\n' +
                '    <variable type="arg" id="var3">C</variable>\n' +
                '  </variables>\n' +
                '  <block type="procedures_definition" id="0" x="10" y="10">\n' +
                '    <statement name="custom_block">\n' +
                '      <shadow type="procedures_prototype">\n' +
                '        <mutation proccode=" %b BLA %s %b BLA %s" argumentnames="[&quot;A&quot;,&quot;D&quot;,&quot;B&quot;,&quot;C&quot;]" warp="false" argumentids="[&quot;var0&quot;,&quot;var1&quot;,&quot;var2&quot;,&quot;var3&quot;]"/>\n' +
                '      </shadow>\n' +
                '    </statement>\n' +
                '    <next>\n' +
                '      <block id="1" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

});
