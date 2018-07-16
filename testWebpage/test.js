import $ from "jquery";
import scratchify from './../webtools/scratchify.js';
import {parseTextToXMLWithWarnings} from './../parser/parserUtils.js'

import ScratchBlocks from 'scratch-blocks';
import {createWorkspace, fitBlocks} from "../webtools/scratchify";
import parseTextToXML from "../parser/parserUtils";

let workspaceCounter =0;

$(document).ready(function() {
    makeTable(['say "hello"','move {10} steps','x {', 'x |'], "a test");
    //scratchify('scratch',true);
    //scroll down #makeUrLifeEasy
    //window.scrollTo(0,document.body.scrollHeight);
});

function makeTable(codeArray,title=null){
    var table = $('<table>');
    if(title){
        table.append( '<th>' + title +'</th>' );
    }
    let startCounter = workspaceCounter;
    let storage = {};
    for(let i=0;i<codeArray.length;i++){
        let id = "workspace_" + workspaceCounter++;
        var ret = parseTextToXMLWithWarnings(codeArray[i]);
        storage[id] = ret.xml;
        ret.xml = undefined;
        table.append( '<tr><td>' + codeArray[i] + '</td>' +
            '<td>'+ "<div class=blocklyDiv id=" + id + "></div>"+'</td>' +
            '<td>'+JSON.stringify(ret)+'</td>' +
            '</tr>' );
    }
    $('#tables').append(table);
    for(let i=startCounter;i<workspaceCounter;i++) {
        let wid = "workspace_" + i;
        let xml = storage[wid];
        let workspace=createWorkspace(wid);
        if(xml) {
            var dom = ScratchBlocks.Xml.textToDom(xml);
            ScratchBlocks.Xml.domToWorkspace(dom, workspace);
        }
        fitBlocks(workspace, wid);
    }
}






