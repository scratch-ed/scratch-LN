let blocks = {};
export default blocks;


blocks["stop %1"] = function (ctx, visitor) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': "control_stop"
    });

    visitor.xml = visitor.xml.ele('field', {
        'name': "STOP_OPTION"
    }, visitor.visit(ctx.argument));

    visitor.xml = visitor.xml.up();
};



export function universalBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });
    for (let i = 0; i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.menu) {

            visitor.xml = visitor.xml.ele('value', {
                'name': arg.name
            });
            visitor.xml.ele('shadow', {
                'type': arg.menu //this was added to the json and was not default.
            }).ele('field', {
                'name': arg.name
            }, visitor.visit(ctx.argument[i])); // '_mouse_'
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
            }, visitor.visit(ctx.argument[i])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
            visitor.xml = visitor.xml.up();
        }
    }

}

//=======================================================================================================================================
// variable and list operations require special treatment considering the IDS
//=======================================================================================================================================

blocks["set %1 to %2"]=function(ctx,visitor){return variableBlockConverter(ctx, visitor, { "type":"data_setvariableto", "args":[{"type":"field_variable","name":"variable"},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
blocks["change %1 by %2"]=function(ctx,visitor){return variableBlockConverter(ctx, visitor, { "type":"data_changevariableby", "args":[{"type":"field_variable","name":"variable"},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };

blocks["add %1 to %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_addtolist", "args":[{"type":"input_value","name":"ITEM"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["delete %1 of %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_deleteoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["insert %1 at %2 of %3"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_insertatlist", "args":[{"type":"input_value","name":"ITEM"},{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["replace item %1 of %2 with %3"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_replaceitemoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]},{"type":"input_value","name":"ITEM"}],"shape":"statement"} ); };
blocks["item %1 of %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_itemoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"booleans"} ); };
blocks["show list %1"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_showlist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["hide list %1"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_hidelist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };

export function variableBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
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

export function listBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
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

blocks["when I receive %1"]=function(ctx,visitor){return messageBlockconverter(ctx, visitor, { "type":"event_whenbroadcastreceived", "args":[{"type":"field_variable","name":"BROADCAST_OPTION","variabletypes":["broadcast_msg"],"variable":"message1"}],"shape":"hatblock"} ); };
blocks["broadcast %1"]=function(ctx,visitor){return messageShadowBlockconverter(ctx, visitor, { "type":"event_broadcast", "args":[{"type":"input_value","name":"BROADCAST_INPUT"}],"shape":"statement"} ); };
blocks["broadcast %1 and wait"]=function(ctx,visitor){return messageShadowBlockconverter(ctx, visitor, { "type":"event_broadcastandwait", "args":[{"type":"input_value","name":"BROADCAST_INPUT"}],"shape":"statement"} ); };

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




