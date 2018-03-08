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
import parseTextToXML from "../parser/parserUtils";

const Scratch = {};

const loadProjectFromID = function () {
    let id = location.hash.substring(1);
    if (id.length < 1 || !isFinite(id)) {
        //id = '187598405'; //cdjlogo
        id = '119615668'; //dino
    }
    Scratch.vm.downloadProjectId(id);
};

const loadProjectFromJson = function(json){
    Scratch.vm.fromJSON(json);
};

function toJson() {
    let json = Scratch.vm.toJSON();
    let editor=document.getElementById('editor_json');
    editor.value=json;
}

window.onload = function () {
    const vm = new VM();

    createEditor();
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
    document.getElementById('toJson').addEventListener('click', () => {
        toJson();
    });

    //start the vm: important
    vm.start();


};


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

const createEditor = function () {
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

    Scratch.workspace = workspace;

    ScratchBlocks.mainWorkspace.getFlyout().hide();
    let blocklyDiv = document.getElementById('blocklyDiv');
    blocklyDiv.style.width = '100%';
    blocklyDiv.style.height = '50%';
    ScratchBlocks.svgResize(workspace);

    let editor = document.getElementById('editor');
    editor.addEventListener('input', updateWorkspace);
};

function updateWorkspace() {
    //make xml
    let text = editor.value;
    let xml = parseTextToXML(text);
    if (xml) { //clear workspace
        workspace.clear();
        //add to workspace
        let dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace)
    }
}