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
 * modifiers: list of tokens
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


export const TYPE = "type";
export const EXPRESSION = "expression";
export const PREDICATE = "predicate";
export const ATOMIC = "atomic";
export const EMPTY = "empty";
export const CHOICE = "choice";
export const TEXT = "text";
export const TEXT_OR_NUMBER = "text or number";
export const COLOR = "color";

export const COMMENT = "comment";
export const ID = "id";
export const CBLOCK = "cblock";


const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();


export class InfoLNVisitor extends BaseCstVisitor {

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
            TEXT: this.unescapeLabel(this.getTextAtomic(ctx)),
            OFFSET: offset,
            TYPE: ATOMIC,
            ID: this.visit(ctx.annotations).ID
        }
    }

    unescapeLabel(text){
        //replace a \ followed by a not nothing character by only the character
        return text.replace(/\\([^])/g, '$1');
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
        return child.OFFSET
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

        return text;
    }

    composite(ctx) {

    }

    ifelse(ctx) {
        return {
            PLACEHOLDER: "%s",
            TEXT: "",
            OFFSET: ctx.If.offset,
            TYPE: CBLOCK,
            ID: this.visit(ctx.annotations).ID
        }
    }

    forever(ctx) {
        return {
            PLACEHOLDER: "%s",
            TEXT: "",
            OFFSET: ctx.Forever.offset,
            TYPE: CBLOCK,
            ID: this.visit(ctx.annotations).ID
        }
    }

    repeat(ctx) {
        return {
            PLACEHOLDER: "%s",
            TEXT: "",
            OFFSET: ctx.Repeat.offset,
            TYPE: CBLOCK,
            ID: this.visit(ctx.annotations).ID
        }
    }

    repeatuntil(ctx) {
        return {
            PLACEHOLDER: "%s",
            TEXT: "",
            OFFSET: ctx.RepeatUntil.offset,
            TYPE: CBLOCK,
            ID: this.visit(ctx.annotations).ID
        }
    }

    clause(ctx) {

    }

    modifiers(ctx) {
        if (!ctx.Modifier) {
            return {
                MODIFIERS: []
            }
        }
        return {
            MODIFIERS: ctx.Modifier
        }
    }

    id(ctx) {
        if (ctx && ctx.ID) {
            return {
                OFFSET: ctx.ID[0].offset,
                TEXT: ctx.ID[0].image,
                ID: ctx.ID[0].image,
                TYPE: ID
            }
        } else {
            return {
                ID: null,
                TYPE: ID
            }
        }
    }

    comment(ctx) {
        return {
            OFFSET: ctx.Comment[0].offset,
            TEXT: this.unescapeComment(ctx.Comment[0].image),
            TYPE: COMMENT
        }
    }


    unescapeComment(text) {
        return text.replace(/\\([^])/g, '$1').replace(/^\|(.*(?=\|$))\|$/, '$1');
    }

    annotations(ctx) {
        let idinfo = this.visit(ctx.id);
        let modInfo = this.visit(ctx.modifiers);
        return {
            ID: idinfo.ID,
            MODIFIERS: modInfo.MODIFIERS
        }

    }


    argument(ctx) {
        let type;
        let id = ctx.id?this.visit(ctx.id).ID:null;
        if (ctx.Literal) {
            let text = "";
            if (tokenMatcher(ctx.Literal[0], ChoiceLiteral)) {
                text = this.unescapeChoiceLiteral(ctx.Literal[0].image);
                type = CHOICE;
            } else if (tokenMatcher(ctx.Literal[0], ColorLiteral)) {
                text = this.makeValidColor(ctx.Literal[0].image);
                type = COLOR
            } else {
                text = this.unescapeStringLiteral(ctx.Literal[0].image);
                type = TEXT_OR_NUMBER
            }
            return {
                PLACEHOLDER: "%s",
                TEXT: text,
                OFFSET: ctx.Literal[0].startOffset,
                TYPE: type,
                ID: id
            }
        }else if (ctx.Label) {
            return {
                PLACEHOLDER: "%s",
                TEXT:  ctx.Label[0].image,
                OFFSET: ctx.Label[0].startOffset,
                TYPE: TEXT_OR_NUMBER,
                ID: id
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
                OFFSET: ctx.LCurlyBracket[0].startOffset,
                TYPE: EMPTY,
                ID: id
            }
        }
    }


    argument$empty(ctx) {

    }

    unescapeStringLiteral(text) {
        return text.replace(/\\([^])/g, '$1').replace(/^"(.*(?="$))"$/, '$1');
    }

    unescapeChoiceLiteral(text) {
        return text.replace(/\\([^])/g, '$1').replace(/^\[(.*(?=\]$))\]$/, '$1');
    }

    /**
     * color has to have 6 digits so ABC -> AABBCC
     * @param text
     */
    makeValidColor(text) {
        return text.replace(/^#([0-F])([0-F])([0-F])$/i, '#$1$1$2$2$3$3')
    }

    condition(ctx) {
        return this.visit(ctx.expression);
    }

    condition$empty(ctx) {

    }

    expression(ctx) {
        return {
            PLACEHOLDER: "%s",
            OFFSET: ctx.LRoundBracket[0].startOffset,
            TYPE: EXPRESSION,
            ID: this.id(ctx.ID).ID,
            TEXT: ctx.atomic?this.visit(ctx.atomic).TEXT:""
        }
    }

    predicate(ctx) {
        return {
            PLACEHOLDER: "%b",
            OFFSET: ctx.LAngleBracket[0].startOffset,
            TYPE: PREDICATE,
            ID: this.id(ctx.ID).ID,
            TEXT: ctx.atomic?this.visit(ctx.atomic).TEXT:""
        }
    }

    //////////////////////////////////////////////////
    //// no 'real' visitor methods as they are not rules.
    //////////////////////////////////////////////////


    //////////////////////////////////////////////////
    //// simplified getters
    //////////////////////////////////////////////////

    /**
     * returns a string for the given ctx
     * @param ctx
     * @param rule explicitly declare the rule that needs to be used:
     *             this is necessary if this function is called with whole ctx and not with a child
     */
    getString(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.visit(ctx);
        } else {
            x = this[rule](ctx);
        }
        return x.TEXT;
    }

    getPlaceholder(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.visit(ctx);
        } else {
            x = this[rule](ctx);
        }
        return x.PLACEHOLDER;
    }

    getID(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.visit(ctx);
        } else {
            x = this[rule](ctx);
        }
        return x.ID;
    }

    getType(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.visit(ctx);
        } else {
            x = this[rule](ctx);
        }
        return x.TYPE;
    }

    getModifiers(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.visit(ctx);
        } else {
            x = this[rule](ctx);
        }
        return x.MODIFIERS;
    }
}
