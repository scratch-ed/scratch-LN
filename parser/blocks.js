let blocks = {};
export default blocks;

/*blocks["stop %1"] = function (ctx, visitor) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': "control_stop"
    });

    visitor.xml = visitor.xml.ele('field', {
        'name': "STOP_OPTION"
    }, visitor.visit(ctx.argument));

    visitor.xml = visitor.xml.up();
};*/



export function universalBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.idManager.getNextBlockID(visitor.getID(ctx, "atomic")),
        'type': structure.type
    });
    for (let i = 0; ctx.argument && i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.menu) {
            visitor.xml = visitor.xml.ele('value', {
                'name': arg.name
            });
            visitor.xml.ele('shadow', {
                'type': arg.menu //this was added to the json and was not default.
            }).ele('field', {
                'name': arg.name
            }, visitor.getString(ctx.argument[i])); // '_mouse_'
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
            }, visitor.getString(ctx.argument[i])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
            visitor.xml = visitor.xml.up();
        }
    }

}

//=======================================================================================================================================
// variable and list operations require special treatment considering the IDS
//=======================================================================================================================================


export function variableBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.idManager.getNextBlockID(visitor.getID(ctx, "atomic")),
    });
    visitor.xml.att('type', structure.type);
    let varble = visitor.visit(ctx.argument[0]);
    visitor.getVariableID(varble);
    visitor.xml = visitor.xml.ele('field', {
        'name': 'VARIABLE'
    }, varble);
    visitor.xml = visitor.xml.up().ele('value', {
        'name': 'VALUE'
    });
    visitor.visit(ctx.argument[1]);
    visitor.xml = visitor.xml.up();
}

//todo
export function listBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.idManager.getNextBlockID(visitor.getID(ctx, "atomic")),
        'type': structure.type
    });
    for (let i = 0; i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.name === 'LIST') {
            let varble = visitor.visit(ctx.argument[i]);
            visitor.getVariableID(varble, 'list');
            visitor.xml = visitor.xml.ele('field', {
                'name': 'LIST',
                'variabletype': 'list',
            }, varble);
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
            }, visitor.visit(ctx.argument[i])); //'all around' //this is ugly because 'menu' is the only one that returns something... and there is no check whether the option is existing and valid
            visitor.xml = visitor.xml.up();
        }
    }
}

//todo
export function messageShadowBlockconverter(ctx, visitor,structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });

    let varble = visitor.visit(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.getVariableID(varble, 'broadcast_msg');

    visitor.xml = visitor.xml.ele('value', {
        'name': arg.name
    });
    visitor.xml.ele('shadow', {
        'type': "event_broadcast_menu"
    }).ele('field', {
        'name': 'BROADCAST_OPTION',
        'variabletype':"broadcast_msg",
        'id':id
    }, varble);
    visitor.xml = visitor.xml.up();
}

//todo
export function messageBlockconverter(ctx, visitor,structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });

    let varble = visitor.visit(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.getVariableID(varble, 'broadcast_msg');

    visitor.xml.ele('field', {
        'name': "BROADCAST_OPTION",
        'variabletype':"broadcast_msg",
        'id':id
    }, varble);

}




