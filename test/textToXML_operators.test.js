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


describe('operators', function() {
    it('should return valid xml', function() {
        let parsed = parseTextToXML('{1} + {2}\n' +
            '\n' +
            '{1} - {2}\n' +
            '\n' +
            '{1} * {2}\n' +
            '\n' +
            '{1} / {2}\n' +
            '\n' +
            'pick random {1} to {10}\n' +
            '\n' +
            '{1} \\< {2}\n' +
            '\n' +
            '{1} \\> {2}\n' +
            '\n' +
            '{1} = {2}\n' +
            '\n' +
            ' {} and {}\n' +
            '\n' +
            ' {} or {}\n' +
            '\n' +
            'not {}\n' +
            '\n' +
            'join {"hello"} {"world"}\n' +
            '\n' +
            'letter {1} of {"world"}\n' +
            '\n' +
            'length of {"world"}\n' +
            '\n' +
            '{"hello"} contains {"world"} ?\n' +
            '\n' +
            ' {3} mod {2}\n' +
            '\n' +
            'round {2.22}\n' +
            '\n' +
            ' [abs] of {-1}',false);
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables/>\n' +
            '  <block id="0" type="operator_add">\n' +
            '    <value name="NUM1">\n' +
            '      <shadow type="math_number" id="1">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="NUM2">\n' +
            '      <shadow type="math_number" id="2">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="3" type="operator_subtract">\n' +
            '    <value name="NUM1">\n' +
            '      <shadow type="math_number" id="4">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="NUM2">\n' +
            '      <shadow type="math_number" id="5">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="6" type="operator_multiply" >\n' +
            '    <value name="NUM1">\n' +
            '      <shadow type="math_number" id="7">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="NUM2">\n' +
            '      <shadow type="math_number" id="8">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="9" type="operator_divide" >\n' +
            '    <value name="NUM1">\n' +
            '      <shadow type="math_number" id="10">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="NUM2">\n' +
            '      <shadow type="math_number" id="11">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="12" type="operator_random" >\n' +
            '    <value name="FROM">\n' +
            '      <shadow type="math_number" id="13">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="TO">\n' +
            '      <shadow type="math_number" id="14">\n' +
            '        <field name="NUM">10</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="15" type="operator_lt">\n' +
            '    <value name="OPERAND1">\n' +
            '      <shadow type="math_number" id="16">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="OPERAND2">\n' +
            '      <shadow type="math_number" id="17">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="18" type="operator_gt"> \n' +
            '    <value name="OPERAND1">\n' +
            '      <shadow type="math_number" id="19">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="OPERAND2">\n' +
            '      <shadow type="math_number" id="20">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="21" type="operator_equals">\n' +
            '    <value name="OPERAND1">\n' +
            '      <shadow type="math_number" id="22">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="OPERAND2">\n' +
            '      <shadow type="math_number" id="23">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="24" type="operator_and">\n' +
            '    <value name="OPERAND1"/>\n' +
            '    <value name="OPERAND2"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="25" type="operator_or" >\n' +
            '    <value name="OPERAND1"/>\n' +
            '    <value name="OPERAND2"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="26" type="operator_not" >\n' +
            '    <value name="OPERAND"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="27" type="operator_join" >\n' +
            '    <value name="STRING1">\n' +
            '      <shadow type="text" id="28">\n' +
            '        <field name="TEXT">"hello"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="STRING2">\n' +
            '      <shadow type="text" id="29">\n' +
            '        <field name="TEXT">"world"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="30" type="operator_letter_of">\n' +
            '    <value name="LETTER">\n' +
            '      <shadow type="math_number" id="31">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="STRING">\n' +
            '      <shadow type="text" id="32">\n' +
            '        <field name="TEXT">"world"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="33" type="operator_length">\n' +
            '    <value name="STRING">\n' +
            '      <shadow type="text" id="34">\n' +
            '        <field name="TEXT">"world"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="35" type="operator_contains">\n' +
            '    <value name="STRING1">\n' +
            '      <shadow type="text" id="36">\n' +
            '        <field name="TEXT">"hello"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="STRING2">\n' +
            '      <shadow type="text" id="37">\n' +
            '        <field name="TEXT">"world"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="38" type="operator_mod" >\n' +
            '    <value name="NUM1">\n' +
            '      <shadow type="math_number" id="39">\n' +
            '        <field name="NUM">3</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <value name="NUM2">\n' +
            '      <shadow type="math_number" id="40">\n' +
            '        <field name="NUM">2</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="41" type="operator_round" >\n' +
            '    <value name="NUM">\n' +
            '      <shadow type="math_number" id="42">\n' +
            '        <field name="NUM">2.22</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="43" type="operator_mathop" >\n' +
            '    <field name="OPERATOR">abs</field>\n' +
            '    <value name="NUM">\n' +
            '      <shadow type="math_number" id="44">\n' +
            '        <field name="NUM">-1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '</xml>';
        assert.equalIgnoreSpaces(parsed, expected);
    });
});