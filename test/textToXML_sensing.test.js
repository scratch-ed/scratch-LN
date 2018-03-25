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

describe('sensing', function() {
    it('should return valid xml', function() {
        let text = 'touching [mouse-pointer]?\n' +
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
            'days since 2000'
        console.log(text)
        let parsed = parseTextToXML(text);
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