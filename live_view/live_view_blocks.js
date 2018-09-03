import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import generateText from './../generator/generator.js'
import {MEDIA} from "../config/config";
import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools"

let workspace = null;
let aceEditor;
let aceFontSizeInput;
let aceCopyButton;

let example = "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables><variable type=\"broadcast_msg\" id=\"variable_0\" islocal=\"false\">message</variable><variable type=\"\" id=\"variable_1\" islocal=\"false\">lives</variable></variables><block type=\"event_whenflagclicked\" id=\"block_0\" x=\"0\" y=\"0\"><next><block type=\"control_forever\" id=\"block_1\"><statement name=\"SUBSTACK\"><block type=\"motion_goto\" id=\"block_2\"><value name=\"TO\"><shadow type=\"motion_goto_menu\" id=\"R?;co8@v$|ay*?RI~4sH\"><field name=\"TO\">mouse-pointer</field></shadow></value></block></statement></block></next></block><block type=\"event_whenbroadcastreceived\" id=\"block_3\" x=\"0\" y=\"224\"><field name=\"BROADCAST_OPTION\" id=\"variable_0\" variabletype=\"broadcast_msg\">message</field><next><block type=\"control_if\" id=\"block_4\"><value name=\"CONDITION\"><block type=\"sensing_touchingcolor\" id=\"block_5\"><value name=\"COLOR\"><shadow type=\"colour_picker\" id=\"block_5_input_0\"><field name=\"COLOUR\">#123456</field></shadow></value></block></value><statement name=\"SUBSTACK\"><block type=\"data_changevariableby\" id=\"block_6\"><field name=\"VARIABLE\" id=\"variable_1\" variabletype=\"\">lives</field><value name=\"VALUE\"><shadow type=\"text\" id=\"block_6_input_0\"><field name=\"TEXT\">-1</field></shadow></value><next><block type=\"control_if\" id=\"block_7\"><value name=\"CONDITION\"><block type=\"operator_lt\" id=\"block_8\"><value name=\"OPERAND1\"><block type=\"data_variable\" id=\"block_9\"><field name=\"VARIABLE\" id=\"variable_1\" variabletype=\"\">lives</field></block></value><value name=\"OPERAND2\"><shadow type=\"text\" id=\"block_8_input_0\"><field name=\"TEXT\">1</field></shadow></value></block></value><statement name=\"SUBSTACK\"><block type=\"looks_say\" id=\"block_10\"><value name=\"MESSAGE\"><shadow type=\"text\" id=\"block_10_input_0\"><field name=\"TEXT\">game over</field></shadow></value></block></statement></block></next></block></statement></block></next></block></xml>";


window.onload = function () {
    createEditor()
    //scratch-blocks
    workspace = ScratchBlocks.inject('blocklyDiv', {
        //toolbox: '<xml></xml>',
        'scrollbars': true,
        'trashcan': false,
        'readOnly': false,
        media: MEDIA, //flag
        colours: {
            workspace: '#ffe1eb', //'#e0ffe9',
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.5,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1
        }
    });

    //ScratchBlocks.mainWorkspace.getFlyout(). reflow();

    //all events in blockly: https://developers.google.com/blockly/reference/js/Blockly.Events
    //https://developers.google.com/blockly/guides/configure/web/events
    ScratchBlocks.mainWorkspace.addChangeListener((e) => {
            //for some reason does type not what i expect for blockchange and blockmove but it is necesaary for var rename...
            if(e instanceof  ScratchBlocks.Events.BlockChange //change value
                        || e instanceof  ScratchBlocks.Events.BlockMove  //move/delete/create block
                        || e.type ==  ScratchBlocks.Events.VAR_RENAME
                            ){
                generateTextWorkspace() ;
            }
    }
    );

    //text
    //let editor = document.getElementById('editor');
    //editor.value = '';




    //button options
    document.getElementById('generator').addEventListener('click', generateTextWorkspace);


    //resizing workspace
    //https://developers.google.com/blockly/guides/configure/web/resizable
    let blocklyDiv = document.getElementById('blocklyDiv');
    let blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv.style.width = '100%';
    blocklyDiv.style.height = '90vh';
    ScratchBlocks.svgResize(workspace);

    //addBlock('looks_say','aaa',1,1);
    //addBlock('data_addtolist','aaa',1,1);    
    //addBlock('procedures_definition','aaa',500,10);
    //addBlock('procedures_call','aaa',200,10);

    //insertSomeCodeFromXML();

    generateText(workspace);

    let dom = Blockly.Xml.textToDom(example);
    Blockly.Xml.domToWorkspace(dom, workspace);

};

function generateTextWorkspace() {
    let text = generateText(workspace);
    aceEditor.setValue(text);
    aceEditor.gotoLine(aceEditor.session.getLength());
}

function aceCopy(){
    //https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    let el = document.createElement('textarea');
    el.value = aceEditor.getValue();
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function aceFontSize() {
    aceEditor.setFontSize(aceFontSizeInput.value);
}

/**
 * configure the ace editor and toolbar
 */
function createEditor() {
    aceEditor = ace.edit("ace_editor",{


    });
    aceEditor.renderer.setScrollMargin(10, 10, 10, 10);

    aceFontSizeInput = document.getElementById('ace_font_size');
    aceFontSizeInput.addEventListener('change', aceFontSize);

    aceCopyButton = document.getElementById('ace_copy');
    aceCopyButton.addEventListener('click', aceCopy);

    aceEditor.on("input");
    aceFontSize();



}

