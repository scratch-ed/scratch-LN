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


describe('variables int', function() {
    it('should return valid xml', function() {
        let parsed = parseTextToXML('\n' +
            'change [a] by {1};\n' +
            'change [a] by {(a)}');
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables>\n' +
            '    <variable type="" id="var0">a</variable>\n' +
            '  </variables>\n' +
            '  <block id="0" type="data_changevariableby" x="10" y="10">\n' +
            '    <field name="VARIABLE">a</field>\n' +
            '    <value name="VALUE">\n' +
            '      <shadow type="math_number" id="1">\n' +
            '        <field name="NUM">1</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next>\n' +
            '      <block id="2" type="data_changevariableby">\n' +
            '        <field name="VARIABLE">a</field>\n' +
            '        <value name="VALUE">\n' +
            '          <block type="data_variable" id="3">\n' +
            '            <field name="VARIABLE" id="var0">a</field>\n' +
            '          </block>\n' +
            '        </value>\n' +
            '        <next/>\n' +
            '      </block>\n' +
            '    </next>\n' +
            '  </block>\n' +
            '</xml>';
        assert.equalIgnoreSpaces(parsed, expected);
    });
});


    describe('build in vars', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(costume [number]);(backdrop [number]);(size)');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="210">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="looks_costumenumbername" x="10" y="10">\n' +
                '    <field name="NUMBER_NAME">number</field>\n' +
                '  </block>\n' +
                '  <block id="1" type="looks_backdropnumbername" x="10" y="110">\n' +
                '    <field name="NUMBER_NAME">number</field>\n' +
                '  </block>\n' +
                '  <block id="2" type="looks_size" x="10" y="210"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
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
    describe('create and use variable', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('set [a]to {"fds"};\n' +
                'set [a]to {(a)}');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="" id="var0">a</variable>\n' +
                '  </variables>\n' +
                '  <block id="0" type="data_setvariableto" x="10" y="10">\n' +
                '    <field name="VARIABLE">a</field>\n' +
                '    <value name="VALUE">\n' +
                '      <shadow type="text" id="1">\n' +
                '        <field name="TEXT">"fds"</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next>\n' +
                '      <block id="2" type="data_setvariableto">\n' +
                '        <field name="VARIABLE">a</field>\n' +
                '        <value name="VALUE">\n' +
                '          <block type="data_variable" id="3">\n' +
                '            <field name="VARIABLE" id="var0">a</field>\n' +
                '          </block>\n' +
                '        </value>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('nesting', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('say {({1}+{22222})}\n' +
                'say {(mouse x)}\n' +
                'say {({({({1}*{({10} /{2})})}-{3})}+{22222})};');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="looks_say" x="10" y="10">\n' +
                '    <value name="MESSAGE">\n' +
                '      <block id="1" type="operator_add" x="10" y="10">\n' +
                '        <value name="NUM1">\n' +
                '          <shadow type="math_number" id="2">\n' +
                '            <field name="NUM">1</field>\n' +
                '          </shadow>\n' +
                '        </value>\n' +
                '        <value name="NUM2">\n' +
                '          <shadow type="math_number" id="3">\n' +
                '            <field name="NUM">22222</field>\n' +
                '          </shadow>\n' +
                '        </value>\n' +
                '      </block>\n' +
                '    </value>\n' +
                '    <next>\n' +
                '      <block id="4" type="looks_say">\n' +
                '        <value name="MESSAGE">\n' +
                '          <block id="5" type="sensing_mousex"/>\n' +
                '        </value>\n' +
                '        <next>\n' +
                '          <block id="6" type="looks_say">\n' +
                '            <value name="MESSAGE">\n' +
                '              <block id="7" type="operator_add">\n' +
                '                <value name="NUM1">\n' +
                '                  <block id="8" type="operator_subtract">\n' +
                '                    <value name="NUM1">\n' +
                '                      <block id="9" type="operator_multiply">\n' +
                '                        <value name="NUM1">\n' +
                '                          <shadow type="math_number" id="10">\n' +
                '                            <field name="NUM">1</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <value name="NUM2">\n' +
                '                          <block id="11" type="operator_divide">\n' +
                '                            <value name="NUM1">\n' +
                '                              <shadow type="math_number" id="12">\n' +
                '                                <field name="NUM">10</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                            <value name="NUM2">\n' +
                '                              <shadow type="math_number" id="13">\n' +
                '                                <field name="NUM">2</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                          </block>\n' +
                '                        </value>\n' +
                '                      </block>\n' +
                '                    </value>\n' +
                '                    <value name="NUM2">\n' +
                '                      <shadow type="math_number" id="14">\n' +
                '                        <field name="NUM">3</field>\n' +
                '                      </shadow>\n' +
                '                    </value>\n' +
                '                  </block>\n' +
                '                </value>\n' +
                '                <value name="NUM2">\n' +
                '                  <shadow type="math_number" id="15">\n' +
                '                    <field name="NUM">22222</field>\n' +
                '                  </shadow>\n' +
                '                </value>\n' +
                '              </block>\n' +
                '            </value>\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('nesting + hat', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('when gf clicked\n' +
                'if <{<{(length of [lijstje])}={"bad"}>} and {<not {<{(good)}={"bad"}>}>}>');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="list" id="var0">lijstje</variable>\n' +
                '    <variable type="" id="var1">good</variable>\n' +
                '  </variables>\n' +
                '  <block id="0" type="event_whenflagclicked" x="10" y="10">\n' +
                '    <next>\n' +
                '      <block type="control_if" id="1">\n' +
                '        <value name="CONDITION">\n' +
                '          <block id="2" type="operator_and">\n' +
                '            <value name="OPERAND1">\n' +
                '              <block id="3" type="operator_equals">\n' +
                '                <value name="OPERAND1">\n' +
                '                  <block id="4" type="data_lengthoflist">\n' +
                '                    <field name="LIST" variabletype="list">lijstje</field>\n' +
                '                  </block>\n' +
                '                </value>\n' +
                '                <value name="OPERAND2">\n' +
                '                  <shadow type="text" id="5">\n' +
                '                    <field name="TEXT">"bad"</field>\n' +
                '                  </shadow>\n' +
                '                </value>\n' +
                '              </block>\n' +
                '            </value>\n' +
                '            <value name="OPERAND2">\n' +
                '              <block id="6" type="operator_not">\n' +
                '                <value name="OPERAND">\n' +
                '                  <block id="7" type="operator_equals">\n' +
                '                    <value name="OPERAND1">\n' +
                '                      <block type="data_variable" id="8">\n' +
                '                        <field name="VARIABLE" id="var1">good</field>\n' +
                '                      </block>\n' +
                '                    </value>\n' +
                '                    <value name="OPERAND2">\n' +
                '                      <shadow type="text" id="9">\n' +
                '                        <field name="TEXT">"bad"</field>\n' +
                '                      </shadow>\n' +
                '                    </value>\n' +
                '                  </block>\n' +
                '                </value>\n' +
                '              </block>\n' +
                '            </value>\n' +
                '          </block>\n' +
                '        </value>\n' +
                '        <statement  name="SUBSTACK"/>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

});
