/**
 * Example test.
 *
 * https://mochajs.org/#getting-started and https://x-team.com/blog/setting-up-javascript-testing-tools-for-es6/.
 *
 * @file   This files defines the an example test.
 * @author Ellen Vanhove.
 */
//import parseTextToXML from './../parser/parserUtils.js'

var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1,2,3].indexOf(4), -1);
            //var xml = parseTextToXML('pen up');
            //console.log(xml);
        });
    });
});
