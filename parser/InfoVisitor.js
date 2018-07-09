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

    multipleStacks(ctx) {
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
        for (let i = 0; ctx.stackline && i < ctx.stackline.length; i++) {
            blocks.push(this.visit(ctx.stackline[i]))
        }
        return blocks
    }

    stackline(ctx) {
        let v = ctx;
        if (ctx.$forever && ctx.$forever.length > 0) {
            v = this.visit(ctx.$forever)
        } else if (ctx.$repeatuntil && ctx.$repeatuntil.length > 0) {
            v = this.visit(ctx.$repeatuntil)
        } else if (ctx.$repeat && ctx.$repeat.length > 0) {
            v = this.visit(ctx.$repeat)
        } else if (ctx.$block && ctx.$block.length > 0) {
            v = this.visit(ctx.$block)
        } else if (ctx.$ifelse && ctx.$ifelse.length > 0) {
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
            'until': this.visit(ctx.booleanblock),
            'stack': this.visit(ctx.stack),
            'id': this.visit(ctx.id),
        }
    }

    ifelse(ctx) {
        if (ctx.else && ctx.else.length > 0) {
            return {
                'action': 'ifelse',
                'until': this.visit(ctx.booleanblock),
                'stack_one': ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : '',
                'stack_two': this.visit(ctx.else)
            }
        } else {
            return {
                'action': 'if',
                'until': this.visit(ctx.booleanblock),
                'stack_one': ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
            }
        }
    }

    else(ctx) {
        return ctx.stack && ctx.stack.length > 0 ? this.visit(ctx.stack[0]) : ''
    }

    end(ctx) {
    }

    block(ctx) {
        let text = '';
        let a = 0;
        for (let i = 0; ctx.Identifier && i < ctx.Identifier.length; i++) {
            if (ctx.argument && a < ctx.argument.length) {
                while (a < ctx.argument.length && this.getOffsetArgument(ctx.argument[a]) < ctx.Identifier[i].startOffset) {
                    text += '{}';//this.getOffsetArgument(ctx.argument[a])
                    a++;
                }
            }

            text += ctx.Identifier[i].image
        }
        for (a; ctx.argument && a < ctx.argument.length; a++) {
            text += '{}'
        }


        let args = [];
        for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
            args.push(this.visit(ctx.argument[i]))
        }
        let ofs = 0;
        if(ctx.Identifier){
            if (ctx.argument && ctx.argument[0]) {
                ofs = this.getOffsetArgument(ctx.argument[0]) < ctx.Identifier[0].startOffset ? this.getOffsetArgument(ctx.argument[0]) : ctx.Identifier[0].startOffset
            } else {
                ofs = ctx.Identifier[0].startOffset
            }
        }else{
            ofs = this.getOffsetArgument(ctx.argument[0])
        }
        return {
            'text': text,
            'argumenten': args,
            'option': this.visit(ctx.option),
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

    option(ctx) {
        return {
            'text': ctx.Identifier[0].image,
            'type': 'option',
            'offset': ctx.DoubleColon[0].startOffset,
        }
    }
    //TODO
    id(ctx){
        return {
            'text': ctx.ID[0].image,
            'type': 'ID',
            'offset': ctx.startOffset,
        }
    }
    argument(ctx) {
        if (ctx.primitive && ctx.primitive.length > 0) {
            return this.visit(ctx.primitive)
        } else if (ctx.reporterblock && ctx.reporterblock.length > 0) {
            return this.visit(ctx.reporterblock)
        } else if (ctx.booleanblock && ctx.booleanblock.length > 0) {
            return this.visit(ctx.booleanblock)
        } else if (ctx.choice && ctx.choice.length > 0) {
            return this.visit(ctx.choice)
        } else if (ctx.LCurlyBracket){
            //empty
            return {
                'value': '',
                'type': 'empty',
                'offset': ctx.LCurlyBracket[0].startOffset,
                'text': '',
            }
        }else if(ctx.StringLiteral) { //if (tokenMatcher(ctx, StringLiteral))
            return {
                'value': ctx.StringLiteral[0].image,
                'type': 'StringLiteral',
                'offset': ctx.StringLiteral[0].startOffset,
                'text': ctx.StringLiteral[0].image.substring(1, ctx.StringLiteral[0].image.length-1)
            }
        }else if(ctx.ColorLiteral) { //if (tokenMatcher(ctx, StringLiteral))
            return {
                'value': ctx.ColorLiteral[0].image,
                'type': 'ColorLiteral',
                'offset': ctx.ColorLiteral[0].startOffset,
                'text':  ctx.ColorLiteral[0].image,
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
        if (ctx.primitive && ctx.primitive.length > 0) {
            return this.visit(ctx.primitive)
        } else if (ctx.reporterblock && ctx.reporterblock.length > 0) {
            return this.visit(ctx.reporterblock)
        }
    }

    choice(ctx) {
        return {
            'type': 'choice',
            'value': ctx.Identifier[0].image,
            'offset': ctx.LSquareBracket[0].startOffset,
            'text': ctx.Identifier[0].image,
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
        let b = '';
        if (ctx.block) {
            b = this.visit(ctx.block);
        }
        return {
            'type': 'booleanblock',
            'value': b,
            'offset': b.offset,
            'text': b.text
        };
    }


}
