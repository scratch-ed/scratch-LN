/**
 * Parser
 *
 * Define parser rules
 *
 * @file   This files defines the LNParser class and parse function.
 * @author Ellen Vanhove.
 */
// Using ES6 style imports, this means Webpack 2 can perform tree shaking
import { Parser } from "chevrotain"

const lntokens = require("./LNLexer");

let LNLexer = lntokens.LNLexer;
let allTokens = lntokens.allTokens;

let Label = lntokens.Label;
let Delimiter = lntokens.Delimiter;

let Literal = lntokens.Literal;
let StringLiteral = lntokens.StringLiteral;
let ColorLiteral = lntokens.ColorLiteral;
let NumberLiteral = lntokens.NumberLiteral;
let ChoiceLiteral = lntokens.ChoiceLiteral;


let Forever = lntokens.Forever;
let End = lntokens.End;
let RepeatUntil = lntokens.RepeatUntil;
let Repeat = lntokens.Repeat;
let If = lntokens.If;
let Else = lntokens.Else;
let Then = lntokens.Then;

let LCurlyBracket = lntokens.LCurlyBracket;
let RCurlyBracket = lntokens.RCurlyBracket;
let LRoundBracket = lntokens.LRoundBracket;
let RRoundBracket = lntokens.RRoundBracket;
let RAngleBracket = lntokens.RAngleBracket;
let LAngleBracket = lntokens.LAngleBracket;

let Modifier = lntokens.Modifier;
let ID = lntokens.ID;

let Comment = lntokens.Comment;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

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
            $.SUBRULE($.comments);
        })
        $.OPTION(() => {
            $.SUBRULE($.stack);
            $.MANY2({
                DEF: () => {
                    $.AT_LEAST_ONE({
                        DEF: () => {
                            $.OR([{
                                ALT: () => {
                                    $.CONSUME3(Delimiter);
                                }
                            }, {
                                ALT: () => {
                                    $.SUBRULE2($.comments);
                                }
                            }]);
                        }
                    });
                    $.OPTION2(() => {
                        $.SUBRULE2($.stack);
                    })
                }
            });
        })
        //$.CONSUME(chevrotain.EOF);
    });

    $.RULE("comments", () => {
        $.AT_LEAST_ONE(() => {
            $.CONSUME(Comment);
            $.MANY(() => {
                $.CONSUME(Delimiter);
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
        $.SUBRULE($.modifiers);
        $.SUBRULE($.annotations);
    });

    $.RULE("composite", () => {
        $.OR([{
            NAME: "$ifelse",
            ALT: () => {
                $.SUBRULE($.ifelse);
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




    $.RULE("clause", () => {
        $.OPTION(() => {
            $.CONSUME(Delimiter);
        });
        $.OPTION2(() => {
            $.SUBRULE($.stack);
        });
        $.OPTION3(() => {
            $.CONSUME(End);
            $.OPTION4(() => {
                $.CONSUME2(Delimiter);
            });
        })
    });

    $.RULE("modifiers", () => {
        $.MANY(() => {
            $.CONSUME(Modifier);
        })
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
                    }]);
                });
                $.OPTION2(() => {
                    $.CONSUME(ID);
                });
                $.CONSUME(RCurlyBracket);
            }
        }, {
            ALT: () => {
                $.OR3([{
                    ALT: () => {
                        $.CONSUME(StringLiteral);
                    }
                }, {
                    ALT: () => {
                        $.CONSUME(ColorLiteral);
                    }
                }, {
                    ALT: () => {
                        $.CONSUME(ChoiceLiteral);
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





//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
LNParser.prototype = Object.create(Parser.prototype);
LNParser.prototype.constructor = LNParser;

// wrapping it all together
// reuse the same parser instance.
export const lnparser = new LNParser([]);

export function parse(text) {
    //console.log('seperate file, function');
    const lexResult = LNLexer.tokenize(text);
    // setting a new input will RESET the parser instance's state.
    lnparser.input = lexResult.tokens;
    // any top level rule may be used as an entry point
    const value = LNParser.code(); //TOP RULE
    /*console.log(value);
    console.log(lexResult.errors);
    console.log(LNParser.errors);*/
    return {
        value: value,
        lexErrors: lexResult.errors,
        parseErrors: LNParser.errors
    }
}

