/**
 * LNLexer + tokens.
 *
 * @file   This files defines the lexer and tokens for  scratch-LN.
 * @author Ellen Vanhove.
 */
import { Token, Lexer, createToken } from "chevrotain"

export const Label = createToken({
    name: "Label",
    pattern:
    //necessary to escape: [] {} () " ; \n # | @ \n and whitespace
    //this cannot contain :: and should not partially match ::
    //--> :(?!:) : not followed by another :
    // --> x(?!y) = negative lookahead (matches 'x' when it's not followed by 'y')

    //atleast one character
    // - a : followed by a not :  = (:(?!:))
    // - normal - not necessary to escape or whitespace - characters = [^\{\|\(\)\}\<\>\[\];\\"\n#@: \t]
    // - \ followed by any character or a newline = \\(.|\n))

    //no whitespace in the beginning or end -> will be skipped (OR allow whitespace with keywords?)
    //char (whitespace* char)* char*

        /((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: \t]|\\(.|\n))([ \t]*((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: \t]|\\(.|\n)))*((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: \t]|\\(.|\n))*/,

    line_breaks: true
});

export const LineComment = createToken({
    name: "LineComment",
    pattern: /\/\/[^\n]*[\n]?/,
    group: Lexer.SKIPPED,
});

export const BlockComment = createToken({
    name: "BlockComment",
    //between /**/
    //allowed to use * and / within text but not after each other
    //most chars = [^\*]
    //* followed by /  = /\*(?!\/))
    pattern: /\/\*([^\*]|\*(?!\/))*\*\//,
    group: Lexer.SKIPPED,
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

export const Comment = createToken({
    name: "Comment",
    //similar to stringliteral but between ||
    pattern: /\|([^\|\\]|\\.)*\|/
});


export const DoubleColon = createToken({
    name: "DoubleColon",
    pattern: /::/
});

export const ID = createToken({
    name: "ID",
    pattern: /@[a-z0-9_]+/i
});

export const Literal = createToken({
    name: "Literal",
    pattern: Lexer.NA
});

export const StringLiteral = createToken({
    name: "StringLiteral",
    //"char*" -> "char+" or ""
    //most characters = [^"]
    //escaped the " char =  \\"
    //cannot end with \ so must end with = [^\\"] or \\"
    //empty is allowed ""
    pattern: /"([^"\\]|\\.)*"/,
    categories: [Literal],
    line_breaks: true
});

export const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(\d+)(\.\d+)?/,
    categories: [Literal],
    longer_alt: Label,
});

export const ColorLiteral = createToken({
    name: "ColorLiteral",
    //first the 6 , otherwise only 3 will be matched
    pattern: /#([0-9a-f]{6}|[0-9a-f]{3})/i,
    categories: [Literal]
});

export const ChoiceLiteral = createToken({
    name: "ChoiceLiteral",
    //idem stringLiteral
    pattern: /\[([^\]\\]|\\.)*\]/,
    categories: [Literal],
    line_breaks: true
});

export const Keyword = createToken({
    name: "Keyword",
    pattern: Lexer.NA
});

export const Forever = createToken({
    name: "Forever",
    pattern: /forever/i,
    longer_alt: Label,
    categories: [Keyword]
});

export const End = createToken({
    name: "End",
    pattern: /end/i,
    longer_alt: Label,
    categories: [Keyword]
});

export const Then = createToken({
    name: "Then",
    pattern: /then/i,
    longer_alt: Label,
    categories: [Keyword]
});

export const Repeat = createToken({
    name: "Repeat",
    pattern: /repeat/i,
    longer_alt: Label,
    categories: [Keyword]
});
export const RepeatUntil = createToken({
    name: "RepeatUntil",
    pattern: /repeat[ \t]+until/i,
    longer_alt: Label,
    categories: [Keyword]
});

export const If = createToken({
    name: "If",
    pattern: /if/i,
    longer_alt: Label,
    categories: [Keyword]
});

export const Else = createToken({
    name: "Else",
    pattern: /else/i,
    longer_alt: Label,
    categories: [Keyword]
});


// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t]+/,
    group: Lexer.SKIPPED,
    line_breaks: false
});

export const Delimiter = createToken({
    name: "Delimiter",
    pattern: /;[ \t]*\n|;|\n/,
    line_breaks: true
});

//order matters!
export const allTokens = [
    WhiteSpace,
    LineComment, BlockComment, Comment,
    Literal, StringLiteral, NumberLiteral, ColorLiteral, ChoiceLiteral,
    Forever, End, Repeat, If, Else, Then, RepeatUntil,
    Delimiter,
    Label,
    LCurlyBracket, RCurlyBracket,
    LRoundBracket, RRoundBracket,
    RAngleBracket, LAngleBracket,
    DoubleColon, ID
];

export const LNLexer = new Lexer(allTokens);
