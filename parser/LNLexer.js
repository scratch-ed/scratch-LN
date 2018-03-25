/**
 * LNLexer + tokens.
 *
 *
 *
 * @file   This files defines the lexer and tokens for  scratch-LN.
 * @author Ellen Vanhove.
 */
import { Token, Lexer, createToken } from "chevrotain"

export const Identifier = createToken({
    name: "Identifier",
    pattern:
    //not [] {} () " :: ; \n # unless escaped
    // : followed by not : or in the end
    //    /(:?[^\{\(\)\}\<\>\[\]:;\\"\n#]|\\[\{\(\)\}\<\>\[\]:;\\"\n#])+:?/,
        /(:?[^\{\(\)\}\<\>\[\]:;\\"\n#@]|\\[\{\(\)\}\<\>\[\]:;\\"\n#@])+/,
    line_breaks: true
});

export const LCurlyBracket = createToken({
    name: "LCurlyBracket",
    pattern: /{/
});

export const RCurlyBracket = createToken({
    name: "RCurlyBracket",
    pattern: /}/
});

export const LRoundBracket = createToken({
    name: "LRoundBracket",
    pattern: /\(/
});

export const RRoundBracket = createToken({
    name: "RRoundBracket",
    pattern: /\)/
});

export const RAngleBracket = createToken({
    name: "RAngleBracket",
    pattern: />/
});

export const LAngleBracket = createToken({
    name: "LAngleBracket",
    pattern: /</
});

export const LSquareBracket = createToken({
    name: "LSquareBracket",
    pattern: /\[/
});

export const RSquareBracket = createToken({
    name: "RSquareBracket",
    pattern: /\]/
});

export const DoubleColon = createToken({
    name: "DoubleColon",
    pattern: /::/
});

export const ID = createToken({
    name: "ID",
    pattern: /@[a-zA-Z0-9_]*/
});

export const Literal = createToken({
    name: "Literal",
    pattern: Lexer.NA
});

export const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"[^"]*"/,
    categories: Literal
});

export const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
    categories: [Literal, Identifier]
});

export const ColorLiteral = createToken({
    name: "ColorLiteral",
    pattern: /#[0-9a-z]{6}/,
    categories: [Literal]
});

export const Forever = createToken({
    name: "Forever",
    pattern: / *forever */,
});

export const End = createToken({
    name: "End",
    pattern: / *end */,
});

export const Then = createToken({
    name: "Then",
    pattern: / *then */,
});

export const Repeat = createToken({
    name: "Repeat",
    pattern: / *repeat */,
});

export const If = createToken({
    name: "If",
    pattern: / *if */
});

export const Else = createToken({
    name: "Else",
    pattern: / *else */,
});

export const RepeatUntil = createToken({
    name: "RepeatUntil",
    pattern: / *repeat *until */,
    //categories: Label //because this word occurs in 'until done', should not be a problem as it is never first
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t]+/,
    group: Lexer.SKIPPED,
    line_breaks: false
});

export const StatementTerminator = createToken({
    name: "StatementTerminator",
    pattern: /;\n|;|\n/,
    line_breaks: true
});

export const allTokens = [
    WhiteSpace,
    Literal, StringLiteral, NumberLiteral, ColorLiteral,
    Forever, End, RepeatUntil, Repeat, If, Else, Then,
    StatementTerminator,
    Identifier,
    LCurlyBracket, RCurlyBracket,
    LRoundBracket, RRoundBracket,
    RAngleBracket, LAngleBracket,
    LSquareBracket, RSquareBracket,
    DoubleColon,ID
];

export const LNLexer = new Lexer(allTokens);
