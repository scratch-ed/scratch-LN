/**
 * Template for the visitor.
 *
 * This file consist of a template for the visitor .
 *
 * @file   This files defines the LNVisitor class.
 * @author Ellen Vanhove.
 */

//parser
import {tokenMatcher} from 'chevrotain'
import {lnparser} from "./LNParser"
import {InfoLNVisitor} from './infoLNVisitor';
//xml
import builder from 'xmlbuilder';
import {ARG, BasicIDManager, LIST} from "./IDManager";
import {State} from "./state";
import blocks from "./blockConverterUtils";
import {ModifierAnalyser} from "./modifierAnalyser";
import {WarningsKeeper} from "./warnings";
import {CATEGORY} from "./typeConfig";
//import {NumberLiteral, ColorLiteral} from "./LNLexer";
const lntokens = require("./LNLexer");
let NumberLiteral = lntokens.NumberLiteral;
let ColorLiteral = lntokens.ColorLiteral;
let StringLiteral = lntokens.StringLiteral;
let ChoiceLiteral = lntokens.ChoiceLiteral;

//const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();

/*
    No dispatching necessary if nothing special happens, specifically block and composite
    only for no return values
    docs: This base visitor includes a default implementation for all visit methods which simply invokes this.visit on all none terminals in the CSTNode's children.

*/
const BaseCstVisitorWithDefaults = lnparser.getBaseCstVisitorConstructorWithDefaults();

//variable types


//regexen
const DEFINE_REGEX = /^[ \t]*define/i;
const VARIABLE_REGEX = /^([ \t]*%[0-9][ \t]*)*$/i;
const UNKNOWN_REGEX = /%[0-9]/;


export class XMLLNVisitor extends BaseCstVisitorWithDefaults {

    constructor() {
        super();
        // This helper will detect any missing or redundant methods on this visitor
        this.validateVisitor();

        //-- xml --
        //the visitor stores an xml for what it is currently building, this is resetted by getXML
        //keeps where we are adding the next block
        this.xml = null;
        //xml root
        this.xmlRoot = null;
        //placeholder for the declaration of the variables
        this.variablesTag = null;

        //id generation
        this.idManager = new BasicIDManager();

        //information visitor
        this.infoVisitor = new InfoLNVisitor();

        //state: keeps track of which block we are building
        this.state = new State();

        //warnings
        this.warningsKeeper = new WarningsKeeper();

        //modifiers: extracts the modifiers from an node
        this.modifierAnalyser = new ModifierAnalyser(this.warningsKeeper);

        //defenition
        this.buildinBlocksConverters = blocks;
    }

    getXML(cst) {
        //reset
        this.idManager.reset();
        this.warningsKeeper.reset();
        this.state.reset();
        //create new xml
        this.xml = builder.begin().ele('xml').att('xmlns', 'http://www.w3.org/1999/xhtml');
        this.variablesTag = this.xml.ele('variables');
        this.xmlRoot = this.xml;
        this.visit(cst);
        this.createVariables();
        return {
            xml: this.xml.end({
                pretty: true
            }),
            warnings: this.warningsKeeper.getList(),
        }
    }


    createVariables() {
        this.xml = this.variablesTag;
        for (let key in this.idManager.varMap) {
            if (this.idManager.varMap.hasOwnProperty(key)) {
                if (this.idManager.varMap[key].variableType !== ARG) {
                    this.xml.ele('variable', {
                        'type': this.idManager.varMap[key].variableType,
                        'id': this.idManager.varMap[key].id,
                    }, key);
                }
            }
        }
    }

    /*code(ctx) {
       //todo: correct order of comments and stacks
    }*/

    /*delimiters(ctx) {
        //does nothing
    }

    stackDelimiter(ctx) {
        //does nothing
    }*/

    /*comments(ctx) {
        //no xml creation here
    }*/


