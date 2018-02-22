(function myGrammar() {
    "use strict";

    const createToken = chevrotain.createToken;
    const tokenMatcher = chevrotain.tokenMatcher;
    const Lexer = chevrotain.Lexer;
    const Parser = chevrotain.Parser;


    const Label = createToken({
        name: "Label",
        pattern:
        //not [] {} () " :: ; \n # unless escaped
        // : followed by not : or in the end
        //    /(:?[^\{\(\)\}\<\>\[\]:;\\"\n#]|\\[\{\(\)\}\<\>\[\]:;\\"\n#])+:?/,
            /(:?[^\{\(\)\}\<\>\[\]:;\\"\n#]|\\[\{\(\)\}\<\>\[\]:;\\"\n#])+/,
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

    const Literal = createToken({
        name: "Literal",
        pattern: Lexer.NA
    });

    const StringLiteral = createToken({
        name: "StringLiteral",
        pattern: /"[^"]*"/,
        categories: Literal
    });

    const NumberLiteral = createToken({
        name: "NumberLiteral",
        pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
        categories: [Literal, Label]
    });

    const ColorLiteral = createToken({
        name: "ColorLiteral",
        pattern: /#[0-9a-z]{6}/,
        categories: [Literal]
    });

    const Forever = createToken({
        name: "Forever",
        pattern: /forever/,
    });

    const End = createToken({
        name: "End",
        pattern: /end/,
    });

    const Then = createToken({
        name: "Then",
        pattern: /then/,
    });

    const Repeat = createToken({
        name: "Repeat",
        pattern: /repeat/,
    });

    const If = createToken({
        name: "If",
        pattern: /if/
    });

    const Else = createToken({
        name: "Else",
        pattern: /else/,
    });

    const Until = createToken({
        name: "Until",
        pattern: /until/,
        categories: Label //because this word occurs in 'until done', should not be a problem as it is never first
    });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
    const WhiteSpace = createToken({
        name: "WhiteSpace",
        pattern: /[ \t]+/,
        group: Lexer.SKIPPED,
        line_breaks: false
    });

    const StatementTerminator = createToken({
        name: "StatementTerminator",
        pattern: /;\n|;|\n/,
        line_breaks: true
    });

    const allTokens = [
        WhiteSpace,
        Literal, StringLiteral, NumberLiteral, ColorLiteral,
        Forever, End, Until, Repeat, If, Else, Then,
        StatementTerminator,
        Label,
        LCurlyBracket, RCurlyBracket,
        LRoundBracket, RRoundBracket,
        RAngleBracket, LAngleBracket,
        LSquareBracket, RSquareBracket,
        DoubleColon,
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

        $.RULE("scripts", () => {
            $.MANY(() => {
                $.CONSUME(StatementTerminator);
            });
            $.AT_LEAST_ONE(() => {
                $.OR([{
                    ALT: () => {
                        $.SUBRULE($.multipleStacks);
                    }
                }, {
                    ALT: () => {
                        $.SUBRULE($.reporterblock);
                    }
                }, {
                    ALT: () => {
                        $.SUBRULE($.booleanblock);
                    }
                }]);
            });
            $.MANY2(() => {
                $.CONSUME2(StatementTerminator);
            })

        });
        $.RULE("multipleStacks", () => {
            $.AT_LEAST_ONE_SEP({
                SEP: StatementTerminator,
                DEF: () => {
                    $.SUBRULE($.stack);
                }
            });
        });


        $.RULE("stack", () => {
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.stackline);
            });
        });

        $.RULE("stackline", () => {
            $.OR([{
                NAME: "$block",
                ALT: () => {
                    $.SUBRULE($.block);
                }
            }, {
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
            }, {
                NAME: "$ifelse",
                ALT: () => {
                    $.SUBRULE($.ifelse);
                }
            }]);
        });


        $.RULE("forever", () => {
            $.CONSUME(Forever);
            $.OPTION(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION3(() => {
                $.SUBRULE($.end);
            })
        });

        $.RULE("repeat", () => {
            $.CONSUME(Repeat);
            $.SUBRULE($.countableinput);
            $.OPTION(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION3(() => {
                $.SUBRULE($.end);
            })

        });

        $.RULE("repeatuntil", () => {
            $.CONSUME(Repeat);
            $.CONSUME(Until);
            $.SUBRULE($.booleanblock);
            $.OPTION(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION3(() => {
                $.SUBRULE($.end);
            })
        });

        $.RULE("ifelse", () => {
            $.CONSUME(If);
            $.SUBRULE($.booleanblock);
            $.OPTION(() => {
                $.CONSUME(Then);
            });
            $.OPTION2(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION3(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION4(() => {
                $.SUBRULE($.else);
            });
            $.OPTION5(() => {
                $.SUBRULE($.end);
            })
        });
        $.RULE("else", () => {
            $.CONSUME(Else);
            $.OPTION(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION2(() => {
                $.SUBRULE($.stack);
            })
        });

        $.RULE("end", () => {
            $.CONSUME(End);
            $.OPTION(() => {
                $.CONSUME(StatementTerminator);
            })
        });

        $.RULE("block", () => {
            $.AT_LEAST_ONE(() => {
                $.OR([{
                    ALT: () => {
                        $.CONSUME1(Label);
                    }
                }, {
                    ALT: () => {
                        $.SUBRULE($.argument);
                    }
                }]);

            });
            $.OPTION(() => {
                $.SUBRULE($.option)
            });
            $.OPTION2(() => {
                $.CONSUME(StatementTerminator);
            })

        });

        $.RULE("option", () => {
            $.CONSUME(DoubleColon);
            $.CONSUME(Label);
        });

        $.RULE("argument", () => {
            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.OPTION(() => {
                        $.OR2([{
                            ALT: () => {
                                $.SUBRULE($.primitive);
                            }
                        }, {
                            ALT: () => {
                                $.SUBRULE($.reporterblock);
                            }
                        }, {
                            ALT: () => {
                                $.SUBRULE($.booleanblock);
                            }
                        }]);
                    });
                    $.CONSUME(RCurlyBracket);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.choice);
                }
            }])

        });


        $.RULE("countableinput", () => {

            $.OR([{
                ALT: () => {
                    $.SUBRULE($.primitive);
                }
            }, {
                ALT: () => {
                    $.SUBRULE($.reporterblock);
                }
            }]);


        });

        $.RULE("primitive", () => {
            $.CONSUME(Literal);
        });

        $.RULE("reporterblock", () => {
            $.CONSUME(LRoundBracket);
            $.OPTION(() => {
                $.SUBRULE($.block);
            });
            $.CONSUME(RRoundBracket);

        });

        $.RULE("choice", () => {
            $.CONSUME(LSquareBracket);
            $.OPTION(() => {
                $.CONSUME(Label);
            });
            $.CONSUME(RSquareBracket);
        });

        $.RULE("booleanblock", () => {
            $.CONSUME(LAngleBracket);
            $.OPTION(() => {
                $.SUBRULE($.block);
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

    class InformationVisitor extends BaseCstVisitor {

        constructor() {
            super();
            // This helper will detect any missing or redundant methods on this visitor
            this.validateVisitor()
        }

        scripts(ctx) {
            let s = [];
            for (let i = 0; i < ctx.multipleStacks.length; i++) {
                s.push(this.visit(ctx.multipleStacks[i]))
            }
            for (let i = 0; i < ctx.reporterblock.length; i++) {
                s.push(this.visit(ctx.reporterblock[i]))
            }
            for (let i = 0; i < ctx.booleanblock.length; i++) {
                s.push(this.visit(ctx.booleanblock[i]))
            }
            return s
        }

        multipleStacks(ctx) {
            let s = [];
            for (let i = 0; i < ctx.stack.length; i++) {
                s.push(this.visit(ctx.stack[i]))
            }
            return {
                'type': 'multiple stacks',
                'stacks': s
            }
        }


        stack(ctx) {
            let blocks = [];
            for (let i = 0; i < ctx.stackline.length; i++) {
                blocks.push(this.visit(ctx.stackline[i]))
            }
            return blocks
        }

        stackline(ctx) {
            let v = ctx;
            if (ctx.$forever.length > 0) {
                v = this.visit(ctx.$forever)
            } else if (ctx.$repeatuntil.length > 0) {
                v = this.visit(ctx.$repeatuntil)
            } else if (ctx.$repeat.length > 0) {
                v = this.visit(ctx.$repeat)
            } else if (ctx.$block.length > 0) {
                v = this.visit(ctx.$block)
            } else if (ctx.$ifelse.length > 0) {
                v = this.visit(ctx.$ifelse)
            }
            return {
                'type': 'stackblock',
                'value': v
            }
        }

        stackline$forever(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.forever)
            }
        }

        stackline$repeat(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.repeat)
            }
        }

        stackline$repeatuntil(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.repeatuntil)
            }
        }

        stackline$ifelse(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.ifelse)
            }
        }

        stackline$block(ctx) {
            return {
                'type': 'stackblock',
                'value': this.visit(ctx.block)
            }
        }

        forever(ctx) {
            return {
                'action': 'forever',
                'stack': this.visit(ctx.stack)
            }
        }


        repeat(ctx) {
            return {
                'action': 'repeat',
                'amount': this.visit(ctx.countableinput),
                'stack': this.visit(ctx.stack)
            }
        }

        repeatuntil(ctx) {
            return {
                'action': 'repeat until',
                'until': this.visit(ctx.booleanblock),
                'stack': this.visit(ctx.stack)
            }
        }

        ifelse(ctx) {
            if (ctx.else.length > 0) {
                return {
                    'action': 'ifelse',
                    'until': this.visit(ctx.booleanblock),
                    'stack_one': ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : '',
                    'stack_two': this.visit(ctx.else)
                }
            } else {
                return {
                    'action': 'if',
                    'until': this.visit(ctx.booleanblock),
                    'stack_one': ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
                }
            }
        }

        else(ctx) {
            return ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
        }

        end(ctx) {
        }

        block(ctx) {
            let text = '';
            let a = 0;
            for (let i = 0; i < ctx.Label.length; i++) {
                if (a < ctx.argument.length) {
                    while (a < ctx.argument.length && this.getOffsetArgument(ctx.argument[a]) < ctx.Label[i].startOffset) {
                        text += '{}';//this.getOffsetArgument(ctx.argument[a])
                        a++;
                    }
                }

                text += ctx.Label[i].image
            }
            for (a; a < ctx.argument.length; a++) {
                text += '{}'
            }


            let args = [];
            for (let i = 0; i < ctx.argument.length; i++) {
                args.push(this.visit(ctx.argument[i]))
            }
            let ofs = 0;
            if (ctx.argument[0]) {
                ofs = this.getOffsetArgument(ctx.argument[0]) < ctx.Label[0].startOffset ? this.getOffsetArgument(ctx.argument[0]) : ctx.Label[0].startOffset
            } else {
                ofs = ctx.Label[0].startOffset
            }
            return {
                'text': text,
                'argumenten': args,
                'option': this.visit(ctx.option),
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

        option(ctx) {
            return {
                'text': ctx.Label[0].image,
                'type': 'option',
                'offset': ctx.DoubleColon[0].startOffset,
            }
        }

        argument(ctx) {
            if (ctx.primitive.length > 0) {
                return this.visit(ctx.primitive)
            } else if (ctx.reporterblock.length > 0) {
                return this.visit(ctx.reporterblock)
            } else if (ctx.booleanblock.length > 0) {
                return this.visit(ctx.booleanblock)
            } else if (ctx.choice.length > 0) {
                return this.visit(ctx.choice)
            } else {
                //empty
                return {
                    'value': '',
                    'type': 'empty',
                    'offset': ctx.LCurlyBracket[0].startOffset,
                }
            }
        }

        primitive(ctx) {
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
            if (ctx.primitive.length > 0) {
                return this.visit(ctx.primitive)
            } else if (ctx.reporterblock.length > 0) {
                return this.visit(ctx.reporterblock)
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

        reporterblock(ctx) {
            let b = this.visit(ctx.block);
            return {
                'type': 'reporterblock',
                'value': b,
                'offset': b.offset,
                'text': b.text
            };
        }

        booleanblock(ctx) {
            let b = this.visit(ctx.block);
            return {
                'type': 'booleanblock',
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
        visitor: InformationVisitor,
        defaultRule: "scripts"
    };
}())