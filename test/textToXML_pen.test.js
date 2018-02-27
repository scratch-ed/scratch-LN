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