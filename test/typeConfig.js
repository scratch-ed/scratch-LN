/**
 * tests for verifyInputType
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */
import parseTextToXML from './../parser/parserUtils.js'
import {verifyInputType} from "../parser/typeConfigUtils";
import {INPUTTYPE} from "../parser/typeConfig";
let chai = require('chai');
chai.use(require('chai-string'));
let assert = require('chai').assert;


    describe('verifyInputType', function() {
        it('1 is a number', function() {
            let ret = verifyInputType("1",INPUTTYPE.NUMBER);
            let expected = true;
            assert.equal(ret,expected);
        });

        it('1 is not a color', function() {
            let ret = verifyInputType("1",INPUTTYPE.COLOR);
            let expected = false;
            assert.equal(ret,expected);
        });

        it('1a1 is not a number', function() {
            let ret = verifyInputType("1a1",INPUTTYPE.NUMBER);
            let expected = false;
            assert.equal(ret,expected);
        });

        it('1a1 is not a positive number', function() {
            let ret = verifyInputType("1a1",INPUTTYPE.POSITIVE_NUMBER);
            let expected = false;
            assert.equal(ret,expected);
        });

        it('-1 is not a positive number', function() {
            let ret = verifyInputType("-1",INPUTTYPE.POSITIVE_NUMBER);
            let expected = false;
            assert.equal(ret,expected);
        });
    });


