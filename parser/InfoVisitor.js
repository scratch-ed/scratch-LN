/**
 * info visitor.
 *
 * Visit a cst and generates a json structur to provide information about the visited element.
 *
 * @file   This files defines the InformationVisitor class.
 * @author Ellen Vanhove.
 */
import {tokenMatcher} from 'chevrotain'
//import {NumberLiteral, ColorLiteral} from "./LNLexer";
const lntokens = require("./LNLexer");
let NumberLiteral = lntokens.NumberLiteral;
let ColorLiteral = lntokens.ColorLiteral;
import {lnparser} from "./LNParser"

const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();

export class InformationVisitor extends BaseCstVisitor {

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
