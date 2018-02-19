import chevrotain from 'chevrotain'
import builder from 'xmlbuilder';
import blocks from './blocks'

export default function myGrammar() {
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
    const parser = new LNParser([]);


    // ----------------- Interpreter -----------------
    const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

    //======================================================================================
    // ----------------- information -----------------
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
            if (ctx.forever.length > 0) {
                v = this.visit(ctx.forever)
            } else if (ctx.repeatuntil.length > 0) {
                v = this.visit(ctx.repeatuntil)
            } else if (ctx.repeat.length > 0) {
                v = this.visit(ctx.repeat)
            } else if (ctx.block.length > 0) {
                v = this.visit(ctx.block)
            } else if (ctx.ifelse.length > 0) {
                v = this.visit(ctx.ifelse)
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
                }
            } else if (tokenMatcher(ctx.Literal[0], ColorLiteral)) {
                return {
                    'value': ctx.Literal[0].image,
                    'type': 'color',
                    'offset': ctx.Literal[0].startOffset,
                }
            } else {
                return {
                    'value': ctx.Literal[0].image,
                    'type': 'text',
                    'offset': ctx.Literal[0].startOffset,
                }
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


    //======================================================================================
    // ----------------- XML -----------------
    const BaseCstVisitorWithDefaults = parser.getBaseCstVisitorConstructorWithDefaults();

    class XMLVisitor extends BaseCstVisitorWithDefaults {

        constructor(coordinate = {
                        x: 0,
                        y: 1
                    },
                    increase = {
                        x: 75,
                        y: 100
                    }) {
            super();
            // This helper will detect any missing or redundant methods on this visitor
            this.validateVisitor();

            //the visitor stores an xml, this is reinit every visit call.
            //the builder keeps where we are adding the next block
            this.xml = null;
            //xml root
            this.xmlRoot = null;
            //first block in this xml
            this.firstBlock = null;

            //location of the blocks
            this.location = coordinate;
            this.increase = increase;

            //what kind of blocks should we build now? top, reporter, stack or boolean?
            //top = the first block in a stack, can be a stack or hat block
            //todo: cap block
            this.modus = 'root';
            this.scriptCounter = 0;
            this.blockCounter = 0;
            this.prevBlockCounter = 0;
            this.isTop = true;

            //id generation
            this.counter = 0;

            //variables
            this.varMap = new Object();
            this.varCounter = 0;

            //warnings
            this.warnings = [];

            //informationvistor
            this.infoVisitor = new InformationVisitor();

        }

        getNextId() {
            return this.counter++;
        }

        getVariableID(varName, variableType = '') {
            //if first time this variable is encoutered, create an ID for it
            if (!this.varMap[varName]) {
                this.varMap[varName] = {
                    'id': 'var' + this.varCounter++,
                    'variableType': variableType
                }
            }
            return this.varMap[varName].id;
        }


        addLocationBelow(xmlElement) {
            xmlElement.att('x', this.location.x);
            if (this.prevBlockCounter === 0) {
                xmlElement.att('y', this.location.y);
                this.prevBlockCounter = this.blockCounter;
            } else {
                xmlElement.att('y', this.location.y + this.increase.y * this.prevBlockCounter);
                this.prevBlockCounter = this.blockCounter;
            }
        }

        getXML(cst) {
            //reset
            this.modus = 'stackblock';
            this.xml = builder.begin().ele('xml').att('xmlns', 'http://www.w3.org/1999/xhtml');
            this.xmlRoot = this.xml;
            this.visit(cst);
            //insert variables
            if (this.firstBlock) {
                this.xml = this.firstBlock.insertBefore('variables');
            } else {
                this.xml = this.xmlRoot.ele('variables');
            }
            for (let key in this.varMap) {
                if (this.varMap.hasOwnProperty(key)) {
                    this.xml.ele('variable', {
                        'type': this.varMap[key].variableType,
                        'id': this.varMap[key].id,
                    }, key);
                }
            }
            return this.xml.end({
                pretty: true
            });

        }

        visitSubStack(stack) {
            let head = this.xml;
            this.visit(stack);
            this.xml = head;
        }

        scripts(ctx) {
            for (let i = 0; i < ctx.multipleStacks.length; i++) {
                this.visit(ctx.multipleStacks[i])
            }
            for (let i = 0; i < ctx.reporterblock.length; i++) {
                this.isTop = true;
                this.visit(ctx.reporterblock[i]);
                this.addLocationBelow(this.xml);
                this.scriptCounter++;
            }
            for (let i = 0; i < ctx.booleanblock.length; i++) {
                this.isTop = true;
                this.visit(ctx.booleanblock[i]);
                this.addLocationBelow(this.xml);
                this.scriptCounter++;
            }
        }

        multipleStacks(ctx) {
            for (let i = 0; i < ctx.stack.length; i++) {
                this.isTop = true;
                this.visit(ctx.stack[i]);
                this.addLocationBelow(this.xml);
                this.xml = this.xml.up();
                this.scriptCounter++;
            }
        }


        end(ctx) { /*will never be used*/
        }

        forever(ctx) {
            this.xml = this.xml.ele('block', {
                'type': 'control_forever',
                'id': this.getNextId(),
            }, ' ').ele('statement ', {
                'name': 'SUBSTACK'
            }, ' ');
            this.visitSubStack(ctx.stack);
            this.xml = this.xml.up()
        }


        repeat(ctx) {
            this.xml = this.xml.ele('block', {
                'type': 'control_repeat',
                'id': this.getNextId(),
            }).ele('value', {
                'name': 'TIMES'
            });
            this.visit(ctx.countableinput);
            this.xml = this.xml.up().ele('statement ', {
                'name': 'SUBSTACK'
            });
            this.visitSubStack(ctx.stack);
            this.xml = this.xml.up(); //go out of statement 
        }

        repeatuntil(ctx) {
            this.xml = this.xml.ele('block', {
                'type': 'control_repeat_until',
                'id': this.getNextId(),
            }).ele('value', {
                'name': 'CONDITION'
            });
            this.visit(ctx.booleanblock);
            this.xml = this.xml.up().ele('statement ', {
                'name': 'SUBSTACK'
            });
            this.visitSubStack(ctx.stack);
            this.xml = this.xml.up();
        }

        ifelse(ctx) {
            if (ctx.else.length === 0) {
                this.xml = this.xml.ele('block', {
                    'type': 'control_if',
                    'id': this.getNextId(),
                });
            } else {
                this.xml = this.xml.ele('block', {
                    'type': 'control_if_else',
                    'id': this.getNextId(),
                });
            }
            this.xml = this.xml.ele('value', {
                'name': 'CONDITION'
            });
            this.visit(ctx.booleanblock);
            //Stack
            //go up from condition
            this.xml = this.xml.up().ele('statement ', {
                'name': 'SUBSTACK'
            });
            this.visitSubStack(ctx.stack); //when no index is given it is always 0
            this.xml = this.xml.up();
            if (ctx.else.length !== 0) {
                this.visit(ctx.else);
            }
        }

        else(ctx) {
            this.xml = this.xml.ele('statement ', {
                'name': 'SUBSTACK2'
            });
            this.visitSubStack(ctx.stack[0]);
            this.xml = this.xml.up();
        }

        stack(ctx) {
            for (let i = 0; i < ctx.stackline.length; i++) {
                this.visit(ctx.stackline[i]);
                this.xml = this.xml.ele('next');
            }
            for (let i = 0; i < ctx.stackline.length - 1; i++) {
                this.xml = this.xml.up().up();
            }
            this.xml = this.xml.up(); //End with blocks open so that insertbefore works #hacky
        }

        //if using visitor with defaults, this can be removed
        //defaults do not work for return values...
        /*stackline(ctx,inArg) {
            if (ctx.$forever.length > 0) {
                this.visit(ctx.$forever)
            } else if (ctx.$repeatuntil.length > 0) {
                this.visit(ctx.$repeatuntil)
            } else if (ctx.$repeat.length > 0) {
                this.visit(ctx.$repeat)
            } else if (ctx.$block.length > 0) {
                this.visit(ctx.$block)
            } else if (ctx.$ifelse.length > 0) {
                this.visit(ctx.$ifelse)
            }
            /*if (!this.firstBlock) {
                this.firstBlock = this.xml
            }
            this.blockCounter++;
        }*/

        stackline$forever(ctx) {
            console.log('here');
            this.visit(ctx.forever);
            if (!this.firstBlock) {
                this.firstBlock = this.xml;
            }
            this.blockCounter++;
        }

        stackline$repeat(ctx) {
            this.visit(ctx.repeat);
            if (!this.firstBlock) {
                this.firstBlock = this.xml;
            }
            this.blockCounter++;
        }

        stackline$repeatuntil(ctx) {
            this.visit(ctx.repeatuntil);
            if (!this.firstBlock) {
                this.firstBlock = this.xml;
            }
            this.blockCounter++;
        }

        stackline$ifelse(ctx) {
            this.visit(ctx.ifelse);
            if (!this.firstBlock) {
                this.firstBlock = this.xml;
            }
            this.blockCounter++;
        }

        stackline$block(ctx) {
            this.visit(ctx.block);
            if (!this.firstBlock) {
                this.firstBlock = this.xml;
            }
            this.blockCounter++;
        }


        makeMatchString(ctx) {
            let matchString = '';
            let a = 0;
            for (let i = 0; i < ctx.Label.length; i++) {
                if (a < ctx.argument.length) {
                    while (a < ctx.argument.length && this.getOffsetArgument(ctx.argument[a]) < ctx.Label[i].startOffset) {
                        matchString += ' %' + (a + 1) + ' ';
                        ++a;
                    }
                }
                matchString += ' ' + ctx.Label[i].image + ' ';
            }
            for (a; a < ctx.argument.length; a++) {
                matchString += ' %' + (a + 1) + ' ';
            }
            return this.cleanupText(matchString)
        }

        generateStackBlock(ctx, matchString) {
            let blockid = this.getNextId();
            this.xml = this.xml.ele('block', {
                'id': blockid,
            });
            this.xml.att('type', 'procedures_call');
            this.addMutation(ctx, matchString, blockid, true);
        }

        addMutation(ctx, matchString, blockid, visitArgs) {
            let args = [];
            let argumentnames = [];
            let argumentdefaults = [];
            let argumentids = [];

            //this is a very weird construction but it works...
            //assign this to a variable so that it can be accesed by the function
            let thisVisitor = this;
            let proccode = matchString.replace(/%[1-9]/g, function (m) {
                let index = m[1] - 1;
                return thisVisitor.getPlaceholder(ctx.argument[index])
            });
            for (let i = 0; i < ctx.argument.length; i++) {
                //make names
                //hier was iets raar...
                let name = this.getString(ctx.argument[i])
                if (!name) {
                    name = 'argumentname_' + blockid + '_' + i
                }
                argumentnames.push(name); //('argumentname_' + blockid + '_' + i)
                argumentdefaults.push('');
                argumentids.push(this.getVariableID(argumentnames[argumentnames.length - 1], 'arg')); //(blockid + '_arg_' + this.getNextId())

                if (visitArgs) {
                    //make xml
                    this.xml = this.xml.ele('value', {
                        'name': argumentnames[argumentnames.length - 1]
                    });
                    let arg = this.visit(ctx.argument[i]);
                    this.xml = this.xml.up();
                    args.push(arg);
                }

            }
            if (argumentnames.length > 0) {
                this.xml.ele('mutation', {
                    'proccode': proccode,
                    'argumentnames': '["' + argumentnames.join('","') + '"]',
                    //'argumentdefaults': "['" + argumentdefaults.join("','") + "']",
                    'warp': 'false',
                    'argumentids': '["' + argumentids.join('","') + '"]'
                });
            } else {
                this.xml.ele('mutation', {
                    'proccode': proccode
                });
            }
        }

        cleanupText(text) {
            //remove double spaces to easier match, because life is already difficult enough <3.
            text = text.replace(/ +(?= )/g, '');
            //' ?' 
            text = text.replace(/ +(?=[\?])/g, '');
            //text = text.replace(/ +(?=[\%][^sbn])/g, '');
            //remove spaces at beginning and end
            text = text.trim();
            return text;
        }

        generateReporterBlock(ctx, matchString) {
            let varID = this.getVariableID(matchString);
            if (this.getString(ctx.option[0]) === 'list') {
                this.xml = this.xml.ele('block', {
                    'type': 'data_listcontents',
                    'id': this.getNextId(),
                }).ele('field', {
                    'name': 'LIST',
                    'id': varID,
                }, matchString).up(); //up field
            } else {
                this.xml = this.xml.ele('block', {
                    'type': 'data_variable',
                    'id': this.getNextId(),
                }).ele('field', {
                    'name': 'VARIABLE',
                    'id': varID,
                }, matchString).up(); //up field
            }
        }

        generateBooleanBlock(ctx, matchString) {
            this.xml = this.xml.ele('block', {
                'type': 'extension_wedo_boolean',
                'id': this.getNextId(),
            })
        }

        block(ctx) {
            let matchString = this.makeMatchString(ctx);
            //console.log(matchString)
            if (matchString.startsWith("define")) {
                matchString = matchString.replace(/define/, '');
                let blockid = this.getNextId();
                this.xml = this.xml.ele('block', {
                    'type': 'procedures_definition',
                    'id': blockid,
                }).ele('statement', {
                    'name': 'custom_block'
                }).ele('shadow', {
                    'type': 'procedures_prototype'
                });
                this.addMutation(ctx, matchString, blockid, false);
                this.xml = this.xml.up().up()
            } else if (matchString in blocks) {
                blocks[matchString](ctx, this);
                if (this.modus === 'reporterblock' || this.modus === 'booleanblock') {
                    if (this.isTop) {
                        this.addLocationBelow(this.xml)
                    }
                    this.xml = this.xml.up();
                }
            } else { //what should be done if the block is unknown
                switch (this.modus) {
                    case 'stackblock':
                        this.generateStackBlock(ctx, matchString);
                        break;
                    case 'reporterblock':
                        this.generateReporterBlock(ctx, matchString);
                        break;
                    case 'booleanblock':
                        this.generateBooleanBlock(ctx, matchString);
                        break;
                }
                if (this.modus === 'reporterblock' || this.modus === 'booleanblock') {
                    if (!this.firstBlock) {
                        this.firstBlock = this.xml
                    }

                    if (this.isTop) {
                        this.addLocationBelow(this.xml)
                    }

                    this.blockCounter++;

                    this.xml = this.xml.up();
                }
            }
            this.isTop = false
        }

        argument(ctx) { //return is necessary for menu..
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
            }
        }

        getString(ctx) {
            if (ctx) {
                let o = this.infoVisitor.visit(ctx)
                return o.text
            } else {
                return ''
            }
        }

        getPlaceholder(ctx) {
            if (!ctx || !ctx.children) {
                return '%s'
            }
            let type = this.getType(ctx)
            if (type === 'number') {
                return '%n'
            } else if (type === 'booleanblock') {
                return '%b'
            } else {
                return '%s'
            }
        }

        getType(ctx) {
            if (ctx) {
                let o = this.infoVisitor.visit(ctx);
                return o.type
            } else {
                return 'empty'
            }
        }

        getOffsetArgument(arg) {
            if (!arg) {
                console.log('This should not happen');
                return Number.MAX_SAFE_INTEGER; //avoid infinite loop
            }
            let child = this.infoVisitor.visit(arg)
            return child.offset
        }

        choice(ctx) {
            //todo: try to remove this because it is inconsistent that here is the only return...
            //console.log('nah')
            if (ctx.Label[0]) {
                return ctx.Label[0].image;
            } else {
                return ""
            }
        }

        option(ctx) {

        }

        primitive(ctx) {
            //todo: try to remove this because it is inconsistent that here is the only return...
            if (tokenMatcher(ctx.Literal[0], NumberLiteral)) {
                this.xml.ele('shadow', {
                    'type': 'math_number',
                    'id': this.getNextId(),
                }).ele('field', {
                    'name': 'NUM',
                }, ctx.Literal[0].image)
            } else if (tokenMatcher(ctx.Literal[0], ColorLiteral)) {
                this.xml.ele('shadow', {
                    'type': 'colour_picker',
                    'id': this.getNextId(),
                }).ele('field', {
                    'name': 'COLOUR',
                }, ctx.Literal[0].image)
            } else {
                this.xml.ele('shadow', {
                    'type': 'text',
                    'id': this.getNextId(),
                }).ele('field', {
                    'name': 'TEXT',
                }, ctx.Literal[0].image)

            }
            return ctx.Literal[0].image;
        }

        reporterblock(ctx) {
            let prevModus = this.modus;
            this.modus = 'reporterblock';
            this.visit(ctx.block);
            this.modus = prevModus;
        }

        booleanblock(ctx) {
            let prevModus = this.modus;
            this.modus = 'booleanblock';
            this.visit(ctx.block);
            this.modus = prevModus;
        }

        /*countableinput(ctx) {
            if (ctx.primitive.length > 0) {
                this.visit(ctx.primitive)
            } else if (ctx.reporterblock.length > 0) {
                this.visit(ctx.reporterblock)
            }
        }*/


    }

    // for the playground to work the returned object must contain these fields
    return {
        lexer: LNLexer,
        parser: parser,
        visitor: XMLVisitor
    };
}