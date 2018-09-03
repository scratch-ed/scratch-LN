import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import generateText from './../generator/generator.js'
import {parseTextToXMLWithWarnings} from "../parser/parserUtils";
import {MEDIA} from "../config/config";
import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools"


let workspace = null;
let warnings;
let generatorField;
let aceEditor;


window.onload = function () {
    createEditor();

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

    //init extra text fields
    warnings = document.getElementById('warnings');

    generatorField = document.getElementById('generatorOutput');

    //set default value
    aceEditor.on("input",updateWorkspace);
    let text = 'repeat{10} \n stop \nend\nbla\nbla\nbla\nbla\nbla\nbla\nbla\nbla\nbla\nbla'
    ;
    aceEditor.setValue(text);
    aceEditor.gotoLine(aceEditor.session.getLength());


    //button options
    document.getElementById('showexample').addEventListener('click', showExample);
    document.getElementById('showgimmic').addEventListener('click', showGimmic);
    console.log("gimic")
    document.getElementById('locale').addEventListener('click', translate);
    document.getElementById('makeimage').addEventListener('click', savePNG);


    //glowing buttons
    document.getElementById('glowon').addEventListener('click', glowOn);
    document.getElementById('glowoff').addEventListener('click', glowOff);
    document.getElementById('report').addEventListener('click', report);
    document.getElementById('stackglowon').addEventListener('click', stackGlowOn);
    document.getElementById('stackglowoff').addEventListener('click', stackGlowOff);



    document.getElementById('generate').addEventListener('click', generateTextWorkspace);

    //resizing workspace
    //https://developers.google.com/blockly/guides/configure/web/resizable
    let blocklyDiv = document.getElementById('blocklyDiv');
    let blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv.style.width = '100%';
    blocklyDiv.style.height = '90vh'; //1vh = 1% of browser screen height
    ScratchBlocks.svgResize(workspace);

    //insertSomeCodeFromXML();

    //generateText(workspace)

    //set view right
    updateWorkspace();
    translate();

    console.log(getWorkspaceXML())
};

//===================================================================================
// ace editor
//===================================================================================

function updateToolbar() {
    aceCopyButton.disabled = aceEditor.session.getUndoManager().isClean();
    aceUndoButton.disabled = !aceEditor.session.getUndoManager().hasUndo();
    aceRedoButton.disabled = !aceEditor.session.getUndoManager().hasRedo();
}

let aceUndoButton;
let aceRedoButton;
let aceCopyButton;
let aceFontSizeInput;
let aceCommentButton;

function aceUndo(){
    aceEditor.undo();
}

function aceRedo(){
    aceEditor.redo();
}

function aceComment() {
    aceEditor.insertSnippet("/*${1:$SELECTION}*/");
    aceEditor.renderer.scrollCursorIntoView()
}

function aceCopy(){
    //https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    let el = document.createElement('textarea');
    el.value = aceEditor.getValue();
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function aceFontSize() {
    aceEditor.setFontSize(aceFontSizeInput.value);
}

/**
 * configure the ace editor and toolbar
 */
function createEditor() {
    aceEditor = ace.edit("ace_editor",{


    });
    aceEditor.renderer.setScrollMargin(10, 10, 10, 10);
    aceUndoButton = document.getElementById('ace_undo');
    aceUndoButton.addEventListener('click', aceUndo);

    aceRedoButton = document.getElementById('ace_redo');
    aceRedoButton.addEventListener('click', aceRedo);

    aceFontSizeInput = document.getElementById('ace_font_size');
    aceFontSizeInput.addEventListener('change', aceFontSize);

    aceCopyButton = document.getElementById('ace_copy');
    aceCopyButton.addEventListener('click', aceCopy);

    aceCommentButton = document.getElementById('ace_comment');
    aceCommentButton.addEventListener('click', aceComment);

    aceEditor.on("input", updateToolbar);
    aceFontSize();



}



//===================================================================================


function generateTextWorkspace() {
    let text = generateText(workspace);
    generatorField.value = text;
}


function updateWorkspace() {
    //make xml
    //console.log('----');
    //let text = editor.value;
    let text = aceEditor.getValue();
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

    console.log(getWorkspaceXML());
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
    aceEditor.setValue(code);
    updateWorkspace();
}

function showGimmic(){
    let code = "when I receive [Scratch-LN changed]\n" +
        "change blocks\n" +
        "\n" +
        "when I receive [blocks changed]\n" +
        "change Scratch-LN\n" +
        "\n" +
        "when I need [Scratch 3.0 blocks]\n" +
        "if <documentation>\n" +
        "  write Scratch-LN\n" +
        "  see blocks\n" +
        "  copy blocks\n" +
        "  execute blocks\n" +
        "  move blocks\n" +
        "  copy blocks\n" +
        "  translate blocks\n" +
        "else\n" +
        "  move blocks\n" +
        "  see Scratch-LN\n" +
        "  copy Scratch-LN​";
    aceEditor.setValue(code);
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


//===================================================================================
// save PNG button
//===================================================================================


/**
 * https://stackoverflow.com/questions/27230293/how-to-convert-svg-to-png-using-html5-canvas-javascript-jquery-and-save-on-serve
 * svg -> canvas -> blob
 * canvas is hidden element in the html
 */
function savePNG(){
    let svgname = ".blocklySvg";
    let svg = document.querySelector(svgname);

    console.log(svg);

    //canvas is hidden
    let canvasname = "myCanvas";
    let myCanvas = document.getElementById(canvasname);
    let ctx = myCanvas.getContext("2d");

    //size of the worksapce
    let metrics = workspace.getMetrics();
    console.log(metrics);


    //function to generate url
    let DOMURL = window.URL || window.webkitURL || window;



    let data = (new XMLSerializer()).serializeToString(svg);
    let svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    let url = DOMURL.createObjectURL(svgBlob);
    let img = new Image(); //image object
    img.onload = function () {
        //todo: this is the workspace size as png.
        //todo: to get a decent view: the workspace need to be resized to the blocks before genarting the image.
        //todo: add the stylesheet so that the text is white. dunno yet how.
        ctx.canvas.width  = metrics.viewWidth; //
        ctx.canvas.height = metrics.viewHeight; //
        //myCanvas.style.width  = metrics.contentWidth + "px";
        //myCanvas.style.height = metrics.contentHeight+ "px";
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0);

        DOMURL.revokeObjectURL(url);

        let imgURI = myCanvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');

        triggerDownload(imgURI);
    };

    img.src = url;
}

function triggerDownload (imgURI) {
    let evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
    });

    let a = document.createElement('a');
    a.setAttribute('download', 'scratch_code.png');
    a.setAttribute('href', imgURI);
    a.setAttribute('target', '_blank');

    a.dispatchEvent(evt);
}