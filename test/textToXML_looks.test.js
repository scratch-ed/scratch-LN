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

describe('looks', function() {
    describe('stack blocks', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML(
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
});