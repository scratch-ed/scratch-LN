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

describe('pen', function() {
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

    describe('stack blocks', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('clear;\n' +
                'stamp;\n' +
                'pen down;\n' +
                'pen up;\n' +
                'set pen color to {};\n' +
                'set pen color to {#123456}\n' +
                'change pen color by {10};\n' +
                'set pen color to {0};\n' +
                'change pen shade by {10};\n' +
                'change pen size by {1};\n' +
                'set pen size to {1};\n' +
                'change pen transparency by {10};');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="pen_clear" x="10" y="10">\n' +
                '    <next>\n' +
                '      <block id="1" type="pen_stamp">\n' +
                '        <next>\n' +
                '          <block id="2" type="pen_pendown">\n' +
                '            <next>\n' +
                '              <block id="3" type="pen_penup">\n' +
                '                <next>\n' +
                '                  <block id="4" type="pen_setpencolortonum">\n' +
                '                    <value name="COLOR"/>\n' +
                '                    <next>\n' +
                '                      <block id="5" type="pen_setpencolortonum">\n' +
                '                        <value name="COLOR">\n' +
                '                          <shadow type="colour_picker" id="6">\n' +
                '                            <field name="COLOUR">#123456</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <next>\n' +
                '                          <block id="7" type="pen_changepencolorby">\n' +
                '                            <value name="COLOR">\n' +
                '                              <shadow type="math_number" id="8">\n' +
                '                                <field name="NUM">10</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                            <next>\n' +
                '                              <block id="9" type="pen_setpencolortonum">\n' +
                '                                <value name="COLOR">\n' +
                '                                  <shadow type="math_number" id="10">\n' +
                '                                    <field name="NUM">0</field>\n' +
                '                                  </shadow>\n' +
                '                                </value>\n' +
                '                                <next>\n' +
                '                                  <block id="11" type="pen_changepenshadeby">\n' +
                '                                    <value name="SHADE">\n' +
                '                                      <shadow type="math_number" id="12">\n' +
                '                                        <field name="NUM">10</field>\n' +
                '                                      </shadow>\n' +
                '                                    </value>\n' +
                '                                    <next>\n' +
                '                                      <block id="13" type="pen_changepensizeby">\n' +
                '                                        <value name="SIZE">\n' +
                '                                          <shadow type="math_number" id="14">\n' +
                '                                            <field name="NUM">1</field>\n' +
                '                                          </shadow>\n' +
                '                                        </value>\n' +
                '                                        <next>\n' +
                '                                          <block id="15" type="pen_setpensizeto">\n' +
                '                                            <value name="SIZE">\n' +
                '                                              <shadow type="math_number" id="16">\n' +
                '                                                <field name="NUM">1</field>\n' +
                '                                              </shadow>\n' +
                '                                            </value>\n' +
                '                                            <next>\n' +
                '                                              <block id="17" type="pen_changepentransparencyby">\n' +
                '                                                <value name="TRANSPARENCY">\n' +
                '                                                  <shadow type="math_number" id="18">\n' +
                '                                                    <field name="NUM">10</field>\n' +
                '                                                  </shadow>\n' +
                '                                                </value>\n' +
                '                                                <next/>\n' +
                '                                              </block>\n' +
                '                                            </next>\n' +
                '                                          </block>\n' +
                '                                        </next>\n' +
                '                                      </block>\n' +
                '                                    </next>\n' +
                '                                  </block>\n' +
                '                                </next>\n' +
                '                              </block>\n' +
                '                            </next>\n' +
                '                          </block>\n' +
                '                        </next>\n' +
                '                      </block>\n' +
                '                    </next>\n' +
                '                  </block>\n' +
                '                </next>\n' +
                '              </block>\n' +
                '            </next>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});

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
            ' [abs] of {-1}');
        let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
            '  <variables/>\n' +
            '  <block id="0" type="operator_add" x="10" y="10">\n' +
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
            '  <block id="3" type="operator_subtract" x="10" y="110">\n' +
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
            '  <block id="6" type="operator_multiply" x="10" y="210">\n' +
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
            '  <block id="9" type="operator_divide" x="10" y="310">\n' +
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
            '  <block id="12" type="operator_random" x="10" y="410">\n' +
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
            '  <block id="15" type="operator_lt" x="10" y="510">\n' +
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
            '  <block id="18" type="operator_gt" x="10" y="610">\n' +
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
            '  <block id="21" type="operator_equals" x="10" y="710">\n' +
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
            '  <block id="24" type="operator_and" x="10" y="810">\n' +
            '    <value name="OPERAND1"/>\n' +
            '    <value name="OPERAND2"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="25" type="operator_or" x="10" y="910">\n' +
            '    <value name="OPERAND1"/>\n' +
            '    <value name="OPERAND2"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="26" type="operator_not" x="10" y="1010">\n' +
            '    <value name="OPERAND"/>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="27" type="operator_join" x="10" y="1110">\n' +
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
            '  <block id="30" type="operator_letter_of" x="10" y="1210">\n' +
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
            '  <block id="33" type="operator_length" x="10" y="1310">\n' +
            '    <value name="STRING">\n' +
            '      <shadow type="text" id="34">\n' +
            '        <field name="TEXT">"world"</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="35" type="operator_contains" x="10" y="1410">\n' +
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
            '  <block id="38" type="operator_mod" x="10" y="1510">\n' +
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
            '  <block id="41" type="operator_round" x="10" y="1610">\n' +
            '    <value name="NUM">\n' +
            '      <shadow type="math_number" id="42">\n' +
            '        <field name="NUM">2.22</field>\n' +
            '      </shadow>\n' +
            '    </value>\n' +
            '    <next/>\n' +
            '  </block>\n' +
            '  <block id="43" type="operator_mathop" x="10" y="1710">\n' +
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

describe('Sounds', function() {
    describe('', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('\n' +
                'start sound [1];\n' +
                'play sound [1] until done;\n' +
                'stop all sounds;\n' +
                'rest for {0.25} beats;\n' +
                'play note {30} for {0.3} beats;\n' +
                'change [pitch] effect by {10};\n' +
                'set [pitch] effect to {100};\n' +
                'clear sound effects;\n' +
                'change volume by {-10};\n' +
                'set volume to {100}%;\n' +
                'change tempo by {60};\n' +
                'set tempo to {60} bpm;\n' +
                '\n' +
                'set instrument to [ikook];\n' +
                '\n' +
                'play drum [ikbenverzonnen] for {0.2} beats');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sound_play" x="10" y="10">\n' +
                '    <value name="SOUND_MENU">\n' +
                '      <shadow type="sound_sounds_menu">\n' +
                '        <field name="SOUND_MENU">1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next>\n' +
                '      <block id="1" type="sound_playuntildone">\n' +
                '        <value name="SOUND_MENU">\n' +
                '          <shadow type="sound_sounds_menu">\n' +
                '            <field name="SOUND_MENU">1</field>\n' +
                '          </shadow>\n' +
                '        </value>\n' +
                '        <next>\n' +
                '          <block id="2" type="sound_stopallsounds">\n' +
                '            <next>\n' +
                '              <block id="3" type="sound_restforbeats">\n' +
                '                <value name="BEATS">\n' +
                '                  <shadow type="math_number" id="4">\n' +
                '                    <field name="NUM">0.25</field>\n' +
                '                  </shadow>\n' +
                '                </value>\n' +
                '                <next>\n' +
                '                  <block id="5" type="sound_playnoteforbeats">\n' +
                '                    <value name="NOTE">\n' +
                '                      <shadow type="math_number" id="6">\n' +
                '                        <field name="NUM">30</field>\n' +
                '                      </shadow>\n' +
                '                    </value>\n' +
                '                    <value name="BEATS">\n' +
                '                      <shadow type="math_number" id="7">\n' +
                '                        <field name="NUM">0.3</field>\n' +
                '                      </shadow>\n' +
                '                    </value>\n' +
                '                    <next>\n' +
                '                      <block id="8" type="sound_changeeffectby">\n' +
                '                        <field name="EFFECT">pitch</field>\n' +
                '                        <value name="VALUE">\n' +
                '                          <shadow type="math_number" id="9">\n' +
                '                            <field name="NUM">10</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <next>\n' +
                '                          <block id="10" type="sound_seteffectto">\n' +
                '                            <field name="EFFECT">pitch</field>\n' +
                '                            <value name="VALUE">\n' +
                '                              <shadow type="math_number" id="11">\n' +
                '                                <field name="NUM">100</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                            <next>\n' +
                '                              <block id="12" type="sound_cleareffects">\n' +
                '                                <next>\n' +
                '                                  <block id="13" type="sound_changevolumeby">\n' +
                '                                    <value name="VOLUME">\n' +
                '                                      <shadow type="math_number" id="14">\n' +
                '                                        <field name="NUM">-10</field>\n' +
                '                                      </shadow>\n' +
                '                                    </value>\n' +
                '                                    <next>\n' +
                '                                      <block id="15" type="sound_setvolumeto">\n' +
                '                                        <value name="VOLUME">\n' +
                '                                          <shadow type="math_number" id="16">\n' +
                '                                            <field name="NUM">100</field>\n' +
                '                                          </shadow>\n' +
                '                                        </value>\n' +
                '                                        <next>\n' +
                '                                          <block id="17" type="sound_changetempoby">\n' +
                '                                            <value name="TEMPO">\n' +
                '                                              <shadow type="math_number" id="18">\n' +
                '                                                <field name="NUM">60</field>\n' +
                '                                              </shadow>\n' +
                '                                            </value>\n' +
                '                                            <next>\n' +
                '                                              <block id="19" type="sound_settempotobpm">\n' +
                '                                                <value name="TEMPO">\n' +
                '                                                  <shadow type="math_number" id="20">\n' +
                '                                                    <field name="NUM">60</field>\n' +
                '                                                  </shadow>\n' +
                '                                                </value>\n' +
                '                                                <next/>\n' +
                '                                              </block>\n' +
                '                                            </next>\n' +
                '                                          </block>\n' +
                '                                        </next>\n' +
                '                                      </block>\n' +
                '                                    </next>\n' +
                '                                  </block>\n' +
                '                                </next>\n' +
                '                              </block>\n' +
                '                            </next>\n' +
                '                          </block>\n' +
                '                        </next>\n' +
                '                      </block>\n' +
                '                    </next>\n' +
                '                  </block>\n' +
                '                </next>\n' +
                '              </block>\n' +
                '            </next>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '  <block id="21" type="sound_setinstrumentto" x="10" y="1210">\n' +
                '    <value name="INSTRUMENT">\n' +
                '      <shadow type="sound_instruments_menu">\n' +
                '        <field name="INSTRUMENT">ikook</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="22" type="sound_playdrumforbeats" x="10" y="1310">\n' +
                '    <value name="DRUM">\n' +
                '      <shadow type="sound_drums_menu">\n' +
                '        <field name="DRUM">ikbenverzonnen</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <value name="BEATS">\n' +
                '      <shadow type="math_number" id="23">\n' +
                '        <field name="NUM">0.2</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('variables', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(volume)(tempo)');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="110">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sound_volume" x="10" y="10"/>\n' +
                '  <block id="1" type="sound_tempo" x="10" y="110"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
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
});

describe('looks', function() {
    describe('stack blocks', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('\n' +
                'show;\n' +
                'hide;\n' +
                'switch costume to [costume 1];\n' +
                'next costume;\n' +
                'next backdrop;\n' +
                'switch backdrop to [backdrop];\n' +
                'switch backdrop to [backdrop] and wait;\n' +
                'change [color] effect by {10};\n' +
                'set [color] effect to {10};\n' +
                'change size by {10};\n' +
                'go to [back];\n' +
                'go [forward] {1} layers;');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="looks_show" x="10" y="10">\n' +
                '    <next>\n' +
                '      <block id="1" type="looks_hide">\n' +
                '        <next>\n' +
                '          <block id="2" type="looks_switchcostumeto">\n' +
                '            <value name="COSTUME">\n' +
                '              <shadow type="looks_costume">\n' +
                '                <field name="COSTUME">costume 1</field>\n' +
                '              </shadow>\n' +
                '            </value>\n' +
                '            <next>\n' +
                '              <block id="3" type="looks_nextcostume">\n' +
                '                <next>\n' +
                '                  <block id="4" type="looks_nextbackdrop">\n' +
                '                    <next>\n' +
                '                      <block id="5" type="looks_switchbackdropto">\n' +
                '                        <value name="BACKDROP">\n' +
                '                          <shadow type="looks_backdrops">\n' +
                '                            <field name="BACKDROP">backdrop</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <next>\n' +
                '                          <block id="6" type="looks_switchbackdroptoandwait">\n' +
                '                            <value name="BACKDROP">\n' +
                '                              <shadow type="looks_backdrops">\n' +
                '                                <field name="BACKDROP">backdrop</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                            <next>\n' +
                '                              <block id="7" type="looks_changeeffectby">\n' +
                '                                <field name="EFFECT">color</field>\n' +
                '                                <value name="CHANGE">\n' +
                '                                  <shadow type="math_number" id="8">\n' +
                '                                    <field name="NUM">10</field>\n' +
                '                                  </shadow>\n' +
                '                                </value>\n' +
                '                                <next>\n' +
                '                                  <block id="9" type="looks_seteffectto">\n' +
                '                                    <field name="EFFECT">color</field>\n' +
                '                                    <value name="VALUE">\n' +
                '                                      <shadow type="math_number" id="10">\n' +
                '                                        <field name="NUM">10</field>\n' +
                '                                      </shadow>\n' +
                '                                    </value>\n' +
                '                                    <next>\n' +
                '                                      <block id="11" type="looks_changesizeby">\n' +
                '                                        <value name="CHANGE">\n' +
                '                                          <shadow type="math_number" id="12">\n' +
                '                                            <field name="NUM">10</field>\n' +
                '                                          </shadow>\n' +
                '                                        </value>\n' +
                '                                        <next>\n' +
                '                                          <block id="13" type="looks_gotofrontback">\n' +
                '                                            <field name="FRONT_BACK">back</field>\n' +
                '                                            <next>\n' +
                '                                              <block id="14" type="looks_goforwardbackwardlayers">\n' +
                '                                                <field name="FORWARD_BACKWARD">forward</field>\n' +
                '                                                <value name="NUM">\n' +
                '                                                  <shadow type="math_number" id="15">\n' +
                '                                                    <field name="NUM">1</field>\n' +
                '                                                  </shadow>\n' +
                '                                                </value>\n' +
                '                                                <next/>\n' +
                '                                              </block>\n' +
                '                                            </next>\n' +
                '                                          </block>\n' +
                '                                        </next>\n' +
                '                                      </block>\n' +
                '                                    </next>\n' +
                '                                  </block>\n' +
                '                                </next>\n' +
                '                              </block>\n' +
                '                            </next>\n' +
                '                          </block>\n' +
                '                        </next>\n' +
                '                      </block>\n' +
                '                    </next>\n' +
                '                  </block>\n' +
                '                </next>\n' +
                '              </block>\n' +
                '            </next>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('build in vars', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(costume [number])(backdrop [number])(size)');
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

    describe('sensing', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('touching [mouse-pointer]?\n' +
                '\n' +
                'touching color {#123456} ?\n' +
                '\n' +
                'color {#123456} is touching {#123456} ?\n' +
                '\n' +
                'distance to [mouse-pounter]\n' +
                '\n' +
                'key [space ] pressed ?\n' +
                '\n' +
                'mouse down?\n' +
                '\n' +
                'mouse x\n' +
                '\n' +
                'mouse y\n' +
                '\n' +
                'set drag mode [draggable]\n' +
                '\n' +
                'loudness\n' +
                '\n' +
                'timer\n' +
                '\n' +
                'reset timer\n' +
                '\n' +
                ' [x position] of [Sprite1]\n' +
                '\n' +
                'current [year]\n' +
                '\n' +
                'days since 2000');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sensing_touchingobject" x="10" y="10">\n' +
                '    <value name="TOUCHINGOBJECTMENU">\n' +
                '      <shadow type="sensing_touchingobjectmenu">\n' +
                '        <field name="TOUCHINGOBJECTMENU">mouse-pointer</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="1" type="sensing_touchingcolor" x="10" y="110">\n' +
                '    <value name="COLOR">\n' +
                '      <shadow type="colour_picker" id="2">\n' +
                '        <field name="COLOUR">#123456</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="3" type="sensing_coloristouchingcolor" x="10" y="210">\n' +
                '    <value name="COLOR">\n' +
                '      <shadow type="colour_picker" id="4">\n' +
                '        <field name="COLOUR">#123456</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <value name="COLOR2">\n' +
                '      <shadow type="colour_picker" id="5">\n' +
                '        <field name="COLOUR">#123456</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="6" type="sensing_distanceto" x="10" y="310">\n' +
                '    <value name="DISTANCETOMENU">\n' +
                '      <shadow type="sensing_distancetomenu">\n' +
                '        <field name="DISTANCETOMENU">mouse-pounter</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="7" type="sensing_keypressed" x="10" y="410">\n' +
                '    <field name="KEY_OPTION">space </field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="8" type="sensing_mousedown" x="10" y="510">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="9" type="sensing_mousex" x="10" y="610">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="10" type="sensing_mousey" x="10" y="710">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="11" type="sensing_setdragmode" x="10" y="810">\n' +
                '    <field name="DRAG_MODE">draggable</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="12" type="sensing_loudness" x="10" y="910">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="13" type="sensing_timer" x="10" y="1010">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="14" type="sensing_resettimer" x="10" y="1110">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="15" type="sensing_of" x="10" y="1210">\n' +
                '    <field name="PROPERTY">x position</field>\n' +
                '    <value name="OBJECT">\n' +
                '      <shadow type="sensing_of_object_menu">\n' +
                '        <field name="OBJECT">Sprite1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="16" type="sensing_current" x="10" y="1310">\n' +
                '    <field name="CURRENTMENU">year</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="17" type="sensing_dayssince2000" x="10" y="1410">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});

describe('motion',function(){
    describe('stack blocks', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('move {10} steps;\n' +
                'turn cw {15} degrees;\n' +
                'turn ccw {15} degrees;\n' +
                'point in direction {90};\n' +
                'point towards [mouse-pointer];\n' +
                'go to x: {0} y: {0};\n' +
                'go to [mouse-pointer];\n' +
                'glide {1} secs to x: {0} y: {0};\n' +
                'glide {1} secs to [mouse-pointer];\n' +
                'change x by {10};\n' +
                'set x to {0};\n' +
                'change y by {10};\n' +
                'set y to {0};\n' +
                'set rotation style [left-right];');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="motion_movesteps" x="10" y="10">\n' +
                '    <value name="STEPS">\n' +
                '      <shadow type="math_number" id="1">\n' +
                '        <field name="NUM">10</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next>\n' +
                '      <block id="2" type="motion_turnright">\n' +
                '        <value name="DEGREES">\n' +
                '          <shadow type="math_number" id="3">\n' +
                '            <field name="NUM">15</field>\n' +
                '          </shadow>\n' +
                '        </value>\n' +
                '        <next>\n' +
                '          <block id="4" type="motion_turnleft">\n' +
                '            <value name="DEGREES">\n' +
                '              <shadow type="math_number" id="5">\n' +
                '                <field name="NUM">15</field>\n' +
                '              </shadow>\n' +
                '            </value>\n' +
                '            <next>\n' +
                '              <block id="6" type="motion_pointindirection">\n' +
                '                <value name="DIRECTION">\n' +
                '                  <shadow type="math_number" id="7">\n' +
                '                    <field name="NUM">90</field>\n' +
                '                  </shadow>\n' +
                '                </value>\n' +
                '                <next>\n' +
                '                  <block id="8" type="motion_pointtowards">\n' +
                '                    <value name="TOWARDS">\n' +
                '                      <shadow type="motion_pointtowards_menu">\n' +
                '                        <field name="TOWARDS">mouse-pointer</field>\n' +
                '                      </shadow>\n' +
                '                    </value>\n' +
                '                    <next>\n' +
                '                      <block id="9" type="motion_gotoxy">\n' +
                '                        <value name="X">\n' +
                '                          <shadow type="math_number" id="10">\n' +
                '                            <field name="NUM">0</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <value name="Y">\n' +
                '                          <shadow type="math_number" id="11">\n' +
                '                            <field name="NUM">0</field>\n' +
                '                          </shadow>\n' +
                '                        </value>\n' +
                '                        <next>\n' +
                '                          <block id="12" type="motion_goto">\n' +
                '                            <value name="TO">\n' +
                '                              <shadow type="motion_goto_menu">\n' +
                '                                <field name="TO">mouse-pointer</field>\n' +
                '                              </shadow>\n' +
                '                            </value>\n' +
                '                            <next>\n' +
                '                              <block id="13" type="motion_glidesecstoxy">\n' +
                '                                <value name="SECS">\n' +
                '                                  <shadow type="math_number" id="14">\n' +
                '                                    <field name="NUM">1</field>\n' +
                '                                  </shadow>\n' +
                '                                </value>\n' +
                '                                <value name="X">\n' +
                '                                  <shadow type="math_number" id="15">\n' +
                '                                    <field name="NUM">0</field>\n' +
                '                                  </shadow>\n' +
                '                                </value>\n' +
                '                                <value name="Y">\n' +
                '                                  <shadow type="math_number" id="16">\n' +
                '                                    <field name="NUM">0</field>\n' +
                '                                  </shadow>\n' +
                '                                </value>\n' +
                '                                <next>\n' +
                '                                  <block id="17" type="motion_glideto">\n' +
                '                                    <value name="SECS">\n' +
                '                                      <shadow type="math_number" id="18">\n' +
                '                                        <field name="NUM">1</field>\n' +
                '                                      </shadow>\n' +
                '                                    </value>\n' +
                '                                    <value name="TO">\n' +
                '                                      <shadow type="motion_glideto_menu">\n' +
                '                                        <field name="TO">mouse-pointer</field>\n' +
                '                                      </shadow>\n' +
                '                                    </value>\n' +
                '                                    <next>\n' +
                '                                      <block id="19" type="motion_changexby">\n' +
                '                                        <value name="DX">\n' +
                '                                          <shadow type="math_number" id="20">\n' +
                '                                            <field name="NUM">10</field>\n' +
                '                                          </shadow>\n' +
                '                                        </value>\n' +
                '                                        <next>\n' +
                '                                          <block id="21" type="motion_setx">\n' +
                '                                            <value name="X">\n' +
                '                                              <shadow type="math_number" id="22">\n' +
                '                                                <field name="NUM">0</field>\n' +
                '                                              </shadow>\n' +
                '                                            </value>\n' +
                '                                            <next>\n' +
                '                                              <block id="23" type="motion_changeyby">\n' +
                '                                                <value name="DY">\n' +
                '                                                  <shadow type="math_number" id="24">\n' +
                '                                                    <field name="NUM">10</field>\n' +
                '                                                  </shadow>\n' +
                '                                                </value>\n' +
                '                                                <next>\n' +
                '                                                  <block id="25" type="motion_sety">\n' +
                '                                                    <value name="Y">\n' +
                '                                                      <shadow type="math_number" id="26">\n' +
                '                                                        <field name="NUM">0</field>\n' +
                '                                                      </shadow>\n' +
                '                                                    </value>\n' +
                '                                                    <next>\n' +
                '                                                      <block id="27" type="motion_setrotationstyle">\n' +
                '                                                        <field name="STYLE">left-right</field>\n' +
                '                                                        <next/>\n' +
                '                                                      </block>\n' +
                '                                                    </next>\n' +
                '                                                  </block>\n' +
                '                                                </next>\n' +
                '                                              </block>\n' +
                '                                            </next>\n' +
                '                                          </block>\n' +
                '                                        </next>\n' +
                '                                      </block>\n' +
                '                                    </next>\n' +
                '                                  </block>\n' +
                '                                </next>\n' +
                '                              </block>\n' +
                '                            </next>\n' +
                '                          </block>\n' +
                '                        </next>\n' +
                '                      </block>\n' +
                '                    </next>\n' +
                '                  </block>\n' +
                '                </next>\n' +
                '              </block>\n' +
                '            </next>\n' +
                '          </block>\n' +
                '        </next>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('variables', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('(x position)(y position)(direction)');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml" x="10" y="210">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="motion_xposition" x="10" y="10"/>\n' +
                '  <block id="1" type="motion_yposition" x="10" y="110"/>\n' +
                '  <block id="2" type="motion_direction" x="10" y="210"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
})

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

});