    stack(ctx) {
        this.state.startStack();
        let prevxml = this.xml;
        let interupted=false;
        for (let i = 0; ctx.block && i < ctx.block.length; i++) {
            this.visit(ctx.block[i]); //opens a block
            //the flow was interrupted by a hat block or stand alone variable
            //so a new stack has to start
            if (this.state.isInterruptedStack()) {
                if(i<ctx.block.length-1) { //no warning if nothing follows
                    this.warningsKeeper.add(ctx.block[i], "started a new stack after cap");
                }
                this.state.startStack();
                interupted=true;
            } else { //normal flow
                this.xml = this.xml.ele('next');
            }
        }
        //if it was interrupted jump back to the root
        if(interupted){
            this.xml = this.xmlRoot;
            this.state.endStack();
        }else{ //normalflow
            this.xml = prevxml;
            this.state.endStack();
        }
    }

    /*block(ctx) {
        //nothing to do here
    }*/

    atomic(ctx) {
        let description = this.infoVisitor.getString(ctx, "atomic");
        let modifiers = this.modifierAnalyser.getMods(ctx,this.infoVisitor.getModifiers(ctx.annotations));
        console.log(modifiers);
        if (this.isBuildInBlock(description, ctx, modifiers)) {
            //generate block
            this.buildinBlocksConverters[description.toLowerCase()].converter(ctx, this, modifiers)
        } else if (description.match(DEFINE_REGEX)) {
            this.createDefineBlock(ctx, description);
        } else { //the block is not defined in scratch, so considered it as user-defined
            if (this.isMyBlockReporterblock(description,ctx, modifiers)) {
                this.createMyBlockReporterBlock(ctx, description);

            } else if (this.isListBlock(description,ctx, modifiers)) {
                this.createListBlock(ctx, description);

            } else if (this.isVariableBlock(description,ctx, modifiers)) {
                //if description contains %1 do a warning
                if(description.match(UNKNOWN_REGEX)){
                    this.warningsKeeper.add(ctx, "unkown reporter block, generated variable");
                }
                this.createVariableBlock(ctx, description);

            } else if (this.isBooleanBlock(description,ctx, modifiers)) {
                if(description.match(UNKNOWN_REGEX)){
                    this.warningsKeeper.add(ctx, "unkown boolean block, generated variable");
                }else if(modifiers.category !== CATEGORY.MYBLOCK ){
                    this.warningsKeeper.add(ctx, "unkown boolean block, add the correct modifier if you want this block");
                }

                this.createMyBlockBooleanBlock(ctx, description);

            } else {
                //if the label is empty this is a stand alone block so just visit the child
                if (description.match(VARIABLE_REGEX)) {
                    this.interruptStack(ctx,false);
                    for (let a = 0; a < ctx.argument.length; a++) {
                        this.visit(ctx.argument[a])
                    }
                } else {
                    //if this is a stack block
                    this.createProcedureBlock(ctx, description);
                }
            }
        }
        //will create the comment
        this.visit(ctx.annotations)
    }

    /**
     * intterupt a stack, can be done because of a hatblock, standalone variable, after a cap block
     * this wil set the state correctly and set the xml to the correct position to start building new blocks
     */
    interruptStack(ctx,isHat=false) {
        //check wether this is a really interupt, in case it is generate warning.
        if(this.state.hasPreviousConnectedBlocks() && isHat) {
            this.warningsKeeper.add(ctx,"hat block in a stack");
        }
        //notify the state
        this.state.interruptStack();
        //set xml to the root
        this.xml = this.xmlRoot;
    }

    /**
     * start the stack again after an interrupt
     */
    startStack(ctx) {
        this.state.startStack();
    }


    isBuildInBlock(description, ctx, modifiers) {
        let check = (modifiers.category !== CATEGORY.VARIABLES)
            && (modifiers.category !== CATEGORY.MYBLOCK)
            && description.toLowerCase() in this.buildinBlocksConverters;

        //it is defined as build in block.
        //is it used correctly?
        if(check){
            if(this.buildinBlocksConverters[description.toLowerCase()].modus.includes(this.state.getModus())){
                return true; //no problems
            }else{
                //the text matches a builtin block but the modus is not right
                //so a for example mouse down instead of <mouse down>
                this.warningsKeeper.add(ctx,"try to use a built-in block in the wrong context/modus");
                return false;
            }
        }
        return false;
    }


