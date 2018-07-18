/**
 * Specification of blocks.
 *
 * Specifications of the blocks. See wiki: https://github.com/scratch4d/scratch-LN/wiki/blockspecifications
 *
 * @file   This files defines the blockspecifications const.
 * @author Ellen Vanhove.
 */
import {
    universalBlockConverter, listBlockConverter, messageBlockconverter,
    messageShadowBlockconverter, variableBlockConverter, stopConverter, addType
} from "../parser/blocks";
import {CHOICE, COLOR} from "../parser/InfoLNVisitor";

/*
 {"template":"",
        "description": ,
            "converter": universalBlockConverter
        }

 */
// ===============================================================================
// some frequently used predicates

let looksSoundPredicate = function (ctx, visitor) {
    let opt = ctx.option ? visitor.infoVisitor.getString(ctx.option[0]) : '';
    let label = visitor.infoVisitor.getString(ctx.argument[0]);
    return (opt === 'sound') || (label === "pan left/right" || label === 'pitch');
};

let listOperatorPredicate = function (ctx, visitor) {
    let argType = visitor.infoVisitor.getType(ctx.argument[0]);
    return (argType === CHOICE);
};
// ===============================================================================


export const blockspecifications = [
        {
            "template": ["go to %1"],
            "description": {
                "type": "looks_gotofrontback",
                "args": [{
                    "type": "field_dropdown",
                    "name": "FRONT_BACK",
                    "options": [["front", "front"], ["back", "back"]]
                }],
                "shape": "statement"
            },
            "converter": universalBlockConverter,
            "predicate": (ctx, visitor) => {
                let arg = visitor.infoVisitor.getString(ctx.argument[0]);
                return (arg === 'front' || arg === 'back');
            }

        },
        {
            "template": ["go to %1"],
            "description": {
                "type": "motion_goto",
                "args": [{"type": "input_value", "name": "TO", "menu": "motion_goto_menu"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter,
        },
        /*{
            "template": ["pen down"],
            "description": {"type": "pen_pendown", "shape": "statement"},
            "converter": universalBlockConverter
        },*/
        {
            "template": ["say %1"],
            "description": {
                "type": "looks_say",
                "args": [{"type": "input_value", "name": "MESSAGE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        }, {
            "template": "go to x: %1 y: %2",
            "description": {
                "type": "motion_gotoxy",
                "args": [{"type": "input_value", "name": "X"}, {"type": "input_value", "name": "Y"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        }, {
            "template": "set rotation style %1",
            "description": {
                "type": "motion_setrotationstyle",
                "args": [{
                    "type": "field_dropdown",
                    "name": "STYLE",
                    "options": [["left-right", "left-right"], ["don't rotate", "don't rotate"], ["all around", "all around"]]
                }],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        }, {
            "template": "%1 + %2",
            "description": {
                "type": "operator_add",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        }, {
            "template": "not %1",
            "description": {
                "type": "operator_not",
                "args": [{"type": "input_value", "name": "OPERAND", "check": "Boolean"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },

//==== operator ===================================================
        {
            "template": "%1 - %2",
            "description": {
                "type": "operator_subtract",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 * %2",
            "description": {
                "type": "operator_multiply",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 / %2",
            "description": {
                "type": "operator_divide",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "pick random %1 to %2",
            "description": {
                "type": "operator_random",
                "args": [{"type": "input_value", "name": "FROM"}, {"type": "input_value", "name": "TO"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["%1 lt %2", "%1 < %2", "%1 less than %2"],
            "description": {
                "type": "operator_lt",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 = %2",
            "description": {
                "type": "operator_equals",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["%1 gt %2", "%1 > %2", "%1 greater than %2"],
            "description": {
                "type": "operator_gt",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 and %2",
            "description": {
                "type": "operator_and",
                "args": [{"type": "input_value", "name": "OPERAND1", "check": "Boolean"}, {
                    "type": "input_value",
                    "name": "OPERAND2",
                    "check": "Boolean"
                }],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 or %2",
            "description": {
                "type": "operator_or",
                "args": [{"type": "input_value", "name": "OPERAND1", "check": "Boolean"}, {
                    "type": "input_value",
                    "name": "OPERAND2",
                    "check": "Boolean"
                }],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "join %1 %2",
            "description": {
                "type": "operator_join",
                "args": [{"type": "input_value", "name": "STRING1"}, {"type": "input_value", "name": "STRING2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "letter %1 of %2",
            "description": {
                "type": "operator_letter_of",
                "args": [{"type": "input_value", "name": "LETTER"}, {"type": "input_value", "name": "STRING"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 mod %2",
            "description": {
                "type": "operator_mod",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "round %1",
            "description": {
                "type": "operator_round",
                "args": [{"type": "input_value", "name": "NUM"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
//=== control ===============================================================
        {
            "template": "wait %1 seconds",
            "description": {
                "type": "control_wait",
                "args": [{"type": "input_value", "name": "DURATION"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "wait until %1",
            "description": {
                "type": "control_wait_until",
                "args": [{"type": "input_value", "name": "CONDITION", "check": "Boolean"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "when I start as a clone",
            "description": {"type": "control_start_as_clone", "args": [], "shape": "hatblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "create clone of %1",
            "description": {
                "type": "control_create_clone_of",
                "args": [{"type": "input_value", "name": "CLONE_OPTION", "menu": "control_create_clone_of_menu"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "delete this clone",
            "description": {"type": "control_delete_this_clone", "args": [], "shape": "capblock"},
            "converter": universalBlockConverter
        },
//=== sensing ===============================================================
        {
            "template": ["touching %1?", "touching %1"],
            "description": {
                "type": "sensing_touchingobject",
                "args": [{"type": "input_value", "name": "TOUCHINGOBJECTMENU", "menu": "sensing_touchingobjectmenu"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["touching color %1?", "touching color %1"],
            "description": {
                "type": "sensing_touchingcolor",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["color %1 is touching %2?", "color %1 is touching %2"],
            "description": {
                "type": "sensing_coloristouchingcolor",
                "args": [{"type": "input_value", "name": "COLOR"}, {"type": "input_value", "name": "COLOR2"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "distance to %1",
            "description": {
                "type": "sensing_distanceto",
                "args": [{"type": "input_value", "name": "DISTANCETOMENU", "menu": "sensing_distancetomenu"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "ask %1 and wait",
            "description": {
                "type": "sensing_askandwait",
                "args": [{"type": "input_value", "name": "QUESTION"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "answer",
            "description": {"type": "sensing_answer", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": ["key %1 pressed?", "key %1 pressed"],
            "description": {
                "type": "sensing_keypressed",
                "args": [{
                    "type": "input_value",
                    "name": "KEY_OPTION",
                    "options": [["space", "space"], ["left arrow", "left arrow"], ["right arrow", "right arrow"], ["down arrow", "down arrow"], ["up arrow", "up arrow"], ["any", "any"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"]],
                    "menu": "sensing_keyoptions"
                }],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["mouse down?", "mouse down"],
            "description": {"type": "sensing_mousedown", "shape": "booleanblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "mouse x",
            "description": {"type": "sensing_mousex", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "mouse y",
            "description": {"type": "sensing_mousey", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "set drag mode %1",
            "description": {
                "type": "sensing_setdragmode",
                "args": [{
                    "type": "field_dropdown",
                    "name": "DRAG_MODE",
                    "options": [["draggable", "draggable"], ["not draggable", "not draggable"]]
                }],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "loudness",
            "description": {"type": "sensing_loudness", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "video %1 on %2",
            "description": {
                "type": "sensing_videoon",
                "args": [{"type": "input_value", "name": "VIDEOONMENU1"}, {"type": "input_value", "name": "VIDEOONMENU2"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "turn video %1",
            "description": {
                "type": "sensing_videotoggle",
                "args": [{"type": "input_value", "name": "VIDEOTOGGLEMENU"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set video transparency to %1%",
            "description": {
                "type": "sensing_setvideotransparency",
                "args": [{"type": "input_value", "name": "TRANSPARENCY"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "timer",
            "description": {"type": "sensing_timer", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "reset timer",
            "description": {"type": "sensing_resettimer", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "current %1",
            "description": {
                "type": "sensing_current",
                "args": [{
                    "type": "field_dropdown",
                    "name": "CURRENTMENU",
                    "options": [["year", "YEAR"], ["month", "MONTH"], ["date", "DATE"], ["day of week", "DAYOFWEEK"], ["hour", "HOUR"], ["minute", "MINUTE"], ["second", "SECOND"]]
                }],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "days since 2000",
            "description": {"type": "sensing_dayssince2000", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "username",
            "description": {"type": "sensing_username", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },


//=== motion  ===============================================================
        {
            "template": "move %1 steps",
            "description": {
                "type": "motion_movesteps",
                "args": [{"type": "input_value", "name": "STEPS"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["turn right %1 degrees", "turn cw %1 degrees", "turn clockwise %1 degrees", "turn \u21BB %1 degrees"],
            "description": {
                "type": "motion_turnright",
                "args": [{"type": "input_value", "name": "DEGREES"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["turn left %1 degrees", "turn ccw %1 degrees", "turn counterclockwise %1 degrees",
                "turn anticlockwise %1 degrees", "turn acw %1 degrees", "turn \u21BA %1 degrees",],
            "description": {
                "type": "motion_turnleft",
                "args": [{"type": "input_value", "name": "DEGREES"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "point in direction %1",
            "description": {
                "type": "motion_pointindirection",
                "args": [{"type": "input_value", "name": "DIRECTION"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "point towards %1",
            "description": {
                "type": "motion_pointtowards",
                "args": [{"type": "input_value", "name": "TOWARDS", "menu": "motion_pointtowards_menu"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "glide %1 secs to x: %2 y: %3",
            "description": {
                "type": "motion_glidesecstoxy",
                "args": [{"type": "input_value", "name": "SECS"}, {
                    "type": "input_value",
                    "name": "X"
                }, {"type": "input_value", "name": "Y"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "glide %1 secs to %2",
            "description": {
                "type": "motion_glideto",
                "args": [{"type": "input_value", "name": "SECS"}, {
                    "type": "input_value",
                    "name": "TO",
                    "menu": "motion_glideto_menu"
                }],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "change x by %1",
            "description": {
                "type": "motion_changexby",
                "args": [{"type": "input_value", "name": "DX"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set x to %1",
            "description": {"type": "motion_setx", "args": [{"type": "input_value", "name": "X"}], "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "change y by %1",
            "description": {
                "type": "motion_changeyby",
                "args": [{"type": "input_value", "name": "DY"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set y to %1",
            "description": {"type": "motion_sety", "args": [{"type": "input_value", "name": "Y"}], "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": ["bounce on edge", "if on edge, bounce"],
            "description": {"type": "motion_ifonedgebounce", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "x position",
            "description": {"type": "motion_xposition", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "y position",
            "description": {"type": "motion_yposition", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "direction",
            "description": {"type": "motion_direction", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
//=== looks ======================================
        {
            "template": "say %1 for %2 seconds",
            "description": {
                "type": "looks_sayforsecs",
                "args": [{"type": "input_value", "name": "MESSAGE"}, {"type": "input_value", "name": "SECS"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "think %1 for %2 seconds",
            "description": {
                "type": "looks_thinkforsecs",
                "args": [{"type": "input_value", "name": "MESSAGE"}, {"type": "input_value", "name": "SECS"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "think %1",
            "description": {
                "type": "looks_think",
                "args": [{"type": "input_value", "name": "MESSAGE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "show",
            "description": {"type": "looks_show", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "hide",
            "description": {"type": "looks_hide", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "clear graphic effects",
            "description": {"type": "looks_cleargraphiceffects", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "change size by %1",
            "description": {
                "type": "looks_changesizeby",
                "args": [{"type": "input_value", "name": "CHANGE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set size to %1 %",
            "description": {
                "type": "looks_setsizeto",
                "args": [{"type": "input_value", "name": "SIZE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "size",
            "description": {"type": "looks_size", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "switch costume to %1",
            "description": {
                "type": "looks_switchcostumeto",
                "args": [{"type": "input_value", "name": "COSTUME", "menu": "looks_costume"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "next costume",
            "description": {"type": "looks_nextcostume", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "switch backdrop to %1",
            "description": {
                "type": "looks_switchbackdropto",
                "args": [{"type": "input_value", "name": "BACKDROP", "menu": "looks_backdrops"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "go %1 %2 layers",
            "description": {
                "type": "looks_goforwardbackwardlayers",
                "args": [{
                    "type": "field_dropdown",
                    "name": "FORWARD_BACKWARD",
                    "options": [["forward", "forward"], ["backward", "backward"]]
                }, {"type": "input_value", "name": "NUM"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "backdrop %1",
            "description": {
                "type": "looks_backdropnumbername",
                "args": [{
                    "type": "field_dropdown",
                    "name": "NUMBER_NAME",
                    "options": [["number", "number"], ["name", "name"]]
                }],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "costume %1",
            "description": {
                "type": "looks_costumenumbername",
                "args": [{
                    "type": "field_dropdown",
                    "name": "NUMBER_NAME",
                    "options": [["number", "number"], ["name", "name"]]
                }],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "switch backdrop to %1 and wait",
            "description": {
                "type": "looks_switchbackdroptoandwait",
                "args": [{"type": "input_value", "name": "BACKDROP", "menu": "looks_backdrops"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "next backdrop",
            "description": {"type": "looks_nextbackdrop", "shape": "statement"},
            "converter": universalBlockConverter
        },
        //=== pen
        //todo -> extensions
        /*{
            "template": "clear",
            "description": {"type": "pen_clear", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "stamp",
            "description": {"type": "pen_stamp", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "pen up",
            "description": {"type": "pen_penup", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "set pen color to %1",
            "description": {
                "type": "pen_setpencolortocolor",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter,
            "predicate": (ctx, visitor) => {
                let argType = visitor.infoVisitor.getType(ctx.argument[0]);
                return (argType === COLOR);
            }
        },
        {
            "template": "set pen color to %1",
            "description": {
                "type": "pen_setpencolortonum",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter

        },
        {
            "template": "change pen color by %1",
            "description": {
                "type": "pen_changepencolorby",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "change pen shade by %1",
            "description": {
                "type": "pen_changepenshadeby",
                "args": [{"type": "input_value", "name": "SHADE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set pen shade to %1",
            "description": {
                "type": "pen_setpenshadeto",
                "args": [{"type": "input_value", "name": "SHADE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "change pen size by %1",
            "description": {
                "type": "pen_changepensizeby",
                "args": [{"type": "input_value", "name": "SIZE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set pen size to %1",
            "description": {
                "type": "pen_setpensizeto",
                "args": [{"type": "input_value", "name": "SIZE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "change pen transparency by %1",
            "description": {
                "type": "pen_changepentransparencyby",
                "args": [{"type": "input_value", "name": "TRANSPARENCY"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set pen transparency to %1",
            "description": {
                "type": "pen_setpentransparencyto",
                "args": [{"type": "input_value", "name": "TRANSPARENCY"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },*/
        //=== sounds =======================================================
        {
            "template": "start sound %1",
            "description": {
                "type": "sound_play",
                "args": [{"type": "input_value", "name": "SOUND_MENU", "menu": "sound_sounds_menu"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "play sound %1 until done",
            "description": {
                "type": "sound_playuntildone",
                "args": [{"type": "input_value", "name": "SOUND_MENU", "menu": "sound_sounds_menu"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "stop all sounds",
            "description": {"type": "sound_stopallsounds", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "clear sound effects",
            "description": {"type": "sound_cleareffects", "shape": "statement"},
            "converter": universalBlockConverter
        },
        {
            "template": "change volume by %1",
            "description": {
                "type": "sound_changevolumeby",
                "args": [{"type": "input_value", "name": "VOLUME"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "set volume to %1 %",
            "description": {
                "type": "sound_setvolumeto",
                "args": [{"type": "input_value", "name": "VOLUME"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "volume",
            "description": {"type": "sound_volume", "shape": "reporterblock"},
            "converter": universalBlockConverter
        },
        //=== events =============================================================
        {
            "template": ["when gf clicked", "when greenflag clicked", "when green flag clicked", "when \u2691 clicked", "when flag clicked",],
            "description": {"type": "event_whenflagclicked", "args": [], "shape": "hatblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "when this sprite clicked",
            "description": {"type": "event_whenthisspriteclicked", "shape": "hatblock"},
            "converter": universalBlockConverter
        },
        {
            "template": "when backdrop switches to %1",
            "description": {
                "type": "event_whenbackdropswitchesto",
                "args": [{"type": "field_dropdown", "name": "BACKDROP", "options": [["backdrop1", "BACKDROP1"]]}],
                "shape": "hatblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["when %1 gt %2", "when %1 greater than %2", "when %1 > %2"],
            "description": {
                "type": "event_whengreaterthan",
                "args": [{
                    "type": "field_dropdown",
                    "name": "WHENGREATERTHANMENU",
                    "options": [["timer", "TIMER"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "hatblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "when %1 key pressed",
            "description": {
                "type": "event_whenkeypressed",
                "args": [{
                    "type": "field_dropdown",
                    "name": "KEY_OPTION",
                    "options": [["space", "space"], ["left arrow", "left arrow"], ["right arrow", "right arrow"], ["down arrow", "down arrow"], ["up arrow", "up arrow"], ["any", "any"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"]]
                }],
                "shape": "hatblock"
            },
            "converter": universalBlockConverter
        },
// =========================================================
// with the same text
// =========================================================
        {
            "template": "set %1 effect to %2",
            "description": {
                "type": "sound_seteffectto",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["pitch", "PITCH"], ["pan left/right", "PAN"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter,
            "predicate": looksSoundPredicate
        },
        {
            "template": "set %1 effect to %2",
            "description": {
                "type": "looks_seteffectto",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["color", "COLOR"], ["fisheye", "FISHEYE"], ["whirl", "WHIRL"], ["pixelate", "PIXELATE"], ["mosaic", "MOSAIC"], ["brightness", "BRIGHTNESS"], ["ghost", "GHOST"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "change %1 effect by %2",
            "description": {
                "type": "sound_changeeffectby",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["pitch", "PITCH"], ["pan left/right", "PAN"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter,
            "predicate": looksSoundPredicate
        },
        {
            "template": "change %1 effect by %2",
            "description": {
                "type": "looks_changeeffectby",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["color", "COLOR"], ["fisheye", "FISHEYE"], ["whirl", "WHIRL"], ["pixelate", "PIXELATE"], ["mosaic", "MOSAIC"], ["brightness", "BRIGHTNESS"], ["ghost", "GHOST"]]
                }, {"type": "input_value", "name": "CHANGE"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "length of %1",
            "description": {
                "type": "data_lengthoflist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "reporterblock"
            },
            "converter": listBlockConverter,
            "predicate": listOperatorPredicate
        }, {
            "template": "length of %1",
            "description": {
                "type": "operator_length",
                "args": [{"type": "input_value", "name": "STRING"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["%1 contains %2?", "%1 contains %2"],
            "description": {
                "type": "data_listcontainsitem",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}, {
                    "type": "input_value",
                    "name": "ITEM"
                }],
                "shape": "booleanblock"
            },
            "converter": listBlockConverter,
            "predicate": listOperatorPredicate
        },
        {
            "template": ["%1 contains %2?", "%1 contains %2"],
            "description": {
                "type": "operator_contains",
                "args": [{"type": "input_value", "name": "STRING1"}, {"type": "input_value", "name": "STRING2"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "%1 of %2",
            "description": {
                "type": "sensing_of",
                "args": [{
                    "type": "field_dropdown",
                    "name": "PROPERTY",
                    "options": [["x position", "x position"], ["y position", "y position"], ["direction", "direction"], ["costume #", "costume #"], ["costume name", "costume name"], ["size", "size"], ["volume", "volume"], ["backdrop #", "backdrop #"], ["backdrop name", "backdrop name"]],

                }, {"type": "input_value", "name": "OBJECT", 'menu': 'sensing_of_object_menu'}],
                "shape": "booleans"
            },
            "converter": function (ctx, visitor) {
                //something was weird here...
                addType(ctx, visitor, 'sensing_of')
                visitor.xml = visitor.xml.ele('field', {
                    'name': 'PROPERTY'
                }, visitor.infoVisitor.getString(ctx.argument[0])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
                visitor.xml = visitor.xml.up().ele('value', {
                    'name': 'OBJECT'
                });
                //no assignement bcs of visist
                visitor.xml.ele('shadow', {
                    'type': 'sensing_of_object_menu' //this was added to the json and was not default.
                }).ele('field', {
                    'name': 'OBJECT'
                }, visitor.infoVisitor.getString(ctx.argument[1])); // '_mouse_'
                visitor.xml = visitor.xml.up();
            },
            "predicate": function (ctx, visitor) {
                let argType = visitor.infoVisitor.getType(ctx.argument[1]);
                return (argType === CHOICE);
            }

        },
        {
            "template": "%1 of %2",
            "description": {
                "type": "operator_mathop",
                "args": [{
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [["abs", "abs"], ["floor", "floor"], ["ceiling", "ceiling"], ["sqrt", "sqrt"], ["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["asin", "asin"], ["acos", "acos"], ["atan", "atan"], ["ln", "ln"], ["log", "log"], ["e ^", "e ^"], ["10 ^", "10 ^"]]
                }, {"type": "input_value", "name": "NUM"}],
                "shape": "reporterblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "when I receive %1",
            "description": {
                "type": "event_whenbroadcastreceived",
                "args": [{
                    "type": "field_variable",
                    "name": "BROADCAST_OPTION",
                    "variabletypes": ["broadcast_msg"],
                    "variable": "message1"
                }],
                "shape": "hatblock"
            },
            "converter": messageBlockconverter
        },
        {
            "template": "broadcast %1",
            "description": {
                "type": "event_broadcast",
                "args": [{"type": "input_value", "name": "BROADCAST_INPUT"}],
                "shape": "statement"
            },
            "converter": messageShadowBlockconverter
        },
        {
            "template": "broadcast %1 and wait",
            "description": {
                "type": "event_broadcastandwait",
                "args": [{"type": "input_value", "name": "BROADCAST_INPUT"}],
                "shape": "statement"
            },
            "converter": messageShadowBlockconverter
        },
        {
            "template": "set %1 to %2",
            "description": {
                "type": "data_setvariableto",
                "args": [{"type": "field_variable", "name": "variable"}, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "change %1 by %2",
            "description": {
                "type": "data_changevariableby",
                "args": [{"type": "field_variable", "name": "variable"}, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "show variable %1",
            "description": {
                "type": "data_showvariable",
                "args": [{"type": "field_variable","name": "VARIABLE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "hide variable %1",
            "description": {
                "type": "data_hidevariable",
                "args": [{"type": "field_variable","name": "VARIABLE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "add %1 to %2",
            "description": {
                "type": "data_addtolist",
                "args": [{"type": "input_value", "name": "ITEM"}, {
                    "type": "field_variable",
                    "name": "LIST",
                    "variabletypes": ["list"]
                }],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "delete %1 of %2",
            "description": {
                "type": "data_deleteoflist",
                "args": [{"type": "input_value", "name": "INDEX"}, {
                    "type": "field_variable",
                    "name": "LIST",
                    "variabletypes": ["list"]
                }],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "insert %1 at %2 of %3",
            "description": {
                "type": "data_insertatlist",
                "args": [{"type": "input_value", "name": "ITEM"}, {
                    "type": "input_value",
                    "name": "INDEX"
                }, {"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "replace item %1 of %2 with %3",
            "description": {
                "type": "data_replaceitemoflist",
                "args": [{"type": "input_value", "name": "INDEX"}, {
                    "type": "field_variable",
                    "name": "LIST",
                    "variabletypes": ["list"]
                }, {"type": "input_value", "name": "ITEM"}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "item %1 of %2",
            "description": {
                "type": "data_itemoflist",
                "args": [{"type": "input_value", "name": "INDEX"}, {
                    "type": "field_variable",
                    "name": "LIST",
                    "variabletypes": ["list"]
                }],
                "shape": "booleans"
            },
            "converter": listBlockConverter
        },
        {
            "template": "show list %1",
            "description": {
                "type": "data_showlist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "hide list %1",
            "description": {
                "type": "data_hidelist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
// special case:stop
        {
            "template": "stop %1",
            "description": {
                "type": "control_stop",
                "args": [
                    {
                        "type": "field_dropdown",
                        "name": "STOP_OPTION",
                    }],
                "shape": "capblock",
            },
            "converter": stopConverter
        },

    ]
;

