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

describe('Sounds', function() {
    describe('blocks', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML(
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
                'play drum [ikbenverzonnen] for {0.2} beats',false);
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sound_play" >\n' +
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
                '  <block id="21" type="sound_setinstrumentto" >\n' +
                '    <value name="INSTRUMENT">\n' +
                '      <shadow type="sound_instruments_menu">\n' +
                '        <field name="INSTRUMENT">ikook</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="22" type="sound_playdrumforbeats">\n' +
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
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="sound_volume" x="10" y="10"/>\n' +
                '  <block id="1" type="sound_tempo" x="10" y="110"/>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

});