    isVariableBlock(description,ctx, modifiers) {
        return this.state.isBuildingReporterBlock();
    }

    isListBlock(description,ctx, modifiers) {
        return this.isVariableBlock(ctx, modifiers) && modifiers.list;
    }

    isMyBlockReporterblock(description, ctx, modifiers) {
        return this.isVariableBlock(ctx, modifiers) && modifiers.category === CATEGORY.MYBLOCK;
    }

    isBooleanBlock(description,ctx, modifiers) {
        return this.state.isBuildingBooleanBlock();
    }

    /**
     * add a procedure block to the xml
     * @param ctx
     * @param description can be obtain from the ctx but avoid multiple calls to getstring
     */
    createProcedureBlock(ctx, description) {
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        this.state.addBlock(blockid);
        this.xml = this.xml.ele('block', {
            'id': blockid,
        });
        this.xml.att('type', 'procedures_call');
        this.addMutation(ctx, description, blockid, true);
    }

    /**
     * adds a procedure definition to the xml
     * @param ctx
     * @param description
     */
    createDefineBlock(ctx, description) {
        //stop the previous stack
        this.interruptStack(ctx,true);
        description = description.replace(DEFINE_REGEX, '');
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        this.state.addBlock(blockid);
        this.xml = this.xml.ele('block', {
            'type': 'procedures_definition',
            'id': blockid,
        }).ele('statement', {
            'name': 'custom_block'
        }).ele('shadow', {
            'type': 'procedures_prototype'
        });
        this.addMutation(ctx, description, blockid, false);
        this.xml = this.xml.up().up();
        //start a new stack
        this.startStack();
    }


