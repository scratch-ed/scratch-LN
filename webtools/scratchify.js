import $ from "jquery";
import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import {MEDIA} from "../config/config";

export function scratchify(clasz='scratch') {
    $('.'+clasz).each(function(i, obj) {
        let id = $(this).attr('id');
        if (!id) {
            id = "workspace_" + i;
        } else {
            id = "workspace_" + id;
        }
        //create the div to inject the workspace in
        $(this).parent().append($("<div class=blocklyDiv id=" + id + "></div>"));

        let workspace = createWorkspace(id);
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

export function createWorkspace(workspaceName) {
    return ScratchBlocks.inject(workspaceName, {
        toolbox: '<xml></xml>',
        'scrollbars': false,
        'trashcan': false,
        'readOnly': true,
        'comments': true,
        media: MEDIA, //flag
        colours: {
            fieldShadow: 'rgba(255, 255, 255, 1)'
        },
        zoom: {
            startScale: 0.5
        }
    });
}

export function fitBlocks(workspace, id) {

    //get the topblocks, this are the beginning of stacks. they are ordered by location.
    let topBlocks=workspace.getTopBlocks(true);
    let isHead = false;
    if(topBlocks[0]) {
        isHead = topBlocks[0].startHat_;
    }
    let metrics = workspace.getMetrics();
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