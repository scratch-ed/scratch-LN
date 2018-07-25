import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import generateText from './../generator/generator.js'
import {parseTextToXMLWithWarnings} from "../parser/parserUtils";
import {MEDIA} from "../config/config";

let workspace = null;
let editor;
let warnings;
let generatorField;


window.onload = function () {
    //ScratchBlocks.ScratchMsgs.setLocale("nl");
    //scratch-blocks
    workspace = ScratchBlocks.inject('blocklyDiv', {
        toolbox: '<xml></xml>',
        'scrollbars': true,
        'trashcan': false,
        'readOnly': false,
        'comments': true,
        media: MEDIA, //flag
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
    editor = document.getElementById('editor');
    editor.addEventListener('input', updateWorkspace);
    editor.value =  '(mouse x::var)'
    ;

    warnings = document.getElementById('warnings');

    generatorField = document.getElementById('generatorOutput');

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
    document.getElementById('translate').addEventListener('click', translate);
    document.getElementById('generate').addEventListener('click', generateTextWorkspace);


    //resizing workspace
    //https://developers.google.com/blockly/guides/configure/web/resizable
    let blocklyDiv = document.getElementById('blocklyDiv');
    let blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv.style.width = '50%';
    blocklyDiv.style.height = '80%';
    ScratchBlocks.svgResize(workspace);

    //addBlock('looks_say','aaa',1,1);
    //addBlock('data_addtolist','aaa',1,1);    
    //addBlock('procedures_definition','aaa',500,10);
    //addBlock('procedures_call','aaa',200,10);

    //insertSomeCodeFromXML();

    //generateText(workspace)

    console.log(getWorkspaceXML())
};

function generateTextWorkspace() {
    //let text = generateText(workspace);
    //generatorField.value = text;
}


function updateWorkspace() {
    //make xml
    //console.log('----');
    let text = editor.value;
    let r = parseTextToXMLWithWarnings(text);
    let xml = r.xml;

    console.log(xml);
    if (xml) { //clear workspace
        workspace.clear();
        //add to workspace
        let dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace);
        workspace.cleanUp();
        r.xml = undefined;
    }

    warnings.value = JSON.stringify(r);

    editor.focus();
    //console.log(getWorkspaceXML())

    //let topBlocks=workspace.getTopBlocks(true);
    //if(topBlocks[0]) {
    //    let x = topBlocks[0].startHat_;
    //    console.log(x)
    //}
    generateTextWorkspace();
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
        '    <variables></variables>\n' +
        '            <block id="hQ]-n]g^y*;-^RPV]UQh" type="procedures_call">\n' +
        '                <mutation proccode="blok %n %s %b after text" argumentids="[&quot;input0&quot;,&quot;input1&quot;,&quot;input2&quot;]"></mutation>\n' +
        '                <value name="input0">\n' +
        '                    <shadow id="x]R42mYvrfQ{)T+G@cn/" type="math_number">\n' +
        '                        <field name="NUM">444</field>\n' +
        '                    </shadow>\n' +
        '                </value>\n' +
        '                <value name="input1">\n' +
        '                    <shadow id="5PYa?j=YPU7n%{y7KbBe" type="text">\n' +
        '                        <field name="TEXT">lalala</field>\n' +
        '                    </shadow>\n' +
        '                </value>\n' +
        '                <value name="input2">\n' +
        '                    <block id="Eo{N.OdXey2sykDl7czU" type="operator_lt">\n' +
        '                        <value name="OPERAND1">\n' +
        '                            <shadow id="Fqe=q!wYlSE(aM@8:(g`" type="text">\n' +
        '                                <field name="TEXT"></field>\n' +
        '                            </shadow>\n' +
        '                        </value>\n' +
        '                        <value name="OPERAND2">\n' +
        '                            <shadow id="CCQfAT1YY%ukDp!mgxqp" type="text">\n' +
        '                                <field name="TEXT"></field>\n' +
        '                            </shadow>\n' +
        '                        </value>\n' +
        '                    </block>\n' +
        '                </value>\n' +
        '            </block>\n' +
        '</xml>\n';
    xml = '<xml xmlns="http://www.w3.org/1999/xhtml">\n' +
        '    <variables></variables>\n' +
        //todo this generates an error when toworkspace is called. somehting with x and y. I am not sure of the cause
        '    <comment x="0" y="0" w="100" h="100" minimized="false" id="biboba" >sad comment</comment> \n' +
        '    <comment x="100" y="100" w="100" h="100" minimized="false" id="biboba2" >sad comment2</comment> \n' +
        '    <block type="procedures_call" id="SaA0RG_sd@{sUN5%SWpW" x="119" y="267">\n' +
        '        <comment pinned="true">happy comment</comment> \n' + //pinned=true is for attached comments
        '        <mutation proccode="blok %n" argumentids="[&quot;input0&quot;]" warp="null"></mutation>\n' +
        '        <value name="input0">\n' +
        '            <shadow type="math_number" id="xAsO+lm[%y|!-0je(qxh">\n' +
        '                <field name="NUM">42</field>\n' +
        '            </shadow>\n' +
        '        </value>\n' +
        '    </block>\n' +
        '</xml>';
    console.log(xml);
    let dom = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, workspace);
    //<comment id="8*/w-@zgZoKksBwJl*dh" pinned="false" x="247" y="275" minimized="false" h="200" w="200">
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
    let code = 'define myblock (b) ||\n' +
        'repeat {10} |r|\n' +
        'myblock < {< {(a @ida |a|)} = {(b ::custom )} >} = {(x)} > @idb |b|\n' +
        'end\n' +
        'move {10 @idi} steps\n' +
        'say "hello"'
    editor.value = code;
    updateWorkspace();
}

function getWorkspaceXML() {
    let dom = ScratchBlocks.Xml.workspaceToDom(workspace);
    let text = new XMLSerializer().serializeToString(dom);
    return text
}

function translate() {
    let locale = document.getElementById('locale').value;
    setLocale(locale);
}

//copy paste from test in scratchblocks.
function setLocale(locale) {
    workspace.getFlyout().setRecyclingEnabled(false);
    let xml = ScratchBlocks.Xml.workspaceToDom(workspace);
    ScratchBlocks.ScratchMsgs.setLocale(locale);
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
    workspace.getFlyout().setRecyclingEnabled(true);
}