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
//import {NumberLiteral, ColorLiteral} from "./LNLexer";
const lntokens = require("./LNLexer");
let NumberLiteral = lntokens.NumberLiteral;
let ColorLiteral = lntokens.ColorLiteral;
let StringLiteral = lntokens.StringLiteral;
let ChoiceLiteral = lntokens.ChoiceLiteral;
import {lnparser} from "./LNParser"
import {InfoLNVisitor, TEXT} from './InfoLNVisitor';

//xml
import builder from 'xmlbuilder';
import {BasicIDManager} from "./IDmanager";

//const BaseCstVisitor = lnparser.getBaseCstVisitorConstructor();

/*
    No dispatching necessary if nothing special happens, specifically block and composite
    only for no return values
    docs: This base visitor includes a default implementation for all visit methods which simply invokes this.visit on all none terminals in the CSTNode's children.

*/
const BaseCstVisitorWithDefaults = lnparser.getBaseCstVisitorConstructorWithDefaults();

//variable types
const ARG = 'arg';

export class XMLLNVisitor extends BaseCstVisitorWithDefaults {

    constructor() {
        super();
        // This helper will detect any missing or redundant methods on this visitor
        this.validateVisitor();

        //-- xml --
        //the visitor stores an xml, this is reinit every visit call.
        //the builder keeps where we are adding the next block
        this.xml = null;
        //xml root
        this.xmlRoot = null;
        //placeholder in the beginning for variables
        this.variablesTag = null;

        //id generation
        this.idManager = new BasicIDManager();

        //information visitor
        this.infoVisitor = new InfoLNVisitor();
    }

    getXML(cst) {
        //reset
        this.idManager.reset();
        //create new xml
        this.xml = builder.begin().ele('xml').att('xmlns', 'http://www.w3.org/1999/xhtml');
        this.variablesTag = this.xml.ele('variables');
        this.xmlRoot = this.xml;
        this.visit(cst);
        this.xml = this.variablesTag;
        for (let key in this.varMap) {
            if (this.varMap.hasOwnProperty(key)) {
                if (this.varMap[key].variableType != ARG) {
                    this.xml.ele('variable', {
                        'type': this.varMap[key].variableType,
                        'id': this.varMap[key].id,
                    }, key);
                }
            }
        }
        return this.xml.end({
            pretty: true
        });
    }





    /*code(ctx) {

    }*/

    comments(ctx) {

    }

    stack(ctx) {
        for (let i = 0; ctx.block && i < ctx.block.length; i++) {
            this.visit(ctx.block[i]);
            this.xml = this.xml.ele('next');
        }
        for (let i = 0; ctx.block && i < ctx.block.length; i++) {
            this.xml = this.xml.up().up(); //close the block and the next
        }
    }

    /*block(ctx) {

    }*/

    /*block$atomic(ctx) {

    }*/

    block$composite(ctx) {

    }

    atomic(ctx) {
        this.createProcedureBlock(ctx, this.getString(ctx, "atomic"));
    }

    /**
     * add a procedure block to the xml
     * @param ctx
     * @param description
     * todo:parent (link to the define block)
     */
    createProcedureBlock(ctx, description) {
        let blockid = this.getNextBlockID();
        this.xml = this.xml.ele('block', {
            'id': blockid,
        });
        this.xml.att('type', 'procedures_call');
        this.addMutation(ctx, description, blockid, true);

    }

    /**
     *
     * @param ctx
     * @param description e.g. "some label %1 and %2 and %3"
     * @param blockid the id of the parent block
     * @param visitArgs boolean indicating whethter the arguments must visited or not
     */
    addMutation(ctx, description, blockid, visitArgs) {
        console.log(ctx);
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
            return thisVisitor.getPlaceholder(ctx.argument[index])
        });


        for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
            //make names
            let name;// = this.getString(ctx.argument[i]);
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

            argumentids.push(this.getVariableID(argumentnames[argumentnames.length - 1], ARG)); //(blockid + '_arg_' + this.getNextId())

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

    /**
     * returns a string for the given ctx
     * @param ctx
     * @param rule explicitly declare the rule that needs to be used:
     *             this is necessary if this function is called with whole ctx and not with a child
     */
    getString(ctx, rule = null) {
        let x;
        if (!rule) {
            x = this.infoVisitor.visit(ctx);
        } else {
            x = this.infoVisitor[rule](ctx);
        }
        console.log(x.TEXT);
        return x.TEXT;
    }

    getPlaceholder(ctx) {
        let x = this.infoVisitor.visit(ctx);
        return x.PLACEHOLDER;
    }

    /*composite(ctx) {

    }*/

    composite$ifelse(ctx) {

    }

    composite$forever(ctx) {

    }

    composite$repeat(ctx) {

    }

    composite$repeatuntil(ctx) {

    }

    ifelse(ctx) {

    }

    forever(ctx) {

    }

    repeat(ctx) {

    }

    repeatuntil(ctx) {

    }

    clause(ctx) {

    }

    modifiers(ctx) {

    }

    annotations(ctx) {

    }

    argument(ctx) {
        if (ctx.Literal || (!ctx.predicate && !ctx.expression )) {
            this.createTextInput(ctx);
        } else{

        }
    }

    createTextInput(ctx) {
        this.xml.ele('shadow', {
            'type': 'text',
            'id': this.getNextInputID(),
        }).ele('field', {
            'name': 'TEXT',
        }, this.getString(ctx,"argument"));
    }

    createColourPickerInput(text) {
        this.xml.ele('shadow', {
            'type': 'colour_picker',
            'id': this.getNextInputID(),
        }).ele('field', {
            'name': 'COLOUR',
        }, text);
    }

    createMathNumberInput(text) {
        this.xml.ele('shadow', {
            'type': 'math_number',
            'id': this.getNextInputID(),
        }).ele('field', {
            'name': 'NUM',
        }, text);
    }

    condition(ctx) {

    }

    expression(ctx) {

    }

    predicate(ctx) {

    }

}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\