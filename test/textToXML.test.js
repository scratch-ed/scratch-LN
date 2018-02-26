/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */

/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */
import parseTextToXML from './../parser/parserUtils.js'
var chai = require('chai');
chai.use(require('chai-string'));
var assert = require('chai').assert;

//const assert = require('assert');

describe('scripts', function() {
    describe('pen up', function() {
        it('should return valid xml', function() {
            let parsed = parseTextToXML('pen up');
            //console.log(parsed)
            let expected = '<xml xmlns="http://www.w3.org/1999/xhtml">' +
                '  <variables/>' +
                '  <block id="0" type="pen_penup" x="10" y="10">' +
                '    <next/>' +
                '  </block>' +
                '</xml>';
            assert.equalIgnoreSpaces(parsed, expected);
        });
    });
});
