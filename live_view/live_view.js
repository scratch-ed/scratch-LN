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
    editor.value = 'say {(a)}'//' when greenflag clicked;move {456} steps;pen up;'//go to x: {0} y: {0};pen down;repeat (zijde);move {100} steps;turn cw {({360} /{(zijde)})} degrees;end;pen up'//'when gf clicked;repeat 10;pen up;' //'define BLUB {(d)} {<f>}'
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
    let xml = [
        '<xml id="main_ws_blocks" style="display:none">',
        '<block id="]){{Y!7N9ezN+j@Vr`8p" type="procedures_definition" x="25" y="25">',
        '<statement name="custom_block">',
        '<shadow type="procedures_prototype" id="caller_internal">',
        '<mutation proccode="say %s %n times if %b" argumentnames="[&quot;something&quot;,&quot;this many&quot;,&quot;this is true&quot;]" argumentdefaults="[&quot;&quot;,1,false]" warp="false" argumentids="[&quot;a42&quot;, &quot;b23&quot;, &quot;c99&quot;]"/>',
        '</shadow>',
        '</statement>',
        '<next>',
        '<block id="caller_external" type="procedures_call">',
        '<mutation proccode="say %s %n times if %b" argumentnames="[&quot;something&quot;,&quot;this many&quot;,&quot;this is true&quot;]" argumentdefaults="[&quot;&quot;,1,false]" warp="false" argumentids="[&quot;a42&quot;, &quot;b23&quot;, &quot;c99&quot;]"/>',
        '<value name="something">',
        '<shadow id="V0~M:TxRk0Ua%osjGzh," type="text">',
        '<field name="TEXT">"tttt"</field>',
        '</shadow>',
        '</value>',
        '<value name="input1">',
        '<shadow id="uPx3si(KkbL1)-XpbXoQ" type="math_number">',
        '<field name="NUM">20</field>',
        '</shadow>',
        '</value>',
        '</block>',
        '</next>',
        '</block>',
        '</xml>'
    ].join('\n');
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