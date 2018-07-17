import $ from "jquery";
import {scratchify} from './../webtools/scratchify.js';
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
    makeTable(("start sound [1];" +
        "play sound [1] until done;" +
        "stop all sounds;" +
        "rest for {0.25} beats;" +
        "play note {30} for {0.3} beats;" +
        "change [pitch] effect by {10};" +
        "set [pitch] effect to {100};" +
        "clear sound effects;" +
        "change volume by {-10};" +
        "set volume to {100}%;" +
        "change tempo by {60};" +
        "set tempo to {60} bpm;" +
        "set instrument to [ikook];" +
        "play drum [ikbenverzonnen] for {0.2} beats;" +
        "set instrument to [(1) Piano];" +
        "volume;" +
        "tempo").split(";"), "Sounds");
    makeTable(("when greenflag clicked;" +
        "when [space] key pressed;" +
        "when this sprite clicked;" +
        "when backdrop switches to [backdrop 1];" +
        "when [timer] \\> {10};" +
        "when I receive [message1];" +
        "broadcast [message1];" +
        "broadcast [message1] and wait" +
        "").split(";"), "Events");
    makeTable(("wait {1} seconds;" +
        "wait until <>;" +
        "stop [all];" +
        "when I start as a clone;" +
        "create clone of [myself];" +
        "delete this clone").split(";"), "Control");
    makeTable(["if <>",
        "if <>;" +
        "block;" +
        "end;" +
        "block",
        "if <> else ",
        "if <>;" +
        "block;" +
        "else;" +
        "block;" +
        "end;" +
        "block",
        "forever",
        "repeat {10}",
        "repeat until <>",
        "repeat {10};block;end;block",
    ], "Control: C-Blocks");
    makeTable(("touching [mouse-pointer]?;" +
        "touching color {#123456} ?;" +
        "color {#123456} is touching {#123456} ?;" +
        "distance to [mouse-pounter];" +
        "key [space ] pressed ?;" +
        "mouse down?;" +
        "mouse x;" +
        "mouse y;" +
        "set drag mode [draggable];" +
        "loudness;" +
        "timer;" +
        "reset timer;" +
        " [x position] of [Sprite1];" +
        "current [year];" +
        "days since 2000").split(";"), "Sensing");
    makeTable(("{1} + {2};" +
        "{1} - {2};" +
        "{1} * {2};" +
        "{1} / {2};" +
        "pick random {1} to {10};" +
        "{1} \\< {2};" +
        "{1} \\> {2};" +
        "{1} = {2};" +
        "<> and <>;" +
        "<> or <>;" +
        "not <>;" +
        "join {\"hello\"} {\"world\"};" +
        "letter {1} of {\"world\"};" +
        "length of {\"world\"};" +
        "{\"hello\"} contains {\"world\"} ?;" +
        " {3} mod {2};" +
        "round {2.22};" +
        " [abs] of {-1}").split(";"), "Operators");
    makeTable(("set [a] to {\"fds\"};" +
        "set [a]to {(a)};" +
        "change [a] by {1};" +
        "change [a] by {(a)};" +
        "add {\"thing\"} to [lili];" +
        "delete {\"thing\"} of [lili];" +
        "insert {\"thing\"} at {1} of [lili];" +
        "replace item {1} of [lili] with {\"otherthing\"};" +
        "item {1} of [lili];" +
        "length of [lili];" +
        " [lili] contains {\"thing\"}?;" +
        " say {(a list::list)};" +
        " (a list::list);" +
        " (nolist);").split(";"), "Data");

    makeTable(("length of {};" +
        "length of {\"fds\"};" +
        "length of [ddd];" +
        "length of {(dada)};" +
        "{\"hello\"} contains {\"world\"} ?;" +
        " [lili] contains {\"thing\"}?;" +
        "{(sadfjk)} contains {(x)} ?;" +
        "[x position] of [Sprite1];" +
        "[abs] of {-1};" +
        "[abs] of {};" +
        "change [color] effect by {10};" +
        "set [color] effect to {10};" +
        "change [pitchX] effect by {10}::sound;" +
        "set [pitchX] effect to {100}::sound;" +
        "change [pitch] effect by {10};" +
        "set [pitch] effect to {100}").split(";"), "same text blocks");
    makeTable(("this is a custom block {1} \"a\" <>;" +
        "(a::custom);" +
        "<b::custom>;" +
        "define (a) <b>").split(";"), "custom blocks");
    makeTable(["|comment|",
        "(x |x comment|)",
        "block |x comment|",
        "|comment| ; block",
        "block {(r |r comment|)} |block comment|"
    ], "comments");
    //makeTable(("").split(";"), "");
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
            try {
                var dom = ScratchBlocks.Xml.textToDom(xml);
                ScratchBlocks.Xml.domToWorkspace(dom, workspace);
            }catch(err){
                console.log(err);
            }
        }
        fitBlocks(workspace, wid);
    }
}






