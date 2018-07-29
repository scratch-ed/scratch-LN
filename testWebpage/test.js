import $ from "jquery";
import {scratchify} from './../webtools/scratchify.js';
import {parseTextToXMLWithWarnings} from './../parser/parserUtils.js'

import ScratchBlocks from 'scratch-blocks';
import {createWorkspace, fitBlocks, DEFAULT_PROPERTIES} from "../webtools/scratchify";
import parseTextToXML from "../parser/parserUtils";

import generateText from "../generator/generator"

let workspaceCounter = 0;

$(document).ready(function () {
    //scratchify('.scratch');
    makeTable(['say "hello"', 'move {10} steps', 'x {', 'x |'], "a test");
    makeTable(("move {10} steps;" +
        "turn right {15} degrees;" +
        "turn clockwise {15} degrees;" +
        "turn \u21BB {15} degrees;" +
        "turn cw {15} degrees;" +
        "turn left {15} degrees;" +
        "turn ccw {15} degrees;" +
        "turn counterclockwise {15} degrees;" +
        "turn anticlockwise {15} degrees;" +
        "turn acw {15} degrees;" +
        "turn \u21BA {15} degrees;" +
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
        "(x position);" +
        "(y position);" +
        "(direction);").split(";"), "Motion");
    makeTable((
        "say \"hello\";" +
        "say \"hello\" for {2} seconds;" +
        "think \"hello\";" +
        "think \"hello\" for {2} seconds;" +
        "show;" +
        "hide;" +
        "switch costume to [costume 1];" +
        "next costume;" +
        "next backdrop;" +
        "switch backdrop to [backdrop];" +
        "switch backdrop to (variable);" +
        "switch backdrop to [backdrop] and wait;" +
        "change [color] effect by {10};" +
        "set [color] effect to {10};" +
        "change size by {10};" +
        "go to [back];" +
        "go [forward] {1} layers;" +
        "(costume [number]);" +
        "(backdrop [number]);" +
        "(size);" +
        "clear graphic effects;" +
        "set size to {100} %").split(";"), "Looks");
    makeTable(("start sound [1];" +
        "play sound [1] until done;" +
        "stop all sounds;" +
        "change [pitch] effect by {10};" +
        "set [pitch] effect to {100};" +
        "clear sound effects;" +
        "change volume by {-10};" +
        "set volume to {100}%;" +
        "(volume);").split(";"), "Sounds");
    makeTable(("when greenflag clicked;" +
        "when gf clicked;" +
        "when green flag clicked;" +
        "when \u2691 clicked;" +
        "when flag clicked;" +
        "when [space] key pressed;" +
        "when this sprite clicked;" +
        "when backdrop switches to [backdrop 1];" +
        "when [timer] \\> {10};" +
        "when [timer] gt {10};" +
        "when [timer] greater than {10};" +
        "when I receive [message1];" +
        "broadcast [message1];" +
        "broadcast [message1] and wait" +
        "").split(";"), "Events");
    makeTable(("wait {1} seconds;" +
        "wait until <>;" +
        "wait until {};" +
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
        "end;" +
        "else;" +
        "block;" +
        "end;" +
        "block",
        "if {} then",
        "if {} then \n else \n end",
        "forever",
        "repeat {10}",
        "repeat until <>",
        "repeat {10};block;end;block",
    ], "Control: C-Blocks");
    makeTable(("<touching [mouse-pointer]?>;" +
        "<touching [mouse-pointer]>;" +
        "<touching color {#123456} ?>;" +
        "<touching color {#123456} >;" +
        "<color {#123456} is touching {#123456} ?>;" +
        "<color {#123456} is touching {#123456} >;" +
        "(distance to [mouse-pounter]);" +
        "<key [space ] pressed ?>;" +
        "<key [space ] pressed >;" +
        "<mouse down?>;" +
        "<mouse down>;" +
        "(mouse x);" +
        "(mouse y);" +
        "set drag mode [draggable];" +
        "(loudness);" +
        "(timer);" +
        "reset timer;" +
        "( [x position] of [Sprite1]);" +
        "(current [year]);" +
        "(days since 2000);" +
        "(username);" +
        "(answer);" +
        "ask \"what is your favorite muffin?\" and wait").split(";"), "Sensing");
    makeTable(("({1} + {2});" +
        "({1} - {2});" +
        "({1} * {2});" +
        "({1} / {2});" +
        "(pick random {1} to {10});" +
        "<{1} \\< {2}>;" +
        "<{1} lt {2}>;" +
        "<{1} less than {2}>;" +
        "<{1} \\> {2}>;" +
        "<{1} gt {2}>;" +
        "<{1} greater than {2}>;" +
        "<{1} = {2}>;" +
        "<<> and <>>;" +
        "<<> or <>>;" +
        "<not <>>;" +
        "(join {\"hello\"} {\"world\"});" +
        "(letter {1} of {\"world\"});" +
        "(length of {\"world\"});" +
        "<{\"hello\"} contains {\"world\"} ?>;" +
        "( {3} mod {2});" +
        "(round {2.22});" +
        "([abs] of {-1})").split(";"), "Operators");
    makeTable(("set [a] to {\"fds\"};" +
        "set [a]to {(a)};" +
        "change [a] by {1};" +
        "change [a] by {(a)};" +
        "add {\"thing\"} to [lili];" +
        "delete {\"thing\"} of [lili];" +
        "insert {\"thing\"} at {1} of [lili];" +
        "replace item {1} of [lili] with {\"otherthing\"};" +
        "(item {1} of [lili]);" +
        "(item \\\# of {1} in [lili]);" + //todo
        "(length of [lili]);" +
        "< [lili] contains {\"thing\"}?>;" +
        " say {(a list::list)};" +
        " (a list::list);" +
        " (nolist);" +
        " hide list [lala];" +
        "show list [lala];" +
        "show variable [vivi];" +
        "hide variable [vivi];").split(";"), "Data");

    makeTable(("(length of {});" +
        "(length of {\"fds\"});" +
        "(length of [ddd]);" +
        "(length of {(dada)});" +
        "<{\"hello\"} contains {\"world\"}?>;" +
        "<{\"hello\"} contains {\"world\"}>;" +
        "< [lili] contains {\"thing\"}?>;" +
        "<{(sadfjk)} contains {(x)} ?>;" +
        "([x position] of [Sprite1]);" +
        "([abs] of {-1});" +
        "([abs] of {});" +
        "change [color] effect by {10};" +
        "set [color] effect to {10};" +
        "change [pitchX] effect by {10}::sound;" +
        "set [pitchX] effect to {100}::sound;" +
        "change [pitch] effect by {10};" +
        "set [pitch] effect to {100};"
    ).split(";"), "same text blocks");
    makeTable(("this is a custom block {1} \"a\" <>;" +
        "(a::My Block);" +
        "<b::My Block>;" +
        "define (a) <b>").split(";"), "My Blocks");
    makeTable(
        [
            "(direction)", "(direction::list)",
            "(direction::Variables)",
            "(direction::variables)", "(direction::custom)", "(direction::user-defined)",
            "(direction::My Blocks)", "(direction::MyBlocks)", "(direction::myblocks)",
            "(direction::local)", "(direction::custom-arg)",

        ]
        , "modifiers for reporterblocks");
    makeTable(
        [
            "<mouse down?>", "<mouse down?::Variables>",
            "<mouse down?::My Blocks>", "<mouse down?::local>", "<mouse down?::custom-arg>",

        ]
        , "modifiers for booleanblocks");
    makeTable(
        [
            "move {10} steps",
            "move {10} steps ::My Block"
        ]
        , "modifiers for stack blocks");
    makeTable(["|comment|",
        "(x |x comment|)",
        "block |x comment|",
        "|comment| ; block",
        "block {(r |r comment|)} |block comment|"
    ], "comments");
    /**/

    makeTable(["forever;\n" +
    "bla;\n" +
    "end;\n" +
    "bla",
        "mouse x", "mouse down", "direction", "<direction>",
        "change [something] effect by {10}",
        "change [something] effect by {10}",
        "change {color} effect by {10}",
        "when [XXX] key pressed;",
        "wait until (x)",
        "wait until \"x\"",
        "<answer>",
        "answer",
        "<dd>",
    ], "warnings");

    //makeTable(("").split(";"), "");
    //
    //scroll down #makeUrLifeEasy
    //window.scrollTo(0,document.body.scrollHeight);
});


