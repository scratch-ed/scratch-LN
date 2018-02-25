import $ from "jquery";
import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'

export default function scratchify(clasz='scratch',keepText=false) {
    $('.'+clasz).each(function(i, obj) {
        var id = $(this).attr('id')
        if (!id) {
            id = "workspace_" + i;
        } else {
            id = "workspace_" + id;
        }
        //wrap the code div in another idv
        if(keepText){
            $(this).wrap("<div class='codeDiv'></div>");
        }
        //create the div to inject the workspace in
        $(this).parent().append($("<div class=blocklyDiv id=" + id + "></div>"));

        var workspace = createWorkspace(id);
        //do parsing
        var text = $(this).text();
        if(!keepText){
            //$(this).text('');
            $(this).remove();
        }
        //console.log(text);
        var xml = parseTextToXML(text);
        //console.log(xml)
        //only if succesfully parsed
        if (xml) {
            //add to this workspace
            var dom = Blockly.Xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(dom, workspace);
        }
        //rescale the workspace to fit to the blocks
        fitBlocks(workspace, id);
        storeWorkspace(id, workspace);
    });
}

const workspaces = {}

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

function createWorkspace(workspaceName) {
    return ScratchBlocks.inject(workspaceName, {
        toolbox: '<xml></xml>',
        'scrollbars': false,
        'trashcan': false,
        'readOnly': true,
        media: 'static/blocks-media/', //flag
        colours: {
            fieldShadow: 'rgba(255, 255, 255, 1)'
        },
        zoom: {
            startScale: 0.5
        }
    });
}

function fitBlocks(workspace, id) {
    var metrics = workspace.getMetrics();
    $('#' + id).css('width', (metrics.contentWidth + 10) + 'px')
    $('#' + id).css('height', (metrics.contentHeight + 10) + 'px')
    ScratchBlocks.svgResize(workspace);
}