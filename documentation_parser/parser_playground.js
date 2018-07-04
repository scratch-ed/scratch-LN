(function myGrammar() {
    "use strict";

    const createToken = chevrotain.createToken;
    const tokenMatcher = chevrotain.tokenMatcher;
    const Lexer = chevrotain.Lexer;
    const Parser = chevrotain.Parser;


    const Label = createToken({
        name: "Label",
        pattern:
        //necessary to escape: [] {} () " ; \n # | @ \n
        //this cannot contain :: and should not partially match ::
        //--> :(?!:) : not followed by another :
        // --> x(?!y) = negative lookahead (matches 'x' when it's not followed by 'y')

        //atleast one character
        // - a : followed by a not :
        // - normal - not necessary to escape - characters
        // - \ followed by any character or a newline

        //no whitespace in the beginning or end -> will be skipped (OR allow whitespace with keywords?)


            /((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: ]|\\(.|\n))(( +((:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: ]|\\(.|\n)))|(:(?!:))|[^\{\|\(\)\}\<\>\[\];\\"\n#@: ]|\\(.|\n))*/,

        line_breaks: true
    });

    const LineComment  = createToken({
        name: "LineComment",
        pattern:/\/\/[^\n]*[\n]?/,
        group: Lexer.SKIPPED,
    });

    const BlockComment  = createToken({
        name: "BlockComment",
        pattern:/\/\*([^\*]|\*[^\/])*\*?\*\//,
        group: Lexer.SKIPPED,
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

    const RAngleBracket = createToken({
        name: "RAngleBracket",
        pattern: />/
    });

    const LAngleBracket = createToken({
        name: "LAngleBracket",
        pattern: /</
    });

    const LSquareBracket = createToken({
        name: "LSquareBracket",
        pattern: /\[/
    });

    const RSquareBracket = createToken({
        name: "RSquareBracket",
        pattern: /\]/
    });

    const DoubleColon = createToken({
        name: "DoubleColon",
        pattern: /::/
    });

    const Comment = createToken({
        name: "Comment",
        pattern: /(\|([^\|]|\\\|)*[^\\]\||\|\|)/
    });


    const ID = createToken({
        name: "ID",
        pattern: /@[a-z0-9_]+/i
    });

    const Literal = createToken({
        name: "Literal",
        pattern: Lexer.NA
    });

    const StringLiteral = createToken({
        name: "StringLiteral",
        pattern: /("([^"]|\\")*[^\\]"|"")/,
        categories: [Literal],
        longer_alt: Label,
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

    const Keyword = createToken({
        name: "Keyword",
        pattern: Lexer.NA
    });

    const Forever = createToken({
        name: "Forever",
        pattern: /forever/,
        longer_alt: Label,
        categories: [Keyword]
    });

    const End = createToken({
        name: "End",
        pattern: /end/,
        longer_alt: Label,
        categories: [Keyword]
    });

    const Then = createToken({
        name: "Then",
        pattern: /then/,
        longer_alt: Label,
        categories: [Keyword]
    });

    const Repeat = createToken({
        name: "Repeat",
        pattern: /repeat/,
        longer_alt: Label,
        categories: [Keyword]
    });
    const RepeatUntil = createToken({
        name: "RepeatUntil",
        pattern: /repeat[ \t]+until/,
        longer_alt: Label,
        categories: [Keyword]
    });

    const If = createToken({
        name: "If",
        pattern: /if/,
        longer_alt: Label,
        categories: [Keyword]
    });

    const Else = createToken({
        name: "Else",
        pattern: /else/,
        longer_alt: Label,
        categories: [Keyword]
    });


// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
    const WhiteSpace = createToken({
        name: "WhiteSpace",
        pattern: /[ \t]+/,
        group: Lexer.SKIPPED,
        line_breaks: false
    });

    const Delimiter = createToken({
        name: "Delimiter",
        pattern: /;[ \t]*\n|;|\n/,
        line_breaks: true
    });

    //order matters!
    const allTokens = [
        WhiteSpace,
        BlockComment, Comment,LineComment,  //match before anything else
        Literal, StringLiteral, NumberLiteral, ColorLiteral,
        Forever, End, Repeat, If, Else, Then, RepeatUntil,
        Delimiter,
        Label,
        LCurlyBracket, RCurlyBracket,
        LRoundBracket, RRoundBracket,
        RAngleBracket, LAngleBracket,
        LSquareBracket, RSquareBracket,
        DoubleColon, ID
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

            $.MANY({
                DEF: () => {
                    $.CONSUME(Delimiter);
                }
            });
            $.OPTION3(() => {
                $.SUBRULE($.comment);
            })
            $.OPTION(() => {

                $.SUBRULE($.stack);

                $.MANY2({
                    DEF: () => {
                        //$.CONSUME2(Delimiter);
                        $.AT_LEAST_ONE({
                            DEF: () => {

                                $.OR([{
                                    ALT: () => {
                                        $.CONSUME3(Delimiter);
                                    }
                                }, {
                                    ALT: () => {
                                        $.SUBRULE2($.comment);
                                    }
                                }]);
                            }
                        });
                        $.OPTION2(() => {
                            $.SUBRULE2($.stack);
                        })

                    }
                });

                //$.MANY3(() => {
                //   $.CONSUME4(Delimiter);
                //})
            })

            //$.CONSUME(chevrotain.EOF);
        });

        $.RULE("comment", () => {
            $.AT_LEAST_ONE(() => {
                $.CONSUME(Comment);
                $.MANY2(() => {
                    $.CONSUME2(Delimiter);
                })
            });

        })

        $.RULE("stack", () => {
            $.SUBRULE($.block);


            $.MANY(() => {
                $.CONSUME(Delimiter);
                $.SUBRULE2($.block);
            });

            $.OPTION(() => {
                $.CONSUME2(Delimiter);
            })
        });

        $.RULE("block", () => {
            $.OR([{
                NAME: "$atomic",
                ALT: () => {
                    $.SUBRULE($.atomic);
                }
            }, {
                NAME: "$composite",
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

            $.SUBRULE($.modifier);


            $.SUBRULE($.annotations);

        });

        $.RULE("annotations", () => {
            $.OPTION(() => {
                $.OR([{
                    ALT: () => {
                        $.CONSUME(Comment);
                        $.OPTION2(() => {
                            $.CONSUME(ID);
                        });

                    }
                }, {
                    ALT: () => {
                        $.CONSUME2(ID);
                        $.OPTION3(() => {
                            $.CONSUME2(Comment);
                        });
                    }
                }]);
            })
        })

        $.RULE("composite", () => {
            $.OR([{
                NAME: "$ifelse",
                ALT: () => {
                    $.SUBRULE($.ifelse);
                }
            },{
                NAME: "$forever",
                ALT: () => {
                    $.SUBRULE($.forever);
                }
            }, {
                NAME: "$repeat",
                ALT: () => {
                    $.SUBRULE($.repeat);
                }
            }, {
                NAME: "$repeatuntil",
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
            $.SUBRULE($.clause);
            $.OPTION3(() => {
                $.CONSUME(Else);
                $.SUBRULE3($.clause);
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

        $.RULE("condition", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.OPTION(() => {
                        $.SUBRULE($.predicate);

                    });
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
        })


        $.RULE("clause", () => {
            $.OPTION(() => {
                $.CONSUME(Delimiter);
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            });

            $.OPTION3(() => {
                //$.CONSUME2(Delimiter);
                $.CONSUME(End);
            })
        });

        $.RULE("modifier", () => {
            $.OPTION(() => {
                $.CONSUME(DoubleColon);
                $.CONSUME(Label);
            })
        });

        $.RULE("argument", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.OPTION(() => {
                        $.OR2([{
                            ALT: () => {
                                $.CONSUME(Literal);
                            }
                        }, {
                            ALT: () => {
                                $.SUBRULE($.expression);
                            }
                        }, {
                            ALT: () => {
                                $.SUBRULE($.predicate);
                            }
                        },{
                            ALT: () => {
                                $.SUBRULE($.choice);
                            }
                        }]);
                    });
                    $.OPTION2(() => {
                        $.CONSUME(ID);
                    });
                    $.CONSUME(RCurlyBracket);
                }
            }, {
                ALT: () => {
                    $.OR3([ {
                        ALT: () => {
                            $.CONSUME(StringLiteral);
                        }
                    },{
                        ALT: () => {
                            $.CONSUME(ColorLiteral);
                        }
                    },{
                        ALT: () => {
                            $.SUBRULE2($.expression);
                        }
                    }, {
                        ALT: () => {
                            $.SUBRULE2($.predicate);
                        }
                    },{
                        ALT: () => {
                            $.SUBRULE2($.choice);
                        }
                    }]);
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

        $.RULE("choice", () => {
            $.CONSUME(LSquareBracket);
            $.OPTION(() => {
                $.CONSUME(Label);
            });
            $.CONSUME(RSquareBracket);
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

    class InformationVisitor extends BaseCstVisitor {

        constructor() {
            super();
            // This helper will detect any missing or redundant methods on this visitor
            this.validateVisitor()
        }

        scripts(ctx) {
            let s = [];
            if (ctx.code) {
                for (let i = 0; i < ctx.code.length; i++) {
                    s.push(this.visit(ctx.code[i]))
                }
            }
            if (ctx.expression) {
                for (let i = 0; i < ctx.expression.length; i++) {
                    s.push(this.visit(ctx.expression[i]))
                }
            }
            if (ctx.predicate) {
                for (let i = 0; i < ctx.predicate.length; i++) {
                    s.push(this.visit(ctx.predicate[i]))
                }
            }
            return s
        }

        code(ctx) {
            let s = [];
            for (let i = 0; ctx.stack && i < ctx.stack.length; i++) {
                s.push(this.visit(ctx.stack[i]))
            }
            return {
                'type': 'multiple stacks',
                'stacks': s
            }
        }


        stack(ctx) {
            let blocks = [];
            for (let i = 0; ctx.block && i < ctx.block.length; i++) {
                blocks.push(this.visit(ctx.block[i]))
            }
            return blocks
        }

        block(ctx) {
            let v = ctx;
            if (ctx.$forever && ctx.$forever.length > 0) {
                v = this.visit(ctx.$forever)
            } else if (ctx.$repeatuntil && ctx.$repeatuntil.length > 0) {
                v = this.visit(ctx.$repeatuntil)
            } else if (ctx.$repeat && ctx.$repeat.length > 0) {
                v = this.visit(ctx.$repeat)
            } else if (ctx.$atomic && ctx.$atomic.length > 0) {
                v = this.visit(ctx.$atomic)
            } else if (ctx.$ifelse && ctx.$ifelse.length > 0) {
                v = this.visit(ctx.$ifelse)
            }
            return {
                'type': 'stackblock',
                'value': v
            }
        }

        block$forever(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.forever)
            }
        }

        block$repeat(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.repeat)
            }
        }

        block$repeatuntil(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.repeatuntil)
            }
        }

        block$ifelse(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.ifelse)
            }
        }

        block$atomic(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.atomic)
            }
        }

        forever(ctx) {
            return {
                'action': 'forever',
                'stack': this.visit(ctx.stack),
                'id': this.visit(ctx.id),
            }
        }


        repeat(ctx) {
            return {
                'action': 'repeat',
                'amount': this.visit(ctx.countableinput),
                'stack': this.visit(ctx.stack),
                'id': this.visit(ctx.id),
            }
        }

        repeatuntil(ctx) {
            return {
                'action': 'repeat until',
                'until': this.visit(ctx.predicate),
                'stack': this.visit(ctx.stack),
                'id': this.visit(ctx.id),
            }
        }

        ifelse(ctx) {
            if (ctx.else && ctx.else.length > 0) {
                return {
                    'action': 'ifelse',
                    'until': this.visit(ctx.predicate),
                    'stack_one': ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : '',
                    'stack_two': this.visit(ctx.else)
                }
            } else {
                return {
                    'action': 'if',
                    'until': this.visit(ctx.predicate),
                    'stack_one': ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
                }
            }
        }

        else(ctx) {
            return ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
        }

        end(ctx) {
        }

        atomic(ctx) {
            let text = '';
            let a = 0;
            for (let i = 0; ctx.Label && i < ctx.Label.length; i++) {
                if (ctx.argument && a < ctx.argument.length) {
                    while (a < ctx.argument.length && this.getOffsetArgument(ctx.argument[a]) < ctx.Label[i].startOffset) {
                        text += '{}';//this.getOffsetArgument(ctx.argument[a])
                        a++;
                    }
                }

                text += ctx.Label[i].image
            }
            for (a; ctx.argument && a < ctx.argument.length; a++) {
                text += '{}'
            }


            let args = [];
            for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
                args.push(this.visit(ctx.argument[i]))
            }
            let ofs = 0;
            if (ctx.Label) {
                if (ctx.argument && ctx.argument[0]) {
                    ofs = this.getOffsetArgument(ctx.argument[0]) < ctx.Label[0].startOffset ? this.getOffsetArgument(ctx.argument[0]) : ctx.Label[0].startOffset
                } else {
                    ofs = ctx.Label[0].startOffset
                }
            } else {
                ofs = this.getOffsetArgument(ctx.argument[0])
            }
            return {
                'text': text,
                'argumenten': args,
                'modifier': this.visit(ctx.modifier),
                'id': this.visit(ctx.id),
                'offset': ofs
            }
        }

        getOffsetArgument(arg) {
            if (!arg) {
                return Number.MAX_SAFE_INTEGER; //avoid infinite loop
            }
            let child = this.visit(arg);
            return child.offset
        }

        modifier(ctx) {
            return {
                'text': ctx.Label[0].image,
                'type': 'modifier',
                'offset': ctx.DoubleColon[0].startOffset,
            }
        }

        //TODO
        id(ctx) {
            return {
                'text': ctx.ID[0].image,
                'type': 'ID',
                'offset': ctx.startOffset,
            }
        }

        argument(ctx) {
            if (ctx.blabla && ctx.blabla.length > 0) {
                return this.visit(ctx.blabla)
            } else if (ctx.expression && ctx.expression.length > 0) {
                return this.visit(ctx.expression)
            } else if (ctx.predicate && ctx.predicate.length > 0) {
                return this.visit(ctx.predicate)
            } else if (ctx.choice && ctx.choice.length > 0) {
                return this.visit(ctx.choice)
            } else if (ctx.LCurlyBracket) {
                //empty
                return {
                    'value': '',
                    'type': 'empty',
                    'offset': ctx.LCurlyBracket[0].startOffset,
                }
            } else if (ctx.StringLiteral) { //if (tokenMatcher(ctx, StringLiteral))
                return {
                    'value': ctx.StringLiteral[0].image,
                    'type': 'StringLiteral',
                    'offset': ctx.StringLiteral[0].startOffset,
                }
            } else if (ctx.ColorLiteral) { //if (tokenMatcher(ctx, StringLiteral))
                return {
                    'value': ctx.ColorLiteral[0].image,
                    'type': 'ColorLiteral',
                    'offset': ctx.ColorLiteral[0].startOffset,
                }
            }
        }

        blabla(ctx) {
            if (tokenMatcher(ctx.Literal[0], NumberLiteral)) {
                return {
                    'value': ctx.Literal[0].image,
                    'type': 'number',
                    'offset': ctx.Literal[0].startOffset,
                };
            } else if (tokenMatcher(ctx.Literal[0], ColorLiteral)) {
                return {
                    'value': ctx.Literal[0].image,
                    'type': 'color',
                    'offset': ctx.Literal[0].startOffset,
                };
            } else {
                return {
                    'value': ctx.Literal[0].image,
                    'type': 'text',
                    'offset': ctx.Literal[0].startOffset,
                };
            }

        }


        countableinput(ctx) {
            if (ctx.blabla && ctx.blabla.length > 0) {
                return this.visit(ctx.blabla)
            } else if (ctx.expression && ctx.expression.length > 0) {
                return this.visit(ctx.expression)
            }
        }

        choice(ctx) {
            return {
                'type': 'choice',
                'value': ctx.Label[0].image,
                'offset': ctx.LSquareBracket[0].startOffset,
                'text': ctx.Label[0].image,
            };
        }

        expression(ctx) {
            let b = this.visit(ctx.atomic);
            return {
                'type': 'expression',
                'value': b,
                'offset': b.offset,
                'text': b.text
            };
        }

        predicate(ctx) {
            let b = '';
            if (ctx.atomic) {
                b = this.visit(ctx.atomic);
            }
            return {
                'type': 'predicate',
                'value': b,
                'offset': b.offset,
                'text': b.text
            };
        }


    }


    // for the playground to work the returned object must contain these fields
    return {
        lexer: LNLexer,
        parser: LNParser,
        //visitor: InformationVisitor,
        defaultRule: "code"
    };
}())