function makeTable(codeArray, title = null) {
    var table = $('<table>');
    if (title) {
        $('#tables').append("<h2 id='" + title + "'><a href='#" + title + "'>" + title + "</a></h2>");
    }
    let startCounter = workspaceCounter;
    let storage = {};
    for (let i = 0; i < codeArray.length; i++) {
        let id = "workspace_" + workspaceCounter++;
        var ret = parseTextToXMLWithWarnings(codeArray[i]);
        storage[id] = ret.xml;
        ret.xml = undefined;
        table.append('<tr><td>' + $('<span>').text(codeArray[i]).html() + '</td>' +
            '<td>' + "<div class=blocklyDiv id=" + id + "></div>" + '</td>' +
            '<td>' + JSON.stringify(ret) + '</td>' +
            '<td id="text_' + id + '">' + "" + '</td>' +
            '</tr>');
    }
    $('#tables').append(table);
    for (let i = startCounter; i < workspaceCounter; i++) {
        let wid = "workspace_" + i;
        let xml = storage[wid];
        let workspace = createWorkspace(wid);
        if (xml) {
            try {
                var dom = ScratchBlocks.Xml.textToDom(xml);
                ScratchBlocks.Xml.domToWorkspace(dom, workspace);
                workspace.cleanUp();
                let text = generateText(workspace);
                $("#text_" + wid).text(text);
            } catch (err) {
                console.log(err);
            }
        }
        fitBlocks(workspace, wid, DEFAULT_PROPERTIES);
    }
}






