/**
 * XML visitor.
 *
 * Visit a cst and creates an XML.
 *
 * @file   This files defines the XMLVisitor class.
 * @author Ellen Vanhove.
 */
import {tokenMatcher} from 'chevrotain'
import builder from 'xmlbuilder';
import blocks from './blocks';
import {lnparser} from "./LNParser";
const lntokens = require("./LNLexer");
let NumberLiteral = lntokens.NumberLiteral;
let ColorLiteral = lntokens.ColorLiteral;
import {InformationVisitor} from './InfoVisitor';

//const BaseCstVisitor = parser.getBaseCstVisitorConstructor();
const BaseCstVisitorWithDefaults = lnparser.getBaseCstVisitorConstructorWithDefaults();

export class XMLVisitor extends BaseCstVisitorWithDefaults {

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
            console.log('no first block');
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
                if (!this.firstBlock) {
                    this.firstBlock = this.xml;
                }
                this.blockCounter++;
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
