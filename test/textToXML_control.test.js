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

describe('ifelse', function() {
    describe('nested if in each if', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'if <>\n' +
                'end\n' +
                'else\n' +
                'if <>');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <variables/>\n' +
                '      <block type="control_if" id="1">\n' +
                '        <value name="CONDITION"/>\n' +
                '        <statement  name="SUBSTACK"/>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <statement  name="SUBSTACK2">\n' +
                '      <block type="control_if" id="2">\n' +
                '        <value name="CONDITION"/>\n' +
                '        <statement  name="SUBSTACK"/>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('if else', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'pen up\n' +
                'else\n' +
                'pen up');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <variables/>\n' +
                '      <block id="1" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <statement  name="SUBSTACK2">\n' +
                '      <block id="2" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('if <>', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block type="control_if" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('if with no stack 1', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'else\n' +
                'pen up');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK"/>\n' +
                '    <statement  name="SUBSTACK2">\n' +
                '      <variables/>\n' +
                '      <block id="1" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('nest if in else', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'pen up\n' +
                'else\n' +
                'if <>\n' +
                'pen up\n' +
                'else\n' +
                'pen up\n' +
                'end\n' +
                'pen up\n' +
                'end\n' +
                'pen up\n');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <variables/>\n' +
                '      <block id="1" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <statement  name="SUBSTACK2">\n' +
                '      <block type="control_if_else" id="2">\n' +
                '        <value name="CONDITION"/>\n' +
                '        <statement  name="SUBSTACK">\n' +
                '          <block id="3" type="pen_penup">\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </statement >\n' +
                '        <statement  name="SUBSTACK2">\n' +
                '          <block id="4" type="pen_penup">\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </statement >\n' +
                '        <next>\n' +
                '          <block id="5" type="pen_penup">\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next>\n' +
                '      <block id="6" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('empty if else', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'else');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK"/>\n' +
                '    <statement  name="SUBSTACK2"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('empty if else end', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'else;end');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK"/>\n' +
                '    <statement  name="SUBSTACK2"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('if empty else', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'pen up\n' +
                'else');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <variables/>\n' +
                '      <block id="1" type="pen_penup">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <statement  name="SUBSTACK2"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('if with parameter', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <[lili] contains {"thing"}?>\n' +
                'pen up\n' +
                'pen down\n' +
                'end\n' +
                'clear');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <block type="control_if" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION">\n' +
                '      <variables>\n' +
                '        <variable type="list" id="var0">lili</variable>\n' +
                '      </variables>\n' +
                '      <block id="1" type="data_listcontainsitem" x="10" y="10">\n' +
                '        <field name="LIST" variabletype="list">lili</field>\n' +
                '        <value name="ITEM">\n' +
                '          <shadow type="text" id="2">\n' +
                '            <field name="TEXT">"thing"</field>\n' +
                '          </shadow>\n' +
                '        </value>\n' +
                '      </block>\n' +
                '    </value>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <block id="3" type="pen_penup">\n' +
                '        <next>\n' +
                '          <block id="4" type="pen_pendown">\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next>\n' +
                '      <block id="5" type="pen_clear">\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});
