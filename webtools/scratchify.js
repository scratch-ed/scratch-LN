import $ from "jquery";
import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import {MEDIA} from "../config/config";


const LOCALE_ATTR ="blocks-locale";
const SCALE_ATTR ="blocks-scale"

/**
 *
 * @param selector see: https://www.w3schools.com/jquery/jquery_ref_selectors.asp
 * @param properties see: DEFAULT_PROPERTIES
 */
export function scratchify(selector='.scratch',properties={}) {
    let userDefaultProperties=mergeProperties(properties,DEFAULT_PROPERTIES);
    $(selector).each(function(i, obj) {
        let id = $(this).attr('id');
        if (!id) {
            id = "workspace_" + i;
        } else {
            id = "workspace_" + id;
        }
        //create the div to inject the workspace in
        $(this).parent().append($("<div class=blocklyDiv id=" + id + "></div>"));
        let extracted = {};
        extracted.locale=$(this).attr(LOCALE_ATTR);
        extracted.zoom = {
            startScale: $(this).attr(SCALE_ATTR)
        };
        let prop=mergeProperties(extracted,userDefaultProperties);
        let workspace = createWorkspace(id,prop);
        //do parsing
        let text = $(this).text();
        //remove the text
        $(this).remove();
        //console.log(text);
        let xml = parseTextToXML(text);
        //only if succesfully parsed
        if (xml) {
            //add to this workspace
            let dom = Blockly.Xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(dom, workspace);
            workspace.cleanUp();
        }
        //rescale the workspace to fit to the blocks
        fitBlocks(workspace, id);
        storeWorkspace(id, workspace);
    });
}

const workspaces = {};

function storeWorkspace(workspaceName, workspace) {
    workspaces[workspaceName] = workspace;
}

export function getWorkspace(id) {
    var workspaceName = "workspace_" + id;
    return workspaces[workspaceName];
}

export function stackGlow(id, blockID, on) {
    getWorkspace(id).glowStack(blockID, on);
}

export function glowBlock(id, blockID, on) {
    getWorkspace(id).glowBlock(blockID, on);
}

export function report(id, blockID, value) {
    getWorkspace(id).reportValue(blockID, value);
}

export function changeValue(id, blockID, value) {
    var block = getWorkspace(id).getBlockById(blockID);
    var field = block.inputList[0].fieldRow[0];
    field.setText(value);
}

export const DEFAULT_PROPERTIES = {
    //this is exactly the same as blockly/scratchblocks properties
    readOnly: true,
    toolbox: '<xml></xml>',
    scrollbars: false,
    trashcan: false,
    comments: true,
    media: MEDIA,
    colours: {
        fieldShadow: 'rgba(255, 255, 255, 1)'
    },
    zoom: {
        startScale: 0.5
    },
    // ----
    //extra locale
    locale: "en",
};

export function createWorkspace(workspaceName,properties=DEFAULT_PROPERTIES) {
    ScratchBlocks.ScratchMsgs.setLocale(properties.locale);
    return ScratchBlocks.inject(workspaceName, properties);
}

function mergeProperties(properties, defaultprops){
    let prop = {};
    for(let p in defaultprops){
        if(properties.hasOwnProperty(p)){
            prop[p] = properties[p];
        }else{
            prop[p] = defaultprops[p];
        }
    }
    return prop;
}

export function fitBlocks(workspace, id) {
    let isHead = false;
    //get the topblocks, this are the beginning of stacks. they are ordered by location.
    let topBlocks=workspace.getTopBlocks(true);
    if(topBlocks[0]) {
        isHead = topBlocks[0].startHat_;
    }
    let metrics = workspace.getMetrics(); //is not dependent on the location of the workspace
    if(isHead){
        $('#' + id).css('height', (metrics.contentHeight + 20) + 'px');
        //translate the whole workspace (like dragging in the live view)
        workspace.translate(5,12);
    }else{
        $('#' + id).css('height', (metrics.contentHeight + 10) + 'px');
        workspace.translate(5,5);
    }
    $('#' + id).css('width', (metrics.contentWidth + 10) + 'px');
    ScratchBlocks.svgResize(workspace);
}