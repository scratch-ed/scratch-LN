(function myGrammar() {
    "use strict";

    const createToken = chevrotain.createToken;
    const tokenMatcher = chevrotain.tokenMatcher;
    const Lexer = chevrotain.Lexer;
    const Parser = chevrotain.Parser;

    var Label = createToken({
        name: "Label",
        pattern: 
        //not [] {} () " :: ; \n # unless escaped
        // : followed by not : or in the end
       /(([^\{\(\)\}\<\>\[\]:;\\"\n#]:[^\{\(\)\}\<\>\[\]:;\\"\n#])|[^\{\(\)\}\<\>\[\]:;\\"\n#]|\\[\{\(\)\}\<\>\[\]:;\\"\n#])+(:\b)?/,
        line_breaks: true
    });
    const LCurly = createToken({
        name: "LCurly",
        pattern: /{/
    });
    const RCurly = createToken({
        name: "RCurly",
        pattern: /}/
    });

    const LPar = createToken({
        name: "LPar",
        pattern: /\(/
    });
    const RPar = createToken({
        name: "RPar",
        pattern: /\)/
    });

    var GreaterThan = createToken({
        name: "GreaterThan",
        pattern: />/
    });
    var LessThan = createToken({
        name: "LessThan",
        pattern: /</
    });
    var LSquareBracket = createToken({
        name: "LSquareBracket",
        pattern: /\[/
    });
    var RSquareBracket = createToken({
        name: "RSquareBracket",
        pattern: /\]/
    });
    var DoubleColon = createToken({
        name: "DoubleColon",
        pattern: /::/
    });
    const Arg = createToken({
        name: "Arg",
        pattern: Lexer.NA
    });
    const TextArg = createToken({
        name: "TextArg",
        pattern: /"[^"]*"/,
        categories: Arg
    });
    const NumberArg = createToken({
        name: "NumberArg",
        pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
        categories: [Arg, Label]
    });
    const ColorArg = createToken({
        name: "ColorArg",
        pattern: /#[0-9a-z]{6}/,
        categories: [Arg]
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
        pattern: / +/,
        group: Lexer.SKIPPED,
        line_breaks: false
    });

    let LineEnd = createToken({
        name: "LineEnd",
        pattern: /;\n|;|\n/,
        line_breaks: true
    })

    const allTokens = [ 
        DoubleColon,
        WhiteSpace,
        Arg, TextArg, NumberArg,ColorArg,
        Forever, End, Until, Repeat, If, Else,Then,
        LineEnd,
        Label,      
        LCurly, RCurly,
        LPar, RPar,
        GreaterThan, LessThan,
        LSquareBracket, RSquareBracket,
    ];
    const MyLexer = new Lexer(allTokens);


    // ----------------- parser -----------------
    // Note that this is a Pure grammar, it only describes the grammar
    // Not any actions (semantics) to perform during parsing.
    function MyParser(input) {
        Parser.call(this, input, allTokens, {
            outputCst: true,
        });

        const $ = this;

        $.RULE("multipleStacks", () => {
            $.AT_LEAST_ONE_SEP({
                SEP: LineEnd,
                DEF: () => {
                    $.SUBRULE($.stack);
                }
            });

        });

        /*$.RULE("scripts", () => {
          $.MANY1(function() {
                $.CONSUME1(LineEnd);
            })
            $.AT_LEAST_ONE2(function() {

                $.OR([{
                        ALT: function() {
                            $.SUBRULE($.multipleStacks);
                        }
                    },
                    {
                        ALT: function() {
                            return $.SUBRULE($.reporterblock);
                        }
                    }, {
                        ALT: function() {
                            return $.SUBRULE($.booleanblock);
                        }
                    }
                ]);

            })
            
              $.MANY2(function() {
                $.CONSUME2(LineEnd);
              })
            
        });*/

       $.RULE("end", () => {
            $.CONSUME(End);
            $.OPTION1(() => {
                $.CONSUME1(LineEnd);
            })
        });
      
        $.RULE("forever", () => {
            $.CONSUME(Forever);
            $.OPTION1(() => {
                    $.CONSUME1(LineEnd);
                })
            $.OPTION2(() => {
                $.SUBRULE1($.stack);
            })
            $.OPTION3(() => {
                $.SUBRULE1($.end);
            })
        });

        $.RULE("repeat", () => {
            $.CONSUME(Repeat);
            $.SUBRULE($.countableinput);
            $.OPTION1(() => {
                    $.CONSUME1(LineEnd);
                })
            $.OPTION2(() => {
                $.SUBRULE1($.stack);
            })
            $.OPTION3(() => {
                $.SUBRULE1($.end);
            })
            
        });

        $.RULE("repeatuntil", () => {
            $.CONSUME(Repeat);
            $.CONSUME(Until);
            $.SUBRULE($.booleanblock);
            $.OPTION1(() => {
                    $.CONSUME1(LineEnd);
                })
            $.OPTION2(() => {
                $.SUBRULE1($.stack);
            })
            $.OPTION3(() => {
                $.SUBRULE1($.end);
            })
        });

        $.RULE("ifelse", () => {
            $.CONSUME(If);
            $.SUBRULE($.booleanblock);
            $.OPTION1(() => {
            $.CONSUME(Then);
            })
            $.OPTION2(() => {
                    $.CONSUME1(LineEnd);
                })
            $.OPTION3(() => {
                $.SUBRULE1($.stack);
            })
            $.OPTION4(() => {
                $.SUBRULE1($.else);
            })
            $.OPTION5(() => {
                $.SUBRULE1($.end);
            })
        });
        $.RULE("else", () => {
                $.CONSUME(Else);
                $.OPTION1(() => {
                    $.CONSUME2(LineEnd);
                })
                $.OPTION2(() => {
                $.SUBRULE2($.stack);
                })
        });
        $.RULE("stack", () => {
            $.AT_LEAST_ONE(function() {
                $.SUBRULE($.stackline);
            });
        });

        $.RULE("stackline", () => {
            $.OR([{
                ALT: function() {
                    return $.SUBRULE($.block);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.forever);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.repeat);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.repeatuntil);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.ifelse);
                }
            }]);
        });

        $.RULE("block", () => {
            $.AT_LEAST_ONE(function() {
                $.OR2([{
                            ALT: function() {
                                return $.CONSUME1(Label);
                            }
                        }, {
                            ALT: function() {
                                return $.SUBRULE($.argument);
                            }
                        }]);

            });
            $.OPTION(() => {
              $.SUBRULE($.option)
             })
             $.OPTION2(() => {
                    $.CONSUME1(LineEnd);
             })
          
        });

        $.RULE("option", () => {
              $.CONSUME(DoubleColon);
              $.CONSUME(Label);
        });
      
        $.RULE("argument", function() {
            $.OR1([{
                ALT: function() {
                    $.CONSUME(LCurly);
                    $.OPTION(() => {
                        $.OR2([{
                            ALT: function() {
                                return $.SUBRULE($.primitive);
                            }
                        }, {
                            ALT: function() {
                                return $.SUBRULE($.reporterblock);
                            }
                        }, {
                            ALT: function() {
                                return $.SUBRULE($.booleanblock);
                            }
                        }]);
                    })
                    $.CONSUME(RCurly);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.menu);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE2($.reporterblock);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE2($.primitive);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE2($.booleanblock);
                }
            }])

        });

        $.RULE("countableinput", function() {

            $.OR([{
                ALT: function() {
                    return $.SUBRULE($.primitive);
                }
            }, {
                ALT: function() {
                    return $.SUBRULE($.reporterblock);
                }
            }]);


        });

        $.RULE("primitive", function() {
            $.CONSUME(Arg);
        });

        $.RULE("reporterblock", function() {
            $.CONSUME(LPar);
            $.OPTION(() => {
                $.SUBRULE($.block);
            })
            $.CONSUME(RPar);

        });

        $.RULE("menu", function() {
            $.CONSUME(LSquareBracket);
            $.OPTION(() => {
                $.CONSUME1(Label);
            })
            $.CONSUME(RSquareBracket);
        });

        $.RULE("booleanblock", function() {
            $.CONSUME(LessThan);
            $.OPTION(() => {
                $.SUBRULE($.block);
            })
            $.CONSUME(GreaterThan);

        });


        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        Parser.performSelfAnalysis(this);
    }

    MyParser.prototype = Object.create(Parser.prototype);
    MyParser.prototype.constructor = MyParser;


    // wrapping it all together
    // reuse the same parser instance.
    const parser = new MyParser([]);


    // ----------------- Interpreter -----------------
    const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

    class MyVisitor extends BaseCstVisitor {

        constructor() {
            super()
                // This helper will detect any missing or redundant methods on this visitor
            this.validateVisitor()
        }

        multipleStacks(ctx) {
            var s = []
            for (var i = 0; i < ctx.stack.length; i++) {
                s.push(this.visit(ctx.stack[i]))
            }
            return {
                'type': 'multiple stacks',
                'stacks': s
            }
        }

        scripts(ctx) {
            var s = []
            for (var i = 0; i < ctx.multipleStacks.length; i++) {
                s.push(this.visit(ctx.multipleStacks[i]))
            }
            for (var i = 0; i < ctx.reporterblock.length; i++) {
                s.push(this.visit(ctx.reporterblock[i]))
            }
            for (var i = 0; i < ctx.booleanblock.length; i++) {
                s.push(this.visit(ctx.booleanblock[i]))
            }
            return s
        }

        end(ctx){
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
            //return ctx
            if (ctx.else.length > 0) {
                return {
                    'action': 'ifelse',
                    'until': this.visit(ctx.booleanblock),
                    'stack_one': ctx.stack.length>0?this.visit(ctx.stack[0]):'',
                    'stack_two': this.visit(ctx.else)
                }
            } else {
                return {
                    'action': 'if',
                    'until': this.visit(ctx.booleanblock),
                    'stack_one': ctx.stack.length>0?this.visit(ctx.stack[0]):''
                }
            }
        }

        else(ctx){
            //return ctx;
            
            return ctx.stack.length>0?this.visit(ctx.stack[0]):''
        }
        stack(ctx) {
            var blocks = []
            for (var i = 0; i < ctx.stackline.length; i++) {
                blocks.push(this.visit(ctx.stackline[i]))
            }
            return blocks
        }

        stackline(ctx) {
            if (ctx.forever.length > 0) {
                return this.visit(ctx.forever)
            } else if (ctx.repeatuntil.length > 0) {
                return this.visit(ctx.repeatuntil)
            } else if (ctx.repeat.length > 0) {
                return this.visit(ctx.repeat)
            } else if (ctx.block.length > 0) {
                return this.visit(ctx.block)
            } else if (ctx.ifelse.length > 0) {
                return this.visit(ctx.ifelse)
            }
            return ctx
        }

        block(ctx) {
            var text = ''
            var a = 0;
            for (var i = 0; i < ctx.Label.length; i++) {
              if(a<ctx.argument.length){
                while(this.getOffsetArgument(ctx.argument[a])<ctx.Label[i].startOffset & a<ctx.argument.length){
                text += '{}'//this.getOffsetArgument(ctx.argument[a]) 
                  a++;
                }
              }
                
                text += ctx.Label[i].image
            }
            for(a; a<ctx.argument.length;a++){
              text += '{}'// this.getOffsetArgument(ctx.argument[a]) 
            }
              
          
            var args = []
            for (var i = 0; i < ctx.argument.length; i++) {
                args.push(this.visit(ctx.argument[i]))
            }
            return {
                'text': text,
                'argumenten': args,
                'option': this.visit(ctx.option),
                'ctx':ctx
            }
        }
       
        getOffsetArgument(arg){
          if(!arg){
            return 100
          }
          if(arg.children.menu.length > 0 ){
            return arg.children.menu[0].children.LSquareBracket[0].startOffset
          }else if(arg.children.LCurly.length > 0 ){
            return arg.children.LCurly[0].startOffset
          }else if(arg.children.reporterblock.length > 0 ){
            return arg.children.reporterblock[0].children.LPar[0].startOffset
          }else if(arg.children.booleanblock.length > 0 ){
            return arg.children.booleanblock[0].children.LessThan[0].startOffset
          }
            
            return 10;
        }
      
        option(ctx){
          return ctx.Label[0].image
        }

        argument(ctx) {
            if (ctx.primitive.length > 0) {
                return this.visit(ctx.primitive)
            } else if (ctx.reporterblock.length > 0) {
                return this.visit(ctx.reporterblock)
            } else if (ctx.booleanblock.length > 0) {
                return this.visit(ctx.booleanblock)
            } else if (ctx.menu.length > 0) {
                return this.visit(ctx.menu)
            } else {
                //empty 
                return 'NulL'
            }
        }

        primitive(ctx) {
            if (tokenMatcher(ctx.Arg[0], NumberArg)) {
                return {
                    'value': ctx.Arg[0].image,
                    'type': 'Number'
                }
            } else if (tokenMatcher(ctx.Arg[0], ColorArg)) {
                return {
                    'value': ctx.Arg[0].image,
                    'type': 'Color'
                }
            } else {
                return {
                    'value': ctx.Arg[0].image,
                    'type': 'Text'
                }
            }

        }


        countableinput(ctx) {
            if (ctx.primitive.length > 0) {
                return this.visit(ctx.primitive)
            } else if (ctx.reporterblock.length > 0) {
                return this.visit(ctx.reporterblock)
            } else {
                //empty 
                return 'NulL'
            }
        }
        menu(ctx) {
            return {
                'type': 'menu',
                'value': ctx.Label[0].image
            };
        }

        reporterblock(ctx) {
            return this.visit(ctx.block);
        }

        booleanblock(ctx) {
            return this.visit(ctx.block);;
        }


    }

    // for the playground to work the returned object must contain these fields
    return {
        lexer: MyLexer,
        parser: MyParser,
        visitor: MyVisitor,
        defaultRule: "multipleStacks"
    };
}())