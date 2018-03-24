/**
 * Summary.
 *
 * Description.
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */

import VM from 'scratch-vm';
import RenderWebGL from 'scratch-render'
import Storage from 'scratch-storage'
import AudioEngine from 'scratch-audio'
import ScratchBlocks from 'scratch-blocks';


const Scratch = {};


const loadProjectFromID = function () {
    let id = location.hash.substring(1);
    if (id.length < 1 || !isFinite(id)) {
        //id = '187598405'; //cdjlogo
        //id = '119615668'; //dino
        //id = '194801841'; //memory
        id = '209232771'; //take steps
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
    // document.getElementById('greenflag').addEventListener('click', () => {
    //     vm.greenFlag();
    // });
    // document.getElementById('stopall').addEventListener('click', () => {
    //     vm.stopAll();
    // });

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

    vm.on('workspaceUpdate', data => {
        workspace.clear();
        const dom = ScratchBlocks.Xml.textToDom(data.xml);
        ScratchBlocks.Xml.domToWorkspace(dom, workspace);
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
            //workspace: '#E0FFFF', //'#e0ffe9',
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
    blocklyDiv.style.width = '30%';
    blocklyDiv.style.height = '360px';
    ScratchBlocks.svgResize(workspace);

};
