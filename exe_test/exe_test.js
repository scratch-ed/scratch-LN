/**
 * Tests reandering a scratch project.
 *
 * This is mostly copy paste from scratch-vm playground test
 * http://localhost:8008/exe_test.html
 *
 * @file   This files tests creation of a vm and renderer and reading a project from JSON.
 * @author Ellen Vanhove.
 */
import VM from 'scratch-vm';
import RenderWebGL from 'scratch-render'
import Storage from 'scratch-storage'
import AudioEngine from 'scratch-audio'
import ScratchBlocks from 'scratch-blocks';
import exampleJSON from './example'
import {parseTextToXMLDetails} from "../parser/parserUtils";
import generateText from './../generator/generator.js'
import format from "xml-formatter"
import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools"

import $ from "jquery";
import {MEDIA} from "../config/config";
const Scratch = {};



window.onload = function () {


    createScratchBlocksEditor();
    createVMandStage();

    /*document.getElementById('toxml').addEventListener('click', () => {
        let dom = ScratchBlocks.Xml.workspaceToDom(workspace);
        let text = new XMLSerializer().serializeToString(dom);
        var xml = format(text);
        let editor = document.getElementById('editor_xml');
        editor.value = xml;
    });
    document.getElementById('totext').addEventListener('click', () => {
        let text = generateText(workspace);
        let editor = document.getElementById('editor_text');
        editor.value = text;
    });

    document.getElementById('toJson').addEventListener('click', () => {
        toJson();
    });*/

    SLNEditor = ace.edit("slnEditor",{});
    SLNEditor.renderer.setScrollMargin(0,0,0,0);
    //SLNEdior = document.getElementById('editor');
    SLNEditor.addEventListener('input', updateWorkspace);
    document.getElementById('sln_font_size').addEventListener('change', ()=>{aceFontSize(SLNEditor,'sln_font_size')});
    SLNEditor.resize();

    tokensEditor = ace.edit("tokensEditor",{});
    tokensEditor.renderer.setScrollMargin(10, 10, 10, 10);
    document.getElementById('tokens_font_size').addEventListener('change', ()=>{aceFontSize(tokensEditor,'tokens_font_size')});

    cstEditor = ace.edit("cstEditor",{});
    cstEditor.renderer.setScrollMargin(10, 10, 10, 10);
    document.getElementById('cst_font_size').addEventListener('change', ()=>{aceFontSize(cstEditor,'cst_font_size')});

    XMLEditor = ace.edit("editor_xml",{});
    XMLEditor.renderer.setScrollMargin(10, 10, 10, 10);
    document.getElementById('visitor_font_size').addEventListener('change', ()=>{aceFontSize(XMLEditor,'visitor_font_size')});

    document.getElementById("refreshSB").addEventListener('click', refreshSB);
    document.getElementById("visitor-visual-tab").addEventListener('click', refreshSB);

    //https://getbootstrap.com/docs/4.0/components/navs/
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        if(e.target === "visitor-visual-tab"){
            refreshSB();
        }
        console.log(e.target);
    });

    document.getElementById("sbcleanup").addEventListener('click', ()=>{
        workspace.cleanUp();
    });

    JSONEditor = ace.edit("editor_json",{});
    JSONEditor.renderer.setScrollMargin(10, 10, 10, 10);
    document.getElementById('vm_font_size').addEventListener('change', ()=>{aceFontSize(JSONEditor,'vm_font_size')});





    document.getElementById("showexample").addEventListener('click', ()=>{
        let example = "when gf clicked\n" +
            "set [x] to {5}\n" +
            "repeat (x)\n" +
            "    turn left ({360}/(x)) degrees\n" +
            "end\n" +
            "say \"hello\"";
        SLNEditor.setValue(example);
        SLNEditor.gotoLine(0);
        updateWorkspace();
    });


    updateWorkspace();
};

function refreshSB() {
    let blocklyDiv = document.getElementById('blocklyDiv');
    blocklyDiv.style.width = '100%';
    blocklyDiv.style.height = '100%';
    ScratchBlocks.svgResize(workspace);
    workspace.getFlyout().setRecyclingEnabled(false);
    let xml = ScratchBlocks.Xml.workspaceToDom(workspace);
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
    workspace.getFlyout().setRecyclingEnabled(true);
    workspace.cleanUp();
}

