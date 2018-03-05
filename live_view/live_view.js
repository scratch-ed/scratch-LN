import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import generateText from './../generator/generator.js'

let workspace = null;


window.onload = function () {
    //scratch-blocks
    workspace = ScratchBlocks.inject('blocklyDiv', {
        toolbox: '<xml></xml>',
        'scrollbars': true,
        'trashcan': false,
        'readOnly': false,
        media: '/static/blocks-media/', //flag
        colours: {
            workspace: '#E0FFFF', //'#e0ffe9',
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.75,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1
        }
    });

    ScratchBlocks.mainWorkspace.getFlyout().hide();

    //text
    let editor = document.getElementById('editor');
    editor.addEventListener('input', updateWorkspace);
    editor.value = 'if <not {}>\n' +
        'pen up\n' +
        'end\n' +
        'pen up';//' when greenflag clicked;move {456} steps;pen up;'//go to x: {0} y: {0};pen down;repeat (zijde);move {100} steps;turn cw {({360} /{(zijde)})} degrees;end;pen up'//'when gf clicked;repeat 10;pen up;' //'define BLUB {(d)} {<f>}'
    updateWorkspace();

    //button options
    document.getElementById('xmlparser').addEventListener('click', generateTextWorkspace);
    document.getElementById('showexample').addEventListener('click', showExample);
    //glowing buttons
    document.getElementById('glowon').addEventListener('click', glowOn);
    document.getElementById('glowoff').addEventListener('click', glowOff);
    document.getElementById('report').addEventListener('click', report);
    document.getElementById('stackglowon').addEventListener('click', stackGlowOn);
    document.getElementById('stackglowoff').addEventListener('click', stackGlowOff);

    //resizing workspace
    //https://developers.google.com/blockly/guides/configure/web/resizable
    let blocklyDiv = document.getElementById('blocklyDiv');
    let blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv.style.width = '50%';
    blocklyDiv.style.height = '90%';
    ScratchBlocks.svgResize(workspace);

    //addBlock('looks_say','aaa',1,1);
    //addBlock('data_addtolist','aaa',1,1);    
    //addBlock('procedures_definition','aaa',500,10);
    //addBlock('procedures_call','aaa',200,10);

    //insertSomeCodeFromXML();

    generateText(workspace)

};

function generateTextWorkspace() {
    generateText(workspace);
}


function updateWorkspace() {
    //make xml
    //console.log('----');
    let text = editor.value;
    let xml = parseTextToXML(text);
    console.log(xml);
    if (xml) { //clear workspace
        workspace.clear();
        //add to workspace
        let dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace)
    }
}


//===================================================================================
// testing functions
//===================================================================================

function addBlock(prototypeName, id, x, y) {
    let block = workspace.newBlock(prototypeName, id);

    block.initSvg();

    block.setMovable(false);
    block.setEditable(false);

    block.moveBy(x, y);

    block.render();

    //console.log(block);
}

function insertSomeCodeFromXML() {

    let xml = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
        '  <variables> \n' +
        '    <variable type="arg" id="var08">a</variable>\n' +
        '  </variables>\n' +
        '  <block id="0" type="procedures_call" x="10" y="10">\n' +
        '    <mutation proccode="sayaas %s" argumentnames="[&quot;a&quot;]" warp="false" argumentids="[&quot;var0&quot;]"/>\n' +
        '    <value name="a">\n' +
        '      <block type="data_variable" id="1" x="10" y="10">\n' +
        '        <field name="VARIABLE" id="var0">a</field>\n' +
        '      </block>\n' +
        '    </value>\n' +
        '    <next/>\n' +
        '  </block>\n' +
        '</xml>'
    //console.log(xml);
    let dom = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, workspace);
    //workspace.getById(id) //https://developers.google.com/blockly/reference/js/Blockly.Workspace#.getById
}

//===================================================================================
// indicationtestfucnitons
//===================================================================================


let glowOn = function () {
    let id = document.getElementById('blockid').value;
    workspace.glowBlock(id, true);
};

let glowOff = function () {
    let id = document.getElementById('blockid').value;
    workspace.glowBlock(id, false);
};

let report = function () {
    let id = document.getElementById('blockid').value;
    workspace.reportValue(id, 'dit is ' + id);
};

let stackGlowOff = function () {
    let id = document.getElementById('blockid').value;
    workspace.glowStack(id, false);
};

let stackGlowOn = function () {
    let id = document.getElementById('blockid').value;
    workspace.glowStack(id, true);
};


function showExample() {
    let code = 'when gf clicked \nif < {(blub)} contains {"citroen"} ? > \nif < {(length of {(blub)})} = {2} >\nrepeat 10\nrepeat 10\nset pen color to {(pick random {0} to {255})}\nglide {2} secs to x: {(pick random {0} to {240})} y: {(pick random {0} to {180})}\npen up\nend\ngo to x: {0} y: {0}'
    editor.value = code;
    updateWorkspace();
}