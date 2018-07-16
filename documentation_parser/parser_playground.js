(function myGrammar() {
    "use strict";

    const createToken = chevrotain.createToken;
    const tokenMatcher = chevrotain.tokenMatcher;
    const Lexer = chevrotain.Lexer;
    const Parser = chevrotain.Parser;


    const Label = createToken({
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

    const ScratchLNComment = createToken({
        name: "ScratchLNComment",
        pattern: Lexer.NA,
    })

    const LineComment = createToken({
        name: "LineComment",
        pattern: /\/\/[^\n]*[\n]?/,
        group: Lexer.SKIPPED,
        categories: [ScratchLNComment],
    });

    const BlockComment = createToken({
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

    const LCurlyBracket = createToken({
        name: "LCurlyBracket",
        pattern: /{/
    });

    const RCurlyBracket = createToken({
        name: "RCurlyBracket",
        pattern: /}/
    });

    const LRoundBracket = createToken({
        name: "LRoundBracket",
        pattern: /\(/
    });

    const RRoundBracket = createToken({
        name: "RRoundBracket",
        pattern: /\)/
    });

    const LAngleBracket = createToken({
        name: "LAngleBracket",
        pattern: /</
    });

    const RAngleBracket = createToken({
        name: "RAngleBracket",
        pattern: />/
    });

    const Literal = createToken({
        name: "Literal",
        pattern: Lexer.NA
    });

    const StringLiteral = createToken({
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

    const NumberLiteral = createToken({
        name: "NumberLiteral",
        pattern: /-?(\d+)(\.\d+)?/,
        categories: [Literal],
        longer_alt: Label,
    });

    const ColorLiteral = createToken({
        name: "ColorLiteral",
        //first the 6 , otherwise only 3 will be matched
        pattern: /#([0-9a-f]{6}|[0-9a-f]{3})/i,
        categories: [Literal]
    });

    const ChoiceLiteral = createToken({
        name: "ChoiceLiteral",
        //idem stringLiteral
        pattern: /\[([^\]\\]|\\.)*\]/,
        categories: [Literal],
        line_breaks: true
    });

    const Keyword = createToken({
        name: "Keyword",
        pattern: Lexer.NA,
        //longer_alt: Label //I would expect that this is valid for all keywords but apparently not
    });

    const If = createToken({
        name: "If",
        pattern: /if/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const Then = createToken({
        name: "Then",
        pattern: /then/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const Else = createToken({
        name: "Else",
        pattern: /else/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const Forever = createToken({
        name: "Forever",
        pattern: /forever/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const RepeatUntil = createToken({
        name: "RepeatUntil",
        pattern: /repeat[ \t]*until/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const Repeat = createToken({
        name: "Repeat",
        pattern: /repeat/i,
        categories: [Keyword],
        longer_alt: Label
    });


    const End = createToken({
        name: "End",
        pattern: /end/i,
        categories: [Keyword],
        longer_alt: Label
    });

    const Modifier = createToken({
        name: "Modifier",
        pattern: /::((:(?!:))|[^\{\|\(\)<>\\#@: \t\n]|\\[^])([ \t]*((:(?!:))|[^\|\(\)<>\\#@: \t]|\\[^]))*/
    });

    const Comment = createToken({
        name: "Comment",
        //similar to stringliteral but between ||
        pattern: /\|([^\|\\]|\\.)*\|/
    });

    const ID = createToken({
        name: "ID",
        pattern: /@[a-z0-9_]+/i
    });


    const MultipleDelimiter = createToken({
        name: "MultipleDelimiter",
        //; \n should always bee seen as a whole 
        //so a ; alone must explicitly not been followed by a \n
        pattern: /((;[ \t]*\n|;[ \t]*(?!\n)|\n)[ \t]*){2,}/,
        line_breaks: true
    });

    const Delimiter = createToken({
        name: "Delimiter",
        pattern: /;[ \t]*\n?|\n/,
        line_breaks: true,
        //longer_alt: MultipleDelimiter
    });



    // marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
    const WhiteSpace = createToken({
        name: "WhiteSpace",
        pattern: /[ \t]+/,
        group: Lexer.SKIPPED,
        line_breaks: false
    });

    //order matters!
    const allTokens = [
        WhiteSpace,
        LineComment, BlockComment, Comment, //match before anything else
        Literal, StringLiteral, NumberLiteral, ColorLiteral, ChoiceLiteral,
        //WARNING: RepeatUntil must be defined before Repeat
        Forever, End, RepeatUntil, Repeat, If, Else, Then,
        //WARNING: StackDelimiter must be defined before Delimiter
        MultipleDelimiter, Delimiter,
        LCurlyBracket, RCurlyBracket,
        LRoundBracket, RRoundBracket,
        RAngleBracket, LAngleBracket,
        Modifier, ID,
        //WARNING: Label must be defined after anything else
        Label
    ];

    const LNLexer = new Lexer(allTokens);


    // ----------------- parser -----------------
    // Note that this is a Pure grammar, it only describes the grammar
    // Not any actions (semantics) to perform during parsing.
    function LNParser(input) {
        Parser.call(this, input, allTokens, {
            outputCst: true
        });

        const $ = this;

        $.RULE("code", () => {
            $.SUBRULE($.delimiters);
            $.OPTION(() => {
                $.SUBRULE($.comments);
            })
            $.OPTION2(() => {
                    $.SUBRULE($.stack);
                    $.MANY({
                        DEF: () => {
                            $.SUBRULE($.stackDelimiter);
                            $.OPTION3(() => {
                                $.SUBRULE2($.stack);
                            })
                        }
                    });
                })
                //$.CONSUME(chevrotain.EOF);
        });


        $.RULE("delimiters", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(Delimiter, {
                        LABEL: "leadingCodeDelimiters"
                    });
                }
            }, {
                ALT: () => {
                    $.CONSUME(MultipleDelimiter, {
                        LABEL: "leadingCodeDelimiters"
                    });
                },
            }, {
                ALT: chevrotain.EMPTY_ALT()
            }])
        })

        $.RULE("stackDelimiter", () => {
            $.AT_LEAST_ONE({
                DEF: () => {
                    $.OR([{
                        ALT: () => {
                            $.CONSUME(MultipleDelimiter, {
                                LABEL: "intermediateCodeDelimiters"
                            });
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE($.comments);
                        }
                    }]);
                }
            });
        });

        $.RULE("comments", () => {
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.comment);
                $.SUBRULE($.delimiters, {
                    LABEL: "trailingCommentsDelimiters"
                });
            });
        });

        $.RULE("stack", () => {
            $.SUBRULE($.block);
            $.MANY(() => {
                $.CONSUME(Delimiter, {
                    LABEL: "intermediateStackDelimiter"
                });
                $.SUBRULE2($.block);
            });
            $.OPTION(() => {
                $.CONSUME2(Delimiter, {
                    LABEL: "trailingStackDelimiter"
                });
            })
        });

        $.RULE("block", () => {
            $.OR([{
                ALT: () => {
                    $.SUBRULE($.atomic);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.composite);
                }
            }]);
        });

        $.RULE("atomic", () => {
            $.AT_LEAST_ONE(() => {
                $.OR([{
                    ALT: () => {
                        $.CONSUME(Label);
                    }
                }, {
                    ALT: () => {
                        $.SUBRULE($.argument);
                    }
                }]);
            });
            $.SUBRULE($.annotations);
        });

        $.RULE("composite", () => {
            $.OR([{
                ALT: () => {
                    $.SUBRULE($.ifelse);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.forever);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.repeat);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.repeatuntil);
                }
            }]);
        });

        $.RULE("ifelse", () => {
            $.CONSUME(If);
            $.SUBRULE($.condition);
            $.OPTION(() => {
                $.CONSUME(Then);
            });
            $.SUBRULE($.annotations);
            $.SUBRULE($.clause, {
                LABEL: "ifClause"
            });
            $.OPTION3(() => {
                $.OPTION4(() => {
                    $.CONSUME(Delimiter, {
                        LABEL: "trailingIfClauseDelimiter"
                    });
                });
                $.CONSUME(Else);
                $.SUBRULE3($.clause, {
                    LABEL: "elseClause"
                });
            });
        });

        $.RULE("forever", () => {
            $.CONSUME(Forever);
            $.SUBRULE($.annotations);
            $.SUBRULE($.clause);
        });


        $.RULE("repeat", () => {
            $.CONSUME(Repeat);
            $.SUBRULE($.argument);
            $.SUBRULE($.annotations);
            $.SUBRULE($.clause);
        });

        $.RULE("repeatuntil", () => {
            $.CONSUME(RepeatUntil);
            $.SUBRULE($.condition);
            $.SUBRULE($.annotations);
            $.SUBRULE($.clause);
        });




        $.RULE("clause", () => {
            $.OPTION(() => {
                $.CONSUME(Delimiter, {
                    LABEL: "leadingClauseDelimiter"
                });
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION3(() => {
                $.CONSUME(End);
            })
        });

        $.RULE("annotations", () => {
            $.SUBRULE($.modifiers);
            $.SUBRULE($.id);
            $.OPTION(() => {
                $.SUBRULE($.comment);
            });

        });

        $.RULE("modifiers", () => {
            $.MANY(() => {
                $.CONSUME(Modifier);
            })
        });

        $.RULE("id", () => {
            $.OPTION(() => {
                $.CONSUME(ID);
            });
        });

        $.RULE("comment", () => {
            $.CONSUME(Comment);
            $.SUBRULE($.modifiers);
            $.SUBRULE($.id);
        });

        $.RULE("argument", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.OR2([{
                        ALT: () => {
                            $.CONSUME(Literal);
                        }
                    }, {
                        ALT: () => {
                            $.CONSUME(Label);
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE($.expression);
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE($.predicate);
                        }
                    }, {
                        NAME: "$empty",
                        ALT: chevrotain.EMPTY_ALT()
                    }, ]);
                    $.OPTION2(() => {
                        $.CONSUME(ID);
                    });
                    $.CONSUME(RCurlyBracket);
                }
            }, {
                ALT: () => {
                    $.OR3([{
                        ALT: () => {
                            $.CONSUME(StringLiteral, {
                                LABEL: "Literal"
                            });
                        }
                    }, {
                        ALT: () => {
                            $.CONSUME(ColorLiteral, {
                                LABEL: "Literal"
                            });
                        }
                    }, {
                        ALT: () => {
                            $.CONSUME(ChoiceLiteral, {
                                LABEL: "Literal"
                            });
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE2($.expression);
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE2($.predicate);
                        }
                    }]);
                }
            }])

        });

        $.RULE("condition", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.OR2([{
                        ALT: () => {
                            $.SUBRULE($.predicate);
                        }
                    }, {
                        NAME: "$empty",
                        ALT: chevrotain.EMPTY_ALT()
                    }, ]);
                    $.OPTION2(() => {
                        $.CONSUME(ID);
                    });
                    $.CONSUME(RCurlyBracket);
                }
            }, {
                ALT: () => {
                    $.SUBRULE2($.predicate);
                }
            }])
        });

        $.RULE("expression", () => {
            $.CONSUME(LRoundBracket);
            $.OPTION(() => {
                $.SUBRULE($.atomic);
            });
            $.CONSUME(RRoundBracket);
        });


        $.RULE("predicate", () => {
            $.CONSUME(LAngleBracket);
            $.OPTION(() => {
                $.SUBRULE($.atomic);
            });
            $.CONSUME(RAngleBracket);
        });


        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        Parser.performSelfAnalysis(this);
    }

    LNParser.prototype = Object.create(Parser.prototype);
    LNParser.prototype.constructor = LNParser;

    // wrapping it all together
    // reuse the same parser instance.
    const lnparser = new LNParser([]);

    // ----------------- Interpreter -----------------
    const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();
    class LNVisitor extends BaseCstVisitor {

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

    // for the playground to work the returned object must contain these fields
    return {
        lexer: LNLexer,
        parser: LNParser,
        visitor: LNVisitor,
        defaultRule: "code"
    };
}())