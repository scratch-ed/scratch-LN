/**
 * Template for the visitor.
 *
 * This file consist of a template for the visitor .
 *
 * @file   This files defines the LNVisitor class.
 * @author Ellen Vanhove.
 */

import {tokenMatcher} from 'chevrotain'
//import {NumberLiteral, ColorLiteral} from "./LNLexer";
const lntokens = require("./LNLexer");
let NumberLiteral = lntokens.NumberLiteral;
let ColorLiteral = lntokens.ColorLiteral;
let StringLiteral = lntokens.StringLiteral;
let ChoiceLiteral = lntokens.ChoiceLiteral;
import {lnparser} from "./LNParser"


const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();

/*
    No dispatching necessary if nothing special happens, specifically block and composite
    only for no return values
    docs: This base visitor includes a default implementation for all visit methods which simply invokes this.visit on all none terminals in the CSTNode's children.

*/
//const BaseCstVisitorWithDefaults = lnparser.getBaseCstVisitorConstructorWithDefaults();

//DO NOT FORGET THE EXPORT
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
export     class LNVisitor extends BaseCstVisitor {

    constructor() {
        super();
        // This helper will detect any missing or redundant methods on this visitor
        this.validateVisitor()
    }

    code(ctx) {

    }

    delimiters(ctx) {

    }

    stackDelimiter(ctx) {

    }

    comments(ctx) {

    }

    stack(ctx) {

    }

    block(ctx) {

    }

    atomic(ctx) {

    }

    composite(ctx) {

    }

    ifelse(ctx) {

    }

    forever(ctx) {

    }

    repeat(ctx) {

    }

    repeatuntil(ctx) {

    }

    clause(ctx) {

    }

    annotations(ctx) {

    }

    modifiers(ctx) {

    }

    id(ctx) {

    }

    comment(ctx) {

    }

    argument(ctx) {

    }

    argument$empty(ctx) {

    }

    condition(ctx) {

    }

    condition$empty(ctx) {

    }

    expression(ctx) {

    }

    predicate(ctx) {

    }
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\