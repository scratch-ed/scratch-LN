/**
 * scratch-ln generators.
 *
 * Generator, using the blockly generator stuff to transform blocks -> text
 *
 * @file   This files defines the blockspecifications const.
 * @author Ellen Vanhove.
 */
import ScratchBlocks from 'scratch-blocks';
import {blockspecifications} from "../blockspecification/blockspecification";


export default function generateText(workspace) {
    let u = ScratchBlocks.text.workspaceToCode(workspace);
    console.log('_____________');
    console.log(u);
    console.log('_____________');
    return u
}

// scratch LN
//====================================================== 
//generator
//======================================================

ScratchBlocks.text = new ScratchBlocks.Generator('text');


//some basis function that are necessary but do not do anything here
ScratchBlocks.text.init = function (workspace) {
    //nope
};

ScratchBlocks.text.scrub_ = function (block, code) {
    return code
};

ScratchBlocks.text.finish = function (code) {
    return code
};

/**
 * Based on something from blockly, see python generator example.
 * @param block
 * @returns {string|Array}
 */
ScratchBlocks.text.getNextCode = function (block) {
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = ScratchBlocks.text.blockToCode(nextBlock); //returns '' if not existing
    return nextCode
};

/**
 * arguments list where the first one is not an array -> args are replaced in order of occurrence
 * or one array -> content of this array is used to replace
 * @returns {string}
 */
String.prototype.format = function () {
    let args = arguments;
    if (Array.isArray(args[0])) { //if an array is passed as argument
        args = args[0];
    }
    return this.replace(/%(\d+)/g, function (_, m) {
        return args[--m];
    });
};

//====examples
ScratchBlocks.text['event_whenflagclicked'] = function (block) {
    return 'when greenflag clicked;\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['pen_penup'] = function (block) {
    return 'pen up;\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['motion_movesteps'] = function (block) {
    let value_name = ScratchBlocks.text.valueToCode(block, 'STEPS', ScratchBlocks.text.ORDER_NONE);
    return 'move %1 steps;\n'.format('{' + value_name + '}') + ScratchBlocks.text.getNextCode(block);
};
//====examples

//=========== arguments =================
ScratchBlocks.text['math_number'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_integer'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_positive_number'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_whole_number'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['colour_picker'] = function (block) {
    return [block.getFieldValue('COLOUR'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_angle'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['text'] = function (block) {
    return [block.getFieldValue('TEXT'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['data_variable'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['(' + block.getField('VARIABLE').getText() + ')', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};


ScratchBlocks.text['data_listcontents'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['(' + block.getField('LIST').getText() + '::list)', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};
//========================================

//========= special cases  ===============
ScratchBlocks.text['event_broadcast_menu'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return [block.getField('BROADCAST_OPTION').getText(), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};
//========================================

//========= controls =====================

ScratchBlocks.text['control_forever'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK'); //todo: this automaticly intendents, is this a problem?
    return 'forever\n' + statements;

};

ScratchBlocks.text['control_repeat'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK'); //todo: this automaticly intendents, is this a problem?
    let nr = ScratchBlocks.text.valueToCode(block, 'TIMES', ScratchBlocks.text.ORDER_NONE);
    return 'repeat {' + nr + '}\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_repeat_until'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK'); //todo: this automaticly intendents, is this a problem?
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    return 'repeat until ' + nr + '\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_if'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK'); //todo: this automaticly intendents, is this a problem?
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    return 'if ' + nr + '\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_if_else'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK'); //todo: this automaticly intendents, is this a problem?
    let statements2 = ScratchBlocks.text.statementToCode(block, 'SUBSTACK2'); //todo: this automaticly intendents, is this a problem?
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    return 'if ' + nr + '\n' + statements + 'else\n' + statements2 + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

//========================================

//======= custom blocks ==================
ScratchBlocks.text['procedures_call'] = function (block) {
    let procCode = block.getProcCode();
    //todo
    return procCode;
};

//========================================

/**
 * init the generator with information from blockspecifications
 *
 */
export function init_generator() {
    //generate the functions
    for (let x = 0; x < blockspecifications.length; x++) {
        let b = blockspecifications[x];
        let template;
        if (Array.isArray(b['template'])) {
            template = b['template'][0];
        } else {
            template = b['template'];
        }
        let type = b['description']['type'];
        let args = b['description']['args'];
        let shape = b['description']['shape'];
        //add function to text
        ScratchBlocks.text[type] = function (block) {
            let values = [];
            for (let i = 0; args && i < args.length; i++) {
                let v;
                switch (args[i].type) {
                    case "field_dropdown":
                        v = block.getFieldValue(args[i].name);
                        v = '[' + v + ']';
                        break;
                    default:
                        v = ScratchBlocks.text.valueToCode(block, args[i].name, ScratchBlocks.text.ORDER_NONE); //returns undefined if empty
                        if (!args[i].menu) {
                            v = '{' + v + '}'; //results is {} if empty
                        }
                }
                values.push(v);
            }


            switch (shape) { // ({}+{({}+{})})
                case 'reporterblock':
                    return ['(' + template.format(values) + ')' + ScratchBlocks.text.getNextCode(block), ScratchBlocks.text.ORDER_NONE];
                case 'booleanblock':
                    return ['<' + template.format(values) + '>' + ScratchBlocks.text.getNextCode(block), ScratchBlocks.text.ORDER_NONE];
                default:
                    return template.format(values) + '\n' + ScratchBlocks.text.getNextCode(block);
            }

        };

        for (let i = 0; args && i < args.length; i++) {
            if (args[i].menu) {
                ScratchBlocks.text[args[i].menu] = function (block) {
                    return ['['+block.getFieldValue(args[i].name)+']', ScratchBlocks.text.ORDER_NONE];
                };
            }
        }
    }
}

init_generator();