import ScratchBlocks from 'scratch-blocks';
import {blockspecifications} from "../blockspecification/blockspecification";
import blocks from "../parser/blocks";


export default function generateText(workspace) {

    let u = ScratchBlocks.text.workspaceToCode(workspace);
    console.log('_____________');
    console.log(u);
    console.log('_____________');

}

// scratch LN
//======================================================
//generator
//======================================================

ScratchBlocks.text = new ScratchBlocks.Generator('text');

ScratchBlocks.text.init = function (workspace) {
    //nope
};

ScratchBlocks.text.scrub_ = function (block, code) {
    return code
};

ScratchBlocks.text.finish = function (code) {
    return code
};


ScratchBlocks.text.getNextCode = function (block) {
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = ScratchBlocks.text.blockToCode(nextBlock); //returns '' if not existing
    return nextCode
};

ScratchBlocks.text['event_whenflagclicked'] = function (block) {
    return 'when greenflag clicked;\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['pen_penup'] = function (block) {
    return 'pen up;\n' + ScratchBlocks.text.getNextCode(block);
};

String.prototype.format = function () {
    let args = arguments;
    return this.replace(/%(\d+)/g, function (_, m) {
        return args[--m];
    });
};

ScratchBlocks.text['motion_movesteps'] = function (block) {
    let value_name = ScratchBlocks.text.valueToCode(block, 'STEPS', ScratchBlocks.text.ORDER_NONE);
    console.log(value_name);
    return 'move %1 steps;\n'.format('{' + value_name + '}') + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['math_number'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};


//=================
/**
 * init blocks with information from blockspecifications
 */
export function init_generator(){
    console.log('parser utils called');
    // blockspecifications
    //generate the functions in blocks
    for(let x=0; x<blockspecifications.length;x++){
        let b = blockspecifications[x];
        let template = b['template'][0];
        let type = b['description']['type'];
        ScratchBlocks.text[type] = function (block) {
            return template+'\n' + ScratchBlocks.text.getNextCode(block);
        };
    }
}

init_generator();