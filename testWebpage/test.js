import $ from "jquery";
import scratchify from './../webtools/scratchify.js';
import {parseTextToXMLWithWarnings} from './../parser/parserUtils.js'

import ScratchBlocks from 'scratch-blocks';
import {createWorkspace, fitBlocks} from "../webtools/scratchify";
import parseTextToXML from "../parser/parserUtils";

let workspaceCounter =0;

$(document).ready(function() {
    makeTable(['say "hello"','move {10} steps','x {', 'x |'], "a test");
    makeTable(("move {10} steps;" +
        "turn cw {15} degrees;" +
        "turn ccw {15} degrees;" +
        "point in direction {90};" +
        "point towards [mouse-pointer];" +
        "go to x: {0} y: {0};" +
        "go to [mouse-pointer];" +
        "glide {1} secs to x: {0} y: {0};" +
        "glide {1} secs to [mouse-pointer];" +
        "change x by {10};" +
        "set x to {0};" +
        "change y by {10};" +
        "set y to {0};" +
        "set rotation style [left-right];" +
        "if on edge, bounce;" +
        "x position;" +
        "y position;" +
        "direction;").split(";"), "Motion");
    makeTable(("show;" +
        "hide;" +
        "switch costume to [costume 1];" +
        "next costume;" +
        "next backdrop;" +
        "switch backdrop to [backdrop];" +
        "switch backdrop to [backdrop] and wait;" +
        "change [color] effect by {10};" +
        "set [color] effect to {10};" +
        "change size by {10};" +
        "go to [back];" +
        "go [forward] {1} layers;" +
        "costume [number];" +
        "backdrop [number];" +
        "size").split(";"), "Looks");
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






