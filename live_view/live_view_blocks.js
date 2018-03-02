import ScratchBlocks from 'scratch-blocks';
import parseTextToXML from './../parser/parserUtils.js'
import generateText from './../generator/generator.js'

let workspace = null;


window.onload = function () {
    //scratch-blocks
    workspace = ScratchBlocks.inject('blocklyDiv', {
        //toolbox: '<xml></xml>',
        'scrollbars': true,
        'trashcan': false,
        'readOnly': false,
        media: '/static/blocks-media/', //flag
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
            console.log('change listerener called ####### START');
            console.log(e);
            if(e instanceof  ScratchBlocks.Events.BlockCreate){
               //
            }else if(e instanceof  ScratchBlocks.Events.BlockChange //change value
                        || e instanceof  ScratchBlocks.Events.BlockMove  //move/delete/create block
                        || e instanceof ScratchBlocks.Events.VAR_RENAME
                            ){
                generateTextWorkspace() ;
            }

            console.log('################################# END');
        }
    );

    //text
    let editor = document.getElementById('editor');
    editor.value = '';


    //button options
    document.getElementById('generator').addEventListener('click', generateTextWorkspace);


    //resizing workspace
    //https://developers.google.com/blockly/guides/configure/web/resizable
    let blocklyDiv = document.getElementById('blocklyDiv');
    let blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv.style.width = '50%';
    blocklyDiv.style.height = '90%';
    ScratchBlocks.svgResize(workspace);

    //addBlock('looks_say','aaa',1,1);
    //addBlock('data_addtolist','aaa',1,1);    
    //addBlock('procedures_definition','aaa',500,10);
    //addBlock('procedures_call','aaa',200,10);

    //insertSomeCodeFromXML();

    generateText(workspace)

};

function generateTextWorkspace() {
    let text = generateText(workspace);
    editor.value = text;
}


