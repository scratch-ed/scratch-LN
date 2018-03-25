/**
 * Parser: using class, seems not to work, HELP
 *
 * Define parser rules, see wiki
 *
 * @file   This files defines the LNParser class and parse function.
 * @author Ellen Vanhove.
 */
// Using ES6 style imports, this means Webpack 2 can perform tree shaking
import { Parser } from "chevrotain"

/*import {
    LNLexer,
    allTokens,
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
} from "./LNLexer" */

const lntokens = require("./LNLexer")

    let LNLexer = lntokens.LNLexer;
    let allTokens = lntokens.allTokens;
    let Literal = lntokens.Literal;
    let Forever = lntokens.Forever;
    let End = lntokens.End;
    let RepeatUntil = lntokens.RepeatUntil;
    let Repeat = lntokens.Repeat;
    let If = lntokens.If;
    let Else = lntokens.Else;
    let Then = lntokens.Then;
    let StatementTerminator = lntokens.StatementTerminator;
    let Identifier = lntokens.Identifier;
    let LCurlyBracket = lntokens.LCurlyBracket;
    let RCurlyBracket = lntokens.RCurlyBracket;
    let LRoundBracket = lntokens.LRoundBracket;
    let RRoundBracket = lntokens.RRoundBracket;
    let RAngleBracket = lntokens.RAngleBracket;
    let LAngleBracket = lntokens.LAngleBracket;
    let LSquareBracket = lntokens.LSquareBracket;
    let RSquareBracket = lntokens.RSquareBracket;
    let DoubleColon = lntokens.DoubleColon;
    let ID = lntokens.ID;

export default class LNParser extends Parser {
    constructor(input) {
        super(input, allTokens);

        const $ = this;

        $.RULE("multipleStacks", () => {
            $.MANY(() => {
                $.CONSUME(StatementTerminator);
            })
            $.SUBRULE($.stack);
            $.OPTION(() => {
                $.AT_LEAST_ONE({
                    DEF: () => {
                        $.CONSUME2(StatementTerminator);
                    }
                });

                $.MANY2({
                    //SEP: StatementTerminator,
                    DEF: () => {
                        $.SUBRULE2($.stack);
                        $.AT_LEAST_ONE2({
                            DEF: () => {
                                $.CONSUME3(StatementTerminator);
                            }
                        });

                    }
                });
                $.OPTION2(() => {
                    $.SUBRULE3($.stack);
                });
                $.MANY3(() => {
                    $.CONSUME4(StatementTerminator);
                })
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
                $.SUBRULE($.id)
            });
            $.OPTION2(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION3(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION4(() => {
                $.SUBRULE($.end);
            })
        });

        $.RULE("repeat", () => {
            $.CONSUME(Repeat);
            $.SUBRULE($.countableinput);
            $.OPTION(() => {
                $.SUBRULE($.id)
            });
            $.OPTION2(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION3(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION4(() => {
                $.SUBRULE($.end);
            })

        });

        $.RULE("repeatuntil", () => {
            $.CONSUME(RepeatUntil);
            $.SUBRULE($.booleanblock);
            $.OPTION(() => {
                $.SUBRULE($.id)
            });
            $.OPTION2(() => {
                $.CONSUME(StatementTerminator);
            });
            $.OPTION3(() => {
                $.SUBRULE($.stack);
            });
            $.OPTION4(() => {
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
                        $.CONSUME1(Identifier);
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
                $.SUBRULE($.id)
            });
            $.OPTION3(() => {
                $.CONSUME(StatementTerminator);
            })

        });

        $.RULE("option", () => {
            $.CONSUME(DoubleColon);
            $.CONSUME(Identifier);
        });
        $.RULE("id", () => {
            $.CONSUME(ID);
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
            }, {
                ALT: () => {
                    $.SUBRULE2($.reporterblock);
                }
            }, {
                ALT: () => {
                    $.SUBRULE2($.booleanblock);
                }
            }, {
                ALT: () => {
                    $.CONSUME(StringLiteral);
                }
            }, {
                ALT: () => {
                    $.CONSUME(ColorLiteral);
                }
            }])

        });


        $.RULE("countableinput", () => {

            $.OR([{
                ALT: () => {
                    $.CONSUME(LCurlyBracket);
                    $.SUBRULE($.primitive);
                    $.CONSUME(RCurlyBracket);
                }
            },  {
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
                $.CONSUME(Identifier);
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
}


// ----------------- wrapping it all together -----------------

//LNParser.prototype = Object.create(Parser.prototype);
//LNParser.prototype.constructor = LNParser;
// reuse the same parser instance.
export const lnparser = new LNParser([]);

export function parse(text) {
    console.log('seperate file, class');
    const lexResult = LNLexer.tokenize(text);
    // setting a new input will RESET the parser instance's state.
    lnparser.input = lexResult.tokens;
    // any top level rule may be used as an entry point
    const value = lnparser.multipleStacks(); //TOP RULE
    console.log(value);
    console.log(lexResult.errors);
    console.log(lnparser.errors);
    return {
        value: value,
        lexErrors: lexResult.errors,
        parseErrors: lnparser.errors
    }
}

