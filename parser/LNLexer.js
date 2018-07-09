/**
 * LNLexer + tokens.
 *
 * @file   This files defines the lexer and tokens for  scratch-LN.
 * @author Ellen Vanhove.
 */
import { Token, Lexer, createToken } from "chevrotain"

//DO NOT FORGET TO ADD THE EXPORT WHEN COPY PASTING
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

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
    // - \ followed by any character or a newline = [^] not

    //no whitespace in the beginning or end -> will be skipped (OR allow whitespace with keywords?)
    //char (whitespace* char)*

        /((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"#@: \t\n]|\\[^])([ \t]*((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: \t]|\\[^]))*/,

    line_breaks: true
});

export const ScratchLNComment = createToken({
    name: "ScratchLNComment",
    pattern: Lexer.NA,
})

export const LineComment = createToken({
    name: "LineComment",
    pattern: /\/\/[^\n]*[\n]?/,
    group: Lexer.SKIPPED,
    categories: [ScratchLNComment],
});

export const BlockComment = createToken({
    name: "BlockComment",
    //between /**/
    //allowed to use * and / within text but not after each other
    //most chars = [^\*]
    //* followed by /  = /\*(?!\/))
    pattern: /\/\*([^\*]|\*(?!\/))*\*\//,
    group: Lexer.SKIPPED,
    categories: [ScratchLNComment],
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

export const LAngleBracket = createToken({
    name: "LAngleBracket",
    pattern: /</
});

export const RAngleBracket = createToken({
    name: "RAngleBracket",
    pattern: />/
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
    pattern: Lexer.NA,
    //longer_alt: Label //I would expect that this is valid for all keywords but apparently not
});

export const If = createToken({
    name: "If",
    pattern: /if/i,
    categories: [Keyword],
    longer_alt: Label
});

export const Then = createToken({
    name: "Then",
    pattern: /then/i,
    categories: [Keyword],
    longer_alt: Label
});

export const Else = createToken({
    name: "Else",
    pattern: /else/i,
    categories: [Keyword],
    longer_alt: Label
});

export const Forever = createToken({
    name: "Forever",
    pattern: /forever/i,
    categories: [Keyword],
    longer_alt: Label
});

export const Repeat = createToken({
    name: "Repeat",
    pattern: /repeat/i,
    categories: [Keyword],
    longer_alt: Label
});
export const RepeatUntil = createToken({
    name: "RepeatUntil",
    pattern: /repeat[ \t]+until/i,
    categories: [Keyword],
    longer_alt: Label
});

export const End = createToken({
    name: "End",
    pattern: /end/i,
    categories: [Keyword],
    longer_alt: Label
});

export const Modifier = createToken({
    name: "Modifier",
    pattern: /::((:(?!:))|[^\{\|\\#@: \t\n]|\\[^])([ \t]*((:(?!:))|[^\|\\#@: \t]|\\[^]))*/
});

export const Comment = createToken({
    name: "Comment",
    //similar to stringliteral but between ||
    pattern: /\|([^\|\\]|\\.)*\|/
});

export const ID = createToken({
    name: "ID",
    pattern: /@[a-z0-9_]+/i
});


export const Delimiter = createToken({
    name: "Delimiter",
    pattern: /;[ \t]*\n|;|\n/,
    line_breaks: true
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t]+/,
    group: Lexer.SKIPPED,
    line_breaks: false
});

//order matters!
export const allTokens = [
    WhiteSpace,
    LineComment, BlockComment, Comment, //match before anything else
    Literal, StringLiteral, NumberLiteral, ColorLiteral, ChoiceLiteral,
    Forever, End, Repeat, If, Else, Then, RepeatUntil,
    Delimiter,
    LCurlyBracket, RCurlyBracket,
    LRoundBracket, RRoundBracket,
    RAngleBracket, LAngleBracket,
    Modifier, ID,
    Label
];

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

export const LNLexer = new Lexer(allTokens);
