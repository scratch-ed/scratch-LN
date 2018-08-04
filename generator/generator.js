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
import blocks from "../parser/blockConverterUtils";


export default function generateText(workspace) {
    let u = ScratchBlocks.text.workspaceToCode(workspace);
    return u
}

// scratch LN
//====================================================== 
//generator
//======================================================

ScratchBlocks.text = new ScratchBlocks.Generator('text');


//some basis function that are necessary but do not do anything here
ScratchBlocks.text.init = function (workspace) {
    //create a db of variables
    ScratchBlocks.text.variables = {};
    var variables = workspace.getAllVariables();
    for (var i = 0; i < variables.length; i++) {
        let v = variables[i];
        console.log(v);
        ScratchBlocks.text.variables[v.id_]=v.name;
    }
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

ScratchBlocks.text['motion_movesteps'] = function (block) {
    let value_name = ScratchBlocks.text.valueToCode(block, 'STEPS', ScratchBlocks.text.ORDER_NONE);
    return 'move %1 steps;\n'.format(value_name) + ScratchBlocks.text.getNextCode(block);
};
//====examples

function surroundWithCurlyBrackets(text) {
    return "{"+text+"}";
}

//=========== arguments =================
ScratchBlocks.text['math_number'] = function (block) {
    return [surroundWithCurlyBrackets(block.getFieldValue('NUM')), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_integer'] = function (block) {
    return [surroundWithCurlyBrackets(block.getFieldValue('NUM')), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_positive_number'] = function (block) {
    return [surroundWithCurlyBrackets(block.getFieldValue('NUM')), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_whole_number'] = function (block) {
    return [surroundWithCurlyBrackets(block.getFieldValue('NUM')), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['math_angle'] = function (block) {
    return [surroundWithCurlyBrackets(block.getFieldValue('NUM')), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['colour_picker'] = function (block) {
    return [block.getFieldValue('COLOUR'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['text'] = function (block) {
    return ['"'+block.getFieldValue('TEXT')+'"', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};


//========================================

//========= reporter and boolean variables  ===============
ScratchBlocks.text['data_variable'] = function (block) {
    let name = block.getField('VARIABLE').getText();
    if(name.toLowerCase() in blocks){
        name += " ::Variables";
    }
    //variables are a bit different... getfieldvalue returns the id
    return ['(' + name + ')', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['data_listcontents'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['(' + block.getField('LIST').getText() + ' ::list)', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['argument_reporter_boolean'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['<' + block.getField('VALUE').getText() + ' ::My Blocks>', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['argument_reporter_string_number'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['(' + block.getField('VALUE').getText() + ' ::My Blocks)', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};
//========================================

//========= special cases  ===============
ScratchBlocks.text['event_broadcast_menu'] = function (block) {
    //variables are a bit different... getfieldvalue returns the id
    return ['['+block.getField('BROADCAST_OPTION').getText()+']', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};
//========================================

//========= controls =====================

ScratchBlocks.text['control_forever'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK');
    return 'forever\n' + statements;

};

ScratchBlocks.text['control_repeat'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK');
    let nr = ScratchBlocks.text.valueToCode(block, 'TIMES', ScratchBlocks.text.ORDER_NONE);
    if(nr===""){
        nr = "{}";
    }
    return 'repeat ' + nr + '\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_repeat_until'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK');
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    if(nr===""){
        nr = "<>";
    }
    return 'repeat until ' + nr + '\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_if'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK');
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    if(nr===""){
        nr = "<>";
    }
    return 'if ' + nr + '\n' + statements + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['control_if_else'] = function (block) {
    let statements = ScratchBlocks.text.statementToCode(block, 'SUBSTACK');
    let statements2 = ScratchBlocks.text.statementToCode(block, 'SUBSTACK2');
    let nr = ScratchBlocks.text.valueToCode(block, 'CONDITION', ScratchBlocks.text.ORDER_NONE);
    if(nr===""){
        nr = "<>";
    }
    return 'if ' + nr + '\n' + statements + 'else\n' + statements2 + 'end\n' + ScratchBlocks.text.getNextCode(block);
};

//========================================

//======= custom blocks ==================
ScratchBlocks.text['procedures_call'] = function (block) {
    let procCode = block.getProcCode();
    //todo <> is not a child ..., so find a better way to handle this
    //console.log(block);
    let args=block.childBlocks_;
    let textargs = [];
    for(let i=0; i<args.length;i++){
        textargs.push(ScratchBlocks.text.blockToCode(args[i])[0]);
    }
    let ids=block.argumentIds_;
    //console.log(textargs,args,ids);
    if(changePlaceholder(procCode).toLowerCase() in blocks){
        procCode += " ::My Blocks";
    }
    return formatPlaceholder(procCode,textargs,ids) + '\n' + ScratchBlocks.text.getNextCode(block);
};

function changePlaceholder(text) {
    let argscounter=1;
    return text.replace(/%([snb])/g, function (x, m) {
        return '%'+argscounter++;
    });
}

function formatPlaceholder(text,args,ids) {
    let argscounter=0;
    let idcounter = 0;
    return text.replace(/%([snb])/g, function (x, m) {
        //console.log(args[argscounter],ids[idcounter]);
        //if(args[argscounter]==ids[idcounter]) {
            return args[argscounter++];

        /*    idcounter++;
        }else{
            return "<>"
        }*/
    });
};

ScratchBlocks.text['procedures_definition'] = function (block) {
    let prodecureblock=block.childBlocks_[0];
    let procCode = prodecureblock.getProcCode();
    let argumentsIds = prodecureblock.argumentIds_;
    return 'define '+replaceArgs(procCode,argumentsIds)+'\n' + ScratchBlocks.text.getNextCode(block);
};

function replaceArgs(text,args) {
    let c=0;
    return text.replace(/%([snb])/g, function (x, m) {
        if(m === 'b'){
            return '<'+args[c++]+'>';
        }else {
            return '('+args[c++]+')';
        }
    });
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
        let type = b['description']['opcode'];
        let args = b['description']['args'];
        let shape = b['description']['shape'];
        //make converter for all blocks
        ScratchBlocks.text[type] = function (block) {
            let values = [];
            for (let i = 0; args && i < args.length; i++) {
                let v;
                switch (args[i].type) {
                    case "field_variable":
                        v = block.getFieldValue(args[i].name);
                        console.log(args[i].name);
                        if(ScratchBlocks.text.variables[v]) {
                            v = ScratchBlocks.text.variables[v];
                        }
                        v = '[' + v + ']';
                        break;
                    case "field_dropdown":
                        v = block.getFieldValue(args[i].name);
                        for(let k=0; args[i].options && k<args[i].options.length;k++){ //value to text, sometimes there is something in capital letters.
                            let text = args[i].options[k][1];
                            if(text === v){
                                v = args[i].options[k][0];
                                break;
                            }
                        }
                        v = '[' + v + ']';
                        break;
                    default:
                        v = ScratchBlocks.text.valueToCode(block, args[i].name, ScratchBlocks.text.ORDER_NONE); //returns undefined if empty
                }
                if(args[i].check === "Boolean" && v === "") {
                    v = "<>";
                }else if(!v || v === "") {
                    v = "{}"; //this should not really happen only in cases the inputobject was not made
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

        //make converter for menus
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