    /**
     * adds a mutation to the xml
     * @param ctx
     * @param description e.g. "some label %1 and %2 and %3"
     * @param blockid the id of the parent block
     * @param visitArgs boolean indicating whethter the arguments must visited or not
     */
    addMutation(ctx, description, blockid, visitArgs) {
        let args = [];
        let argumentnames = [];
        let argumentdefaults = [];
        let argumentids = [];
        let head = this.xml.ele('mutation');

        //this is a very weird construction but it works...
        //assign this to a variable so that it can be accessed by the function
        let thisVisitor = this;
        //replace %1 by %s or %b corresponding to the block
        let proccode = description.replace(/%[1-9]/g, function (m) {
            let index = m[1] - 1;
            return thisVisitor.infoVisitor.getPlaceholder(ctx.argument[index]);
        });

        for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
            //make names
            let name;
            if(!visitArgs) {
                name = this.infoVisitor.getString(ctx.argument[i]);
            }
            if (!name) {
                name = 'argumentname_' + blockid + '_' + i
            }
            argumentnames.push(name);
            argumentdefaults.push('');
            if (visitArgs) {
                //make xml
                this.xml = this.xml.ele('value', {
                    'name': argumentnames[argumentnames.length - 1]
                });
                let arg = this.visit(ctx.argument[i]);
                this.xml = this.xml.up();
                args.push(arg);
            }
            argumentids.push(this.idManager.acquireVariableID(argumentnames[argumentnames.length - 1], ARG));
        }
        if (argumentnames.length > 0) {
            head.att('proccode', proccode);
            if (!visitArgs) {
                head.att('argumentnames', '["' + argumentnames.join('","') + '"]');
            }
            head.att('warp', 'null');
            head.att('argumentids', '["' + argumentnames.join('","') + '"]');
            //head.att('argumentdefaults', "['" + argumentdefaults.join("','") + "']");
        } else {
            head.att('proccode', proccode);
        }
    }


    /*composite(ctx) {
        //nothing to do here
    }
    */

    ifelse(ctx) {
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "ifelse"));
        if (!ctx.Else) {
            this.xml = this.xml.ele('block', {
                'type': 'control_if',
                'id': blockid,
            });
        } else {
            this.xml = this.xml.ele('block', {
                'type': 'control_if_else',
                'id': blockid,
            });
        }
        this.state.addBlock(blockid);
        this.xml = this.xml.ele('value', {
            'name': 'CONDITION'
        });
        this.visit(ctx.condition);
        //Stack
        //go up from condition
        this.xml = this.xml.up().ele('statement ', {
            'name': 'SUBSTACK'
        });
        this.state.startStack();
        this.visit(ctx.ifClause);
        this.state.endStack();
        this.xml = this.xml.up();
        if (ctx.Else) {
                this.xml = this.xml.ele('statement ', {
                    'name': 'SUBSTACK2'
                });
                this.state.startStack();
                this.visit(ctx.elseClause);
                this.state.endStack();
                this.xml = this.xml.up();
        }
        this.visit(ctx.annotations);

    }

    forever(ctx) {
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "forever"));
        this.xml = this.xml.ele('block', {
            'type': 'control_forever',
            'id': blockid,
        }).ele('statement ', {
            'name': 'SUBSTACK'
        });
        this.state.addBlock(blockid);
        this.state.startStack();
        this.visit(ctx.clause);
        this.xml = this.xml.up(); //close statement (stack will close block)
        this.visit(ctx.annotations);
        this.interruptStack(ctx,false);
    }

    repeat(ctx) {
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "repeat"));
        this.xml = this.xml.ele('block', {
            'type': 'control_repeat',
            'id': blockid,
        }).ele('value', {
            'name': 'TIMES'
        });
        this.state.addBlock(blockid);
        this.visit(ctx.argument);

        this.xml = this.xml.up().ele('statement ', {
            'name': 'SUBSTACK'
        });
        this.state.startStack();
        this.visit(ctx.clause);
        this.state.endStack();
        this.xml = this.xml.up(); //go out of statement
        this.visit(ctx.annotations);
    }

    repeatuntil(ctx) {
        let blockid = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "repeatuntil"));
        this.xml = this.xml.ele('block', {
            'type': 'control_repeat_until',
            'id': blockid,
        }).ele('value', {
            'name': 'CONDITION'
        });
        this.state.addBlock(blockid);
        this.state.expectBoolean();
        this.visit(ctx.condition);
        this.xml = this.xml.up().ele('statement ', {
            'name': 'SUBSTACK'
        });
        this.state.startStack();
        this.visit(ctx.clause);
        this.state.endStack();
        this.xml = this.xml.up(); //go out of statement
        this.visit(ctx.annotations);
    }

    /*clause(ctx) {
        //it is not possible to add the statement, substack here because the name is different for the else clause
        //it's only one line 5 times deal with it.
        this.state.startStack();
        console.log(this.state.storage);
        this.visit(ctx.stack);
        this.state.endStack()
    }*/

    /*modifiers(ctx) {
        //will add nothing to the xml
    }*/

    /*annotations(ctx) {
       //no xml here
    }*/

    /*modifiers(ctx) {
        // no xml generation
    }*/

    /*id(ctx) {
        // no xml generation
    }*/

    comment(ctx) {
        let pinned = this.state.isBuildingStackBlock() || this.state.isBuildingBooleanBlock() || this.state.isBuildingReporterBlock()
        this.createComment(ctx, pinned)
    }

    /**
     * creates the xml for a comment
     * @param ctx
     * @param pinned (linked to a block)
     */
    createComment(ctx, pinned) {
        this.xml.ele('comment ', {
            'id': this.idManager.getNextCommentID(this.infoVisitor.getID(ctx, "comment")),
            'pinned': pinned,
            'minimized': false, //todo:should be known from modifier in the ctx
        }, this.infoVisitor.getString(ctx, "comment"));
    }

    argument(ctx) {

        if (ctx.Literal) {
            if(this.state.isExpectingBoolean()){
                this.warningsKeeper.add(ctx, "a boolean block is expected");
                return;
            }
            if (tokenMatcher(ctx.Literal[0], ColorLiteral)) {
                this.createColourPickerInput(ctx);
            } else {
                this.createTextInput(ctx);
                //todo: numberinputs + context -> createnumber
            }
        } else if (ctx.Label) {
            if(this.state.isExpectingBoolean()){
                this.warningsKeeper.add(ctx, "a boolean block is expected");
                return;
            }
            this.createTextInput(ctx);
        } else if (ctx.expression) {
            if(this.state.isExpectingBoolean()){
                this.warningsKeeper.add(ctx, "a boolean block is expected");
                return;
            }
            this.visit(ctx.expression);
        } else if (ctx.predicate) {
            this.visit(ctx.predicate)
        } else if (ctx.$empty) {
            if(this.state.isExpectingBoolean()){
                //do nothing
            }else {
                this.createTextInput(ctx);
            }
        }
    }

    createTextInput(ctx) {
        this.xml.ele('shadow', {
            'type': 'text',
            'id': this.idManager.getNextInputID(this.state.getLastBlockID(), this.infoVisitor.getID(ctx, "argument")),
        }).ele('field', {
            'name': 'TEXT',
        }, this.infoVisitor.getString(ctx, "argument"));
    }

    createColourPickerInput(ctx) {
        this.xml.ele('shadow', {
            'type': 'colour_picker',
            'id': this.idManager.getNextInputID(this.state.getLastBlockID(), this.infoVisitor.getID(ctx, "argument")),
        }).ele('field', {
            'name': 'COLOUR',
        }, this.infoVisitor.getString(ctx, "argument"));
    }

    createMathNumberInput(ctx) {
        this.xml.ele('shadow', {
            'type': 'math_number',
            'id': this.idManager.getNextInputID(this.state.getLastBlockID(), this.infoVisitor.getID(ctx, "argument")),
        }).ele('field', {
            'name': 'NUM',
        }, this.infoVisitor.getString(ctx, "argument"));
    }

    condition(ctx) {
        this.visit(ctx.predicate);
    }

    /*condition$empty(ctx) {
        //does nothing
    }*/

    expression(ctx) {
        let before = this.xml;
        this.state.openReporterBlock();
        this.visit(ctx.atomic);
        this.state.closeReporterBlock();
        this.xml = before;
    }

    predicate(ctx) {
        let before = this.xml;
        this.state.openBooleanBlock();
        this.visit(ctx.atomic);
        this.state.closeBooleanBlock();
        this.xml = before;
    }

    createVariableBlock(ctx, description) {
        let blockID = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        let varID = this.idManager.acquireVariableID(this.infoVisitor.getString(ctx, "atomic"));
        this.xml = this.xml.ele('block', {
            'type': 'data_variable',
            'id': blockID,
        }).ele('field', {
            'name': 'VARIABLE',
            'id': varID,
        }, description).up();
        this.state.addBlock(blockID);
    }

    createListBlock(ctx, description) {
        let blockID = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        let varID = this.idManager.acquireVariableID(this.infoVisitor.getString(ctx, "atomic"), LIST);
        this.xml = this.xml.ele('block', {
            'type': 'data_listcontents',
            'id': blockID,
        }).ele('field', {
            'name': 'LIST',
            'id': varID,
        }, description).up();
        this.state.addBlock(blockID);
    }

    createMyBlockReporterBlock(ctx, description) {
        let blockID = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        let varID = this.idManager.acquireVariableID(this.infoVisitor.getString(ctx, "atomic"));
        this.xml = this.xml.ele('block', {
            'type': 'argument_reporter_string_number',
            'id': blockID,
        }).ele('field', {
            'name': 'VALUE',
            'id': varID,
        }, description).up();
        this.state.addBlock(blockID);
    }

    createMyBlockBooleanBlock(ctx, description) {
        let blockID = this.idManager.getNextBlockID(this.infoVisitor.getID(ctx, "atomic"));
        let varID = this.idManager.acquireVariableID(this.infoVisitor.getString(ctx, "atomic"));
        this.xml = this.xml.ele('block', {
            'type': 'argument_reporter_boolean',
            'id': blockID,
        }).ele('field', {
            'name': 'VALUE',
            'id': varID,
        }, description).up();
        this.state.addBlock(blockID);
    }

}

