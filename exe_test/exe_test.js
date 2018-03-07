import VM from 'scratch-vm';
import RenderWebGL from 'scratch-render'
import Storage from 'scratch-storage'
import AudioEngine from 'scratch-audio'
import exampleJSON from './example'
//http://localhost:8008/exe_test.html
const Scratch = {};

const loadProjectFromID = function () {
    let id = location.hash.substring(1);
    if (id.length < 1 || !isFinite(id)) {
        id = '187598405';
    }
    Scratch.vm.downloadProjectId(id);
};

const loadProjectFromJson = function(json){
    Scratch.vm.fromJSON(json);
};

function toJson() {
    let json = Scratch.vm.toJSON();
    console.log(json);
    editor=document.getElementById('editor');
    editor.value=json;
}

window.onload = function () {
    const vm = new VM();

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
    //loadProjectFromID();
    loadProjectFromJson(exampleJSON);


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

