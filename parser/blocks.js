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

function variableBlockConverter(ctx, visitor, structure) {
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

function listBlockConverter(ctx, visitor, structure) {
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

function messageShadowBlockconverter(ctx, visitor,structure) {
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

function messageBlockconverter(ctx, visitor,structure) {
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

//=======================================================================================================================================
// if the same text on the block: do smart
//=======================================================================================================================================


let lookSetEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_seteffectto", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["color","COLOR"],["fisheye","FISHEYE"],["whirl","WHIRL"],["pixelate","PIXELATE"],["mosaic","MOSAIC"],["brightness","BRIGHTNESS"],["ghost","GHOST"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
let soundSetEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_seteffectto", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["pitch","PITCH"],["pan left/right","PAN"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
blocks["set %1 effect to %2"] = function(ctx, visitor) {
    let opt = visitor.getString(ctx.option[0]);
    if (opt === 'sound') {
        return soundSetEffect(ctx, visitor);
    }
   	let label = visitor.getString(ctx.argument[0]);
    if (label === "pan left/right" || label ==='pitch' ){
    	return soundSetEffect(ctx, visitor);
    }
    return lookSetEffect(ctx, visitor);
};

let soundChangeEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_changeeffectby", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["pitch","PITCH"],["pan left/right","PAN"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
let lookChangeEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_changeeffectby", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["color","COLOR"],["fisheye","FISHEYE"],["whirl","WHIRL"],["pixelate","PIXELATE"],["mosaic","MOSAIC"],["brightness","BRIGHTNESS"],["ghost","GHOST"]]},{"type":"input_value","name":"CHANGE"}],"shape":"statement"} ); };
blocks["change %1 effect by %2"] = function(ctx, visitor) {
    let opt = visitor.getString(ctx.option[0]);
    let label = visitor.getString(ctx.argument[0]);
    if (opt === 'sound') {
        return soundChangeEffect(ctx, visitor);
    }
    if (label === "pan left/right" || label ==='pitch' ){
    	return soundChangeEffect(ctx, visitor);
    }

    return lookChangeEffect(ctx, visitor);
};

let operatorOf=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_mathop", "args":[{"type":"field_dropdown","name":"OPERATOR","options":[["abs","abs"],["floor","floor"],["ceiling","ceiling"],["sqrt","sqrt"],["sin","sin"],["cos","cos"],["tan","tan"],["asin","asin"],["acos","acos"],["atan","atan"],["ln","ln"],["log","log"],["e ^","e ^"],["10 ^","10 ^"]]},{"type":"input_value","name":"NUM"}],"shape":"reporterblock"} ); };
let sensingOf = function (ctx, visitor) {
    //return universalBlockConverter(ctx, visitor, { "type":"sensing_of", "args":[{"type":"field_dropdown","name":"PROPERTY","options":[["x position","x position"],["y position","y position"],["direction","direction"],["costume #","costume #"],["costume name","costume name"],["size","size"],["volume","volume"],["backdrop #","backdrop #"],["backdrop name","backdrop name"]],'menu':'sensing_of_object_menu'},{"type":"input_value","name":"OBJECT"}],"shape":"booleans"} ); 
    //something was weird here...
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': 'sensing_of'
    });
    visitor.xml = visitor.xml.ele('field', {
        'name': 'PROPERTY'
    }, visitor.visit(ctx.argument[0])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
    visitor.xml = visitor.xml.up().ele('value', {
        'name': 'OBJECT'
    });
    //no assignement bcs of visist
    visitor.xml.ele('shadow', {
        'type': 'sensing_of_object_menu' //this was added to the json and was not default.
    }).ele('field', {
        'name': 'OBJECT'
    }, visitor.visit(ctx.argument[1])); // '_mouse_'
    visitor.xml = visitor.xml.up();
};

blocks["%1 of %2"] = function(ctx, visitor) {
    let argType = visitor.getType(ctx.argument[1]);
    if (argType === 'choice') {
        return sensingOf(ctx, visitor);
    }
    return operatorOf(ctx, visitor);
};

let operatorContains=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_contains", "args":[{"type":"input_value","name":"STRING1"},{"type":"input_value","name":"STRING2"}],"shape":"booleanblock"} ); };
let listContains=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_listcontainsitem", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]},{"type":"input_value","name":"ITEM"}],"shape":"booleanblock"} ); };
blocks["%1 contains %2?"] = function (ctx, visitor) {
    let argType = visitor.getType(ctx.argument[0]);
    if (argType === 'choice') {
        return listContains(ctx, visitor);
    }
    return operatorContains(ctx, visitor);

};


let operatorLengthOf=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_length", "args":[{"type":"input_value","name":"STRING"}],"shape":"reporterblock"} ); };
let listLengthOf=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_lengthoflist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"reporterblock"} ); };

blocks["length of %1"] = function(ctx, visitor) {
    let argType = visitor.getType(ctx.argument[0]);
    if (argType === 'choice') {
        return listLengthOf(ctx, visitor);
    }
    return operatorLengthOf(ctx, visitor);

};

