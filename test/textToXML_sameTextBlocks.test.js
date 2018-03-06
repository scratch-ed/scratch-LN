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

describe('ifelse', function() {
    it('should return valid xml', function() {
        let parsed = parseTextToXML('change [color] effect by {10};\n' +
            'set [color] effect to {10};');
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables/>\n' +
            '  <block id="0" type="looks_changeeffectby" x="10" y="10">\n' +
            '    <field name="EFFECT">color</field>\n' +
            '    <value name="CHANGE">\n' +
            '      <shadow type="math_number" id="1">\n' +
            '        <field name="NUM">10</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next>\n' +
            '      <block id="2" type="looks_seteffectto">\n' +
            '        <field name="EFFECT">color</field>\n' +
            '        <value name="VALUE">\n' +
            '          <shadow type="math_number" id="3">\n' +
            '            <field name="NUM">10</field>\n' +
            '          </shadow>\n' +
            '        </value>\n' +
            '        <next/>\n' +
            '      </block>\n' +
            '    </next>\n' +
            '  </block>\n' +
            '</xml>';
        assert.equalIgnoreSpaces(parsed, expected);
    });
    it('should return valid xml', function() {
        let parsed = parseTextToXML('change [pitchX] effect by {10}::sound;\n' +
            'set [pitchX] effect to {100}::sound;');
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables/>\n' +
            '  <block id="0" type="sound_changeeffectby" x="10" y="10">\n' +
            '    <field name="EFFECT">pitchX</field>\n' +
            '    <value name="VALUE">\n' +
            '      <shadow type="math_number" id="1">\n' +
            '        <field name="NUM">10</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next>\n' +
            '      <block id="2" type="sound_seteffectto">\n' +
            '        <field name="EFFECT">pitchX</field>\n' +
            '        <value name="VALUE">\n' +
            '          <shadow type="math_number" id="3">\n' +
            '            <field name="NUM">100</field>\n' +
            '          </shadow>\n' +
            '        </value>\n' +
            '        <next/>\n' +
            '      </block>\n' +
            '    </next>\n' +
            '  </block>\n' +
            '</xml>';
        assert.equalIgnoreSpaces(parsed, expected);
    });
    it('should return valid xml', function() {
        let parsed = parseTextToXML('change [pitch] effect by {10};\n' +
            'set [pitch] effect to {100};');
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables/>\n' +
            '  <block id="0" type="sound_changeeffectby" x="10" y="10">\n' +
            '    <field name="EFFECT">pitch</field>\n' +
            '    <value name="VALUE">\n' +
            '      <shadow type="math_number" id="1">\n' +
            '        <field name="NUM">10</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next>\n' +
            '      <block id="2" type="sound_seteffectto">\n' +
            '        <field name="EFFECT">pitch</field>\n' +
            '        <value name="VALUE">\n' +
            '          <shadow type="math_number" id="3">\n' +
            '            <field name="NUM">100</field>\n' +
            '          </shadow>\n' +
            '        </value>\n' +
            '        <next/>\n' +
            '      </block>\n' +
            '    </next>\n' +
            '  </block>\n' +
            '</xml>';
        assert.equalIgnoreSpaces(parsed, expected);
    });
});


describe('lentgth of', function() {
    describe('length of {}', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('length of {}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="operator_length" x="10" y="10">\n' +
                '    <value name="STRING"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('length of string', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('length of {"fds"}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="operator_length" x="10" y="10">\n' +
                '    <value name="STRING">\n' +
                '      <shadow type="text" id="1">\n' +
                '        <field name="TEXT">"fds"</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('length of choice', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('length of [ddd]');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="list" id="var0">ddd</variable>\n' +
                '  </variables>\n' +
                '  <block id="0" type="data_lengthoflist" x="10" y="10">\n' +
                '    <field name="LIST" variabletype="list">ddd</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('contains string', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('{"hello"} contains {"world"} ?');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="operator_contains" x="10" y="10">\n' +
                '    <value name="STRING1">\n' +
                '      <shadow type="text" id="1">\n' +
                '        <field name="TEXT">"hello"</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <value name="STRING2">\n' +
                '      <shadow type="text" id="2">\n' +
                '        <field name="TEXT">"world"</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('contains choice', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('[lili] contains {"thing"}?');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="list" id="var0">lili</variable>\n' +
                '  </variables>\n' +
                '  <block id="0" type="data_listcontainsitem" x="10" y="10">\n' +
                '    <field name="LIST" variabletype="list">lili</field>\n' +
                '    <value name="ITEM">\n' +
                '      <shadow type="text" id="1">\n' +
                '        <field name="TEXT">"thing"</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('[x position] of [Sprite1]', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('[x position] of [Sprite1]');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sensing_of" x="10" y="10">\n' +
                '    <field name="PROPERTY">x position</field>\n' +
                '    <value name="OBJECT">\n' +
                '      <shadow type="sensing_of_object_menu">\n' +
                '        <field name="OBJECT">Sprite1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('[abs] of {-1}', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('[abs] of {-1}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="operator_mathop" x="10" y="10">\n' +
                '    <field name="OPERATOR">abs</field>\n' +
                '    <value name="NUM">\n' +
                '      <shadow type="math_number" id="1">\n' +
                '        <field name="NUM">-1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('of empty', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('[abs] of {}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="operator_mathop" x="10" y="10">\n' +
                '    <field name="OPERATOR">abs</field>\n' +
                '    <value name="NUM"/>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});