function aceFontSize(editor, inputfieldid) {
    let input = document.getElementById(inputfieldid);
    editor.setFontSize(input.value);
}

let SLNEditor;
let tokensEditor;
let cstEditor;
let XMLEditor;
let JSONEditor;


function updateWorkspace() {
    //make xml
    let text = SLNEditor.getValue();
    let details = parseTextToXMLDetails(text);
    let xml = details.xml;

    console.log(details);

    tokensEditor.setValue(JSON.stringify(details.lexResult.tokens,null, 4));
    tokensEditor.gotoLine(0);
    drawLexer(details.lexResult.tokens)

    cstEditor.setValue(JSON.stringify(details.cst,null, 4));
    cstEditor.gotoLine(0);

    if (xml) {
        XMLEditor.setValue(xml);
        XMLEditor.gotoLine(0);
        //clear workspace
        workspace.clear();
        //add to workspace
        let dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace);
        toJson();

    }
}

function drawLexer(tokens) {
    var c = document.getElementById("tokensCanvas");
    var ctx = c.getContext("2d");
    var colors = {
        "Label": "#efa7d7",
        "Delimiter": "#c9c3c3",
        "MultipleDelimiters":"#919185",

        "StringLiteral": "#9ae055",
        "NumberLiteral": "#9cfcd8",
        "ColorLiteral": "#b2e868",
        "ChoiceLiteral":"#d2eaa1",

        "End": "#f2e180",
        "If": "#f2e180",
        "Forever": "#f2e180",
        "Repeat": "#f2e180",
        "RepeatUntil": "#f2e180",

        "LCurlyBracket": "#bdb9e5",
        "RCurlyBracket": "#bdb9e5",
        "RAngleBracket": "#9f98e0",
        "LAngleBracket": "#9f98e0",
        "RRoundBracket": "#c1baff",
        "LRoundBracket": "#c1baff",

    };
    let line = 1;
    let x_loc = 0;
    let h = 50;
    for(let i=0; i < tokens.length; i++){
        let token = tokens[i];

        if(token.startLine > line){
            line=token.startLine;
            x_loc=0;
        }
        let x = x_loc;
        let y = (line-1)*h;
        let w = 10*token.image.length + 11;

        //draw the fill
        console.log(token.tokenType.tokenName)
        ctx.fillStyle=colors[token.tokenType.tokenName];
        ctx.fillRect(x,y,w,h);
        //draw the border
        //ctx.rect(x, y, w,h);
        //draw the text
        ctx.fillStyle="black";
        ctx.font = "20px Arial";
        ctx.fillText(token.image,x+3,y+h/2+10);

        if(token.tokenType.tokenName === "MultipleDelimiters"){
            //draw on the nextline
            x = 0;
            y = (line)*h;
            w = 10*3 + 11 +10*2 + 11;
            ctx.fillStyle=colors[token.tokenType.tokenName];
            ctx.fillRect(x,y,w,h);
            //draw the border
            //ctx.rect(x, y, w,h);
            //draw the text
            ctx.fillStyle="black";
            ctx.font = "20px Arial";
            ctx.fillText(token.image,x+5,y+h/2+15);
        }


        //for the next iteration
        x_loc = x + w;
    }

//draw index
    let x = 500;
    let y = 10;
    for (var prop in colors) {
        ctx.fillStyle="black";
        ctx.font = "20px Arial";
        ctx.fillText(prop,x+25,y+20);
        ctx.fillStyle=colors[prop];
        ctx.fillRect(x,y,20,20);

        y = y+30;
    }


    ctx.stroke();
}

const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu/';
const PROJECT_SERVER = 'https://cdn.projects.scratch.mit.edu/';

/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project file.
 */
const getProjectUrl = function (asset) {
    const assetIdParts = asset.assetId.split('.');
    const assetUrlParts = [PROJECT_SERVER, 'internalapi/project/', assetIdParts[0], '/get/'];
    if (assetIdParts[1]) {
        assetUrlParts.push(assetIdParts[1]);
    }
    return assetUrlParts.join('');
};

/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project asset (PNG, WAV, etc.)
 */
const getAssetUrl = function (asset) {
    const assetUrlParts = [
        ASSET_SERVER,
        'internalapi/asset/',
        asset.assetId,
        '.',
        asset.dataFormat,
        '/get/'
    ];
    return assetUrlParts.join('');
};




