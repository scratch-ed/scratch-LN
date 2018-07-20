let blocks = {};
export default blocks;

import {BROADCAST, LIST} from "./IDManager";

/**
 *
 * @param ctx
 * @param visitor
 * @param arg definition from the structure
 * @param i the index of the argument in the ctx
 */
function makeArgument(ctx, visitor, arg, i) {
    if (arg.menu) {
        visitor.xml = visitor.xml.ele('value', {
            'name': arg.name
        });
        visitor.xml.ele('shadow', {
            'type': arg.menu //this was added to the json and was not default.
        }).ele('field', {
            'name': arg.name
        }, visitor.infoVisitor.getString(ctx.argument[i])); // '_mouse_'
        visitor.xml = visitor.xml.up();
    } else if (arg.type === 'input_value') {
        visitor.xml = visitor.xml.ele('value', {
            'name': arg.name
        });
        visitor.visit(ctx.argument[i]);
        visitor.xml = visitor.xml.up();
    } else if (arg.type === 'field_dropdown') {
        visitor.xml = visitor.xml.ele('field', {
            'name': arg.name
        }, visitor.infoVisitor.getString(ctx.argument[i]));
        visitor.xml = visitor.xml.up();
    }
}

export function universalBlockConverter(ctx, visitor, structure) {
    if (structure.shape === "hatblock") {
        visitor.interruptStack();
    }
    addType(ctx, visitor, structure.type);
    for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        makeArgument(ctx, visitor, arg, i);
    }
    if (structure.shape === "hatblock") {
        visitor.startStack();
    }
    if (structure.shape === "capblock") {
        visitor.interruptStack();
    }
}


export function addType(ctx, visitor, type) {
    let blockid = visitor.idManager.getNextBlockID(visitor.infoVisitor.getID(ctx, "atomic"));
    visitor.xml = visitor.xml.ele('block', {
        'id': blockid,
        'type': type
    });
    visitor.state.addBlock(blockid);
};

//=======================================================================================================================================
// variable and list operations require special treatment considering the IDS
//=======================================================================================================================================

export function variableBlockConverter(ctx, visitor, structure) {
    addType(ctx, visitor, structure.type);
    //name of the variable
    let varble = visitor.infoVisitor.getString(ctx.argument[0]);
    //function must be called to register VariableID
    visitor.idManager.acquireVariableID(varble);
    visitor.xml = visitor.xml.ele('field', {
        'name': 'VARIABLE'
    }, varble);
    if(structure.args.length>1) {
        visitor.xml = visitor.xml.up().ele('value', {
            'name': 'VALUE'
        });
    }
    //the second argument.
    visitor.visit(ctx.argument[1]);
    visitor.xml = visitor.xml.up();
}

//todo
export function listBlockConverter(ctx, visitor, structure) {
    addType(ctx, visitor, structure.type);
    for (let i = 0; i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.name === 'LIST') {
            let varble = visitor.infoVisitor.getString(ctx.argument[i]);
            visitor.idManager.acquireVariableID(varble, LIST);
            visitor.xml = visitor.xml.ele('field', {
                'name': 'LIST',
                'variabletype': 'list',
            }, varble);
            visitor.xml = visitor.xml.up();
        } else {
            makeArgument(ctx, visitor, arg, i);
        }
    }
}

//todo
export function messageShadowBlockconverter(ctx, visitor, structure) {
    addType(ctx, visitor, structure.type);
    let varble = visitor.infoVisitor.getString(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.idManager.acquireVariableID(varble, BROADCAST);

    visitor.xml = visitor.xml.ele('value', {
        'name': arg.name
    });
    visitor.xml.ele('shadow', {
        'type': "event_broadcast_menu"
    }).ele('field', {
        'name': 'BROADCAST_OPTION',
        'variabletype': "broadcast_msg",
        'id': id
    }, varble);
    visitor.xml = visitor.xml.up();
}

// "when I receive %1"
export function messageBlockconverter(ctx, visitor, structure) {
    if (structure.shape === "hatblock") {
        visitor.interruptStack();
    }
    addType(ctx, visitor, structure.type);

    let varble = visitor.infoVisitor.getString(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.idManager.acquireVariableID(varble, BROADCAST);

    visitor.xml.ele('field', {
        'name': "BROADCAST_OPTION",
        'variabletype': "broadcast_msg",
        'id': id
    }, varble);
    if (structure.shape === "hatblock") {
        visitor.startStack();
    }
}

//todo
export function stopConverter(ctx, visitor, structure) {
    addType(ctx, visitor, structure.type);
    visitor.xml = visitor.xml.ele('field', {
        'name': "STOP_OPTION"
    }, visitor.infoVisitor.getString(ctx.argument[0]));
    visitor.xml = visitor.xml.up();
    visitor.interruptStack();
}