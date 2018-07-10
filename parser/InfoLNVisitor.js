/**
 * Template for the visitor.
 *
 * .Provides information about parts of the three in the format
 *
 * {
 * placeHolder: %b (boolean)| %s (string) ,
 * offset: number,
 * text: "a string",
 * type: "tokename" or "expression" or "predicate"
 * }
 * the options are only avaible if they make sense.
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

export const PLACEHOLDER = "placeholder";
export const OFFSET = "offset";
export const TEXT = "text";

export const TYPE = "type";
export const EXPRESSION = "expression";
export const PREDICATE = "predicate";
export const ATOMIC = "atomic";
export const EMPTY = "empty";


const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();


export class InfoLNVisitor extends BaseCstVisitor {

    constructor() {
        super();
        // This helper will detect any missing or redundant methods on this visitor
        this.validateVisitor()
    }

    code(ctx) {

    }

    delimiter(ctx){

    }

    comments(ctx) {

    }

    stackDelimiter(ctx){

    }

    stack(ctx) {

    }

    block(ctx) {

    }

    block$atomic(ctx) {

    }

    block$composite(ctx) {

    }

    atomic(ctx) {
        //calculate the offset
        let offset = 0;
        if (ctx.Label) {
            //if there is a label and a argument check which one occurs first
            if (ctx.argument) {
                offset = this.getOffsetArgument(ctx.argument[0]) < ctx.Label[0].startOffset ?
                            this.getOffsetArgument(ctx.argument[0]) : ctx.Label[0].startOffset
            } else {
                offset = ctx.Label[0].startOffset
            }
        } else {
            //only a argument
            offset = this.getOffsetArgument(ctx.argument[0])
        }

        return {
            TEXT: this.getTextAtomic(ctx),
            OFFSET: offset,
            TYPE: ATOMIC
        }
    }

    /**
     * marges the labels into one string
     * @param ctx
     * @returns {string}
     */
    getTextAtomic(ctx) {
        let matchString = '';
        let a = 0;
        for (let i = 0; ctx.Label && i < ctx.Label.length; i++) {
            if (ctx.argument && a < ctx.argument.length) {
                while (a < ctx.argument.length && this.getOffsetArgument(ctx.argument[a]) < ctx.Label[i].startOffset) {
                    matchString += ' %' + (a + 1) + ' ';
                    ++a;
                }
            }
            matchString += ' ' + ctx.Label[i].image + ' ';
        }
        for (a; ctx.argument && a < ctx.argument.length; a++) {
            matchString += ' %' + (a + 1) + ' ';
        }
        return this.cleanupText(matchString)
    }

    getOffsetArgument(arg) {
        if (!arg) {
            return Number.MAX_SAFE_INTEGER; //avoid infinite loop
        }
        let child = this.visit(arg);
        return child[OFFSET]
    }

    /**
     * cleanup a text
     * * to remove multiple spaces
     * * unescape special characters todo
     * @param text e.g. merged labels
     * @returns {*}
     */
    cleanupText(text) {
        //remove double spaces to easier match
        text = text.replace(/ +(?= )/g, '');
        //' ?'
        text = text.replace(/ +(?=[\?])/g, '');
        //text = text.replace(/ +(?=[\%][^sbn])/g, '');
        //remove spaces at beginning and end
        text = text.trim();
        //todo: unescape shizzle

        return text;
    }

    composite(ctx) {

    }

    composite$ifelse(ctx) {

    }

    composite$forever(ctx) {

    }

    composite$repeat(ctx) {

    }

    composite$repeatuntil(ctx) {

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

    modifiers(ctx) {

    }

    annotations(ctx) {

    }


    argument(ctx) {
        if (ctx.Literal) {
            return {
                PLACEHOLDER: "%s",
                TEXT: this.unescapeString(ctx.Literal[0].image),
                OFFSET: ctx.Literal.offset,
                TYPE: ctx.Literal.tokenName
            }
        } else if (ctx.expression) {
            return this.visit(ctx.expression);
        } else if (ctx.predicate) {
            return this.visit(ctx.predicate);
        } else {
            //empty argument
            return {
                PLACEHOLDER: "%s",
                TEXT: "",
                OFFSET: ctx.LCurlyBracket.offset,
                TYPE: EMPTY
            }
        }

    }


    argument$empty(ctx) {

    }

    unescapeString(text){
        return text.replace(/\\"/g, '"').replace(/^"(.*(?="$))"$/, '$1');
    }

    condition(ctx) {
        return this.visit(ctx.expression);
    }

    condition$empty(ctx) {

    }

    expression(ctx) {
        return {
            PLACEHOLDER: "%s",
            OFFSET: ctx.LRoundBracket.offset,
            TYPE: EXPRESSION
        }
    }

    predicate(ctx) {
        return {
            PLACEHOLDER: "%b",
            OFFSET: ctx.LAngleBracket.offset,
            TYPE: PREDICATE
        }
    }

}
