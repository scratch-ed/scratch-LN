/**
 * Template for the visitor.
 *
 * This file consist of a template for the visitor .
 *
 * @file   This files defines the LNVisitorTemplate class.
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

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();

export class InformationVisitor extends BaseCstVisitor {

    constructor() {
        super();
        // This helper will detect any missing or redundant methods on this visitor
        this.validateVisitor()
    }

    code(ctx) {

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

    modifier(ctx) {

    }

    annotations(ctx) {

    }

    argument(ctx) {

    }

    condition(ctx) {

    }

    expression(ctx) {

    }

    predicate(ctx) {

    }

}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\