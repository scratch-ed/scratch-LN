import ScratchBlocks from 'scratch-blocks';
import xmlDom from 'xmldom';
import parseTextToXML from './../parser/parserUtils.js'
import builder from 'xmlbuilder'; //https://github.com/oozcitak/xmlbuilder-js/wiki
import $ from "jquery";
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
    editor.value = 'when [space] key pressed;\npen down \nmove {42} steps;\npen up;\n\nwhen greenflag clicked;\nif <{(x)}contains {"hello"}?>\nsay {"hello world"}'
    updateWorkspace();

    //button options
    document.getElementById('parser').addEventListener('click', updateWorkspace);
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

};

function updateWarnings(text) {
    document.getElementById('warnings').innerHTML = text;
}

function generateTextWorkspace() {
    generateText(workspace);
}


function updateWorkspace() {
    //make xml
    //console.log('----');
    let text = editor.value;
    let xml = parseTextToXML(text);
    //console.log(xml)
    if (xml) { //clear workspace
        updateWarnings('')
        workspace.clear();
        //add to workspace
        let dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace)
    } else {
        updateWarnings('workspace not updated:text is incorrect') //todo: add clear message
    }
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
    let id = document.getElementById('blockid').value
    workspace.glowStack(id, true);
};


function showExample() {
    let code = 'when gf clicked \nif < {(blub)} contains {"citroen"} ? > \nif < {(length of {(blub)})} = {2} >\nrepeat 10\nrepeat 10\nset pen color to {(pick random {0} to {255})}\nglide {2} secs to x: {(pick random {0} to {240})} y: {(pick random {0} to {180})}\npen up\nend\ngo to x: {0} y: {0}'
    editor.value = code;
    updateWorkspace();
}
