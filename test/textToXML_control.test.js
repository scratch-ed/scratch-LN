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

describe('control blocks', function() {
    describe('hats', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('when greenflag clicked\n' +
                '\n' +
                'when [space] key pressed;\n' +
                '\n' +
                'when this sprite clicked;\n' +
                '\n' +
                'when backdrop switches to [backdrop 1]\n' +
                '\n' +
                'when [timer] \\> {10}\n' +
                '\n' +
                'when I receive [message1];\n' +
                '\n' +
                'broadcast [message1];\n' +
                '\n' +
                'broadcast [message1] and wait');

            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables>\n' +
                '    <variable type="broadcast_msg" id="var0">message1</variable>\n' +
                '  </variables>\n' +
                '  <block id="0" type="event_whenflagclicked" x="10" y="10">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="1" type="event_whenkeypressed" x="10" y="110">\n' +
                '    <field name="KEY_OPTION">space</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="2" type="event_whenthisspriteclicked" x="10" y="210">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="3" type="event_whenbackdropswitchesto" x="10" y="310">\n' +
                '    <field name="BACKDROP">backdrop 1</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="4" type="event_whengreaterthan" x="10" y="410">\n' +
                '    <field name="WHENGREATERTHANMENU">timer</field>\n' +
                '    <value name="VALUE">\n' +
                '      <shadow type="math_number" id="5">\n' +
                '        <field name="NUM">10</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="6" type="event_whenbroadcastreceived" x="10" y="510">\n' +
                '    <field name="BROADCAST_OPTION" variabletype="broadcast_msg" id="var0">message1</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="7" type="event_broadcast" x="10" y="610">\n' +
                '    <value name="BROADCAST_INPUT">\n' +
                '      <shadow type="event_broadcast_menu">\n' +
                '        <field name="BROADCAST_OPTION" variabletype="broadcast_msg" id="var0">message1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="8" type="event_broadcastandwait" x="10" y="710">\n' +
                '    <value name="BROADCAST_INPUT">\n' +
                '      <shadow type="event_broadcast_menu">\n' +
                '        <field name="BROADCAST_OPTION" variabletype="broadcast_msg" id="var0">message1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

    describe('other', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML(
                'wait {1} seconds\n' +
                '\n' +
                'wait until {<aa>}\n' +
                '\n' +
                'stop [all]\n' +
                '\n' +
                'when I start as a clone\n' +
                '\n' +
                'create clone of [myself]\n' +
                '\n' +
                'delete this clone');
            console.log('\n' +
                'wait {1} seconds\n' +
                '\n' +
                'wait until {<aa>}\n' +
                '\n' +
                'stop [all]\n' +
                '\n' +
                'when I start as a clone\n' +
                '\n' +
                'create clone of [myself]\n' +
                '\n' +
                'delete this clone')
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block id="0" type="control_wait" x="10" y="10">\n' +
                '    <value name="DURATION">\n' +
                '      <shadow type="math_number" id="1">\n' +
                '        <field name="NUM">1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="2" type="control_wait_until" x="10" y="110">\n' +
                '    <value name="CONDITION">\n' +
                '      <block type="extension_wedo_boolean" id="3" x="10" y="110"/>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="4" type="control_stop" x="10" y="310">\n' +
                '    <field name="STOP_OPTION">all</field>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="5" type="control_start_as_clone" x="10" y="410">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="6" type="control_create_clone_of" x="10" y="510">\n' +
                '    <value name="CLONE_OPTION">\n' +
                '      <shadow type="control_create_clone_of_menu">\n' +
                '        <field name="CLONE_OPTION">myself</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '  <block id="7" type="control_delete_this_clone" x="10" y="610">\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});


describe('loops', function() {
    describe('forever nested', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('forever\n' +
                'forever\n' +
                'forever');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block type="control_forever" id="0" x="10" y="10">\n' +
                '     \n' +
                '    <statement  name="SUBSTACK">\n' +
                '       \n' +
                '      <block type="control_forever" id="1">\n' +
                '         \n' +
                '        <statement  name="SUBSTACK">\n' +
                '           \n' +
                '          <block type="control_forever" id="2">\n' +
                '             \n' +
                '            <statement  name="SUBSTACK"> </statement >\n' +
                '            <next/>\n' +
                '          </block>\n' +
                '        </statement >\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next/>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
    describe('repeat ', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML(
                'repeat {1}\n' +
                'adsf\n' +
                'end\n' +
                'asdf');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '<variables/>\n'+
                '  <block type="control_repeat" id="0" x="10" y="10">\n' +
                '    <value name="TIMES">\n' +
                '      <shadow type="math_number" id="1">\n' +
                '        <field name="NUM">1</field>\n' +
                '      </shadow>\n' +
                '    </value>\n' +
                '    <statement  name="SUBSTACK">\n' +
                '      <block id="2" type="procedures_call">\n' +
                '        <mutation proccode="adsf"/>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </statement >\n' +
                '    <next>\n' +
                '      <block id="3" type="procedures_call">\n' +
                '        <mutation proccode="asdf"/>\n' +
                '        <next/>\n' +
                '      </block>\n' +
                '    </next>\n' +
                '  </block>\n' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });

});


describe('ifelse', function() {
    describe('nested if in each if', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('if <>\n' +
                'if <>\n' +
                'end\n' +
                'else\n' +
                'if <>');
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
                '  <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
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
                '      <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
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
                '      <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK"/>\n' +
                '    <statement  name="SUBSTACK2">\n' +
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
                '      <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
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
                '      <variables/>\n' +
                '  <block type="control_if_else" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION"/>\n' +
                '    <statement  name="SUBSTACK">\n' +
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
                '      <variables>\n' +
                '        <variable type="list" id="var0">lili</variable>\n' +
                '      </variables>\n' +
                '  <block type="control_if" id="0" x="10" y="10">\n' +
                '    <value name="CONDITION">\n' +
                '      <block id="1" type="data_listcontainsitem">\n' +
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
