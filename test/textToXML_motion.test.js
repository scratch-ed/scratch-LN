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


describe('motion',function(){

    describe('go to location', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('go to [mouse-pointer];');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="motion_goto" x="10" y="10">\n' +
                '    <value name="TO">\n' +
                '      <shadow type="motion_goto_menu">\n' +
                '        <field name="TO">mouse-pointer</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

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
});