let workspace = null;

const createScratchBlocksEditor = function () {
    workspace = ScratchBlocks.inject('blocklyDiv', {
        toolbox: '<xml></xml>',
        'scrollbars': true,
        'trashcan': false,
        'readOnly': false,
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

    Scratch.workspace = workspace;

    ScratchBlocks.mainWorkspace.getFlyout().hide();
    let blocklyDiv = document.getElementById('blocklyDiv');
    blocklyDiv.style.width = '100%';
    blocklyDiv.style.height = '100%';
    ScratchBlocks.svgResize(workspace);


};



const loadProjectFromID = function () {
    let id = location.hash.substring(1);
    if (id.length < 1 || !isFinite(id)) {
        //id = '187598405'; //cdjlogo
        //id = '119615668'; //dino
        //id = '194801841'; //memory
        //id = '209232771'; //take steps
        id = '212621983'; //custom block
    }
    Scratch.vm.downloadProjectId(id);
};

const loadProjectFromJson = function(json){
    Scratch.vm.fromJSON(json);
};

function toJson() {
    let json = Scratch.vm.toJSON();
    let editor=document.getElementById('editor_json');
    json = JSON.stringify(JSON.parse(json),null, 4);
    JSONEditor.setValue(json);
    JSONEditor.gotoLine(0);
}


function createVMandStage() {
    const vm = new VM();
    Scratch.workspace.addChangeListener(vm.blockListener);
    Scratch.workspace.addChangeListener(vm.variableListener);
    const flyoutWorkspace = Scratch.workspace.getFlyout().getWorkspace();
    flyoutWorkspace.addChangeListener(vm.flyoutBlockListener);
    flyoutWorkspace.addChangeListener(vm.monitorBlockListener);

    //init renderer
    const canvas = document.getElementById('scratch-stage');
    const renderer = new RenderWebGL(canvas);
    vm.attachRenderer(renderer);

    //init storage: stuff for assets
    const storage = new Storage();
    const AssetType = storage.AssetType;
    storage.addWebSource([AssetType.Project], getProjectUrl);
    storage.addWebSource([AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound], getAssetUrl);
    vm.attachStorage(storage);

    //init audio
    const audioEngine = new AudioEngine();
    vm.attachAudioEngine(audioEngine);


    //store this objects because thats how they did it in the playground
    Scratch.vm = vm;
    Scratch.renderer = renderer;
    Scratch.storage = storage;
    Scratch.audioEngine = audioEngine;


    //load project from url
    loadProjectFromID();
    //loadProjectFromJson(exampleJSON);


    //buttons
    document.getElementById('greenflag').addEventListener('click', () => {
        vm.greenFlag();
    });
    document.getElementById('stopall').addEventListener('click', () => {
        vm.stopAll();
    });


    // Feed mouse events as VM I/O events.
    document.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const coordinates = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', coordinates);
    });
    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        const data = {
            isDown: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', data);
        e.preventDefault();
    });
    canvas.addEventListener('mouseup', e => {
        const rect = canvas.getBoundingClientRect();
        const data = {
            isDown: false,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', data);
        e.preventDefault();
    });

    // Receipt of new block XML for the selected target.
    vm.on('workspaceUpdate', data => {
        workspace.clear();
        const dom = ScratchBlocks.Xml.textToDom(data.xml);
        console.log(data.xml)
        ScratchBlocks.Xml.domToWorkspace(dom, workspace);
    });


    // Receipt of new list of targets, selected target update.
    const selectedTarget = document.getElementById('selectedTarget');
    vm.on('targetsUpdate', data => {
        // Clear select box.
        while (selectedTarget.firstChild) {
            selectedTarget.removeChild(selectedTarget.firstChild);
        }
        // Generate new select box.
        for (let i = 0; i < data.targetList.length; i++) {
            const targetOption = document.createElement('option');
            targetOption.setAttribute('value', data.targetList[i].id);
            // If target id matches editingTarget id, select it.
            if (data.targetList[i].id === data.editingTarget) {
                targetOption.setAttribute('selected', 'selected');
            }
            targetOption.appendChild(
                document.createTextNode(data.targetList[i].name)
            );
            selectedTarget.appendChild(targetOption);
        }
    });
    selectedTarget.onchange = function () {
        vm.setEditingTarget(this.value);
    };
    //start the vm: important
    vm.start();
}