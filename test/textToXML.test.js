/**
 * tests for generating xml from text.
 *
 *
 * setup: https://mochajs.org/#getting-started and https://x-team.com/blog/setting-up-javascript-testing-tools-for-es6/.
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

describe('scripts_pen', function() {
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
});
