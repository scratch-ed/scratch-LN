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
} from "../parser/blocksConverter";
import {CHOICE, COLOR} from "../parser/infoLNVisitor";

/*
 {      "template":"" or [""],
        "description": {
            type:
            args:[
                    {
                        type
                        name
                        options (for rectangle drop downs)
                        menu (for round dropdown)
                        "check": "Boolean" (optional for boolean input)
                        shadowType: default text
                    }
                 ]
            shape: one of statement/reporterblock/booleanblock/hatblock/capblock
        }

        blockConverter: function(ctx, visitor, structure) default:universalblockconverter
        predicate:  function (ctx, visitor) default: always true
        generator: stopConverter(block)default: something universal (not used)
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
            "template": ["go to %1","go to %1 layer"],
            "description": {
                "opcode": "looks_gotofrontback",
                "args": [{
                    "type": "field_dropdown",
                    "name": "FRONT_BACK",
                    "options": [["front", "front"], ["back", "back"]]
                }],
                "shape": "statement"
            },
            "predicate": (ctx, visitor) => {
                let arg = visitor.infoVisitor.getString(ctx.argument[0]);
                return (arg === 'front' || arg === 'back');
            }

        },
        {
            "template": ["go to %1"],
            "description": {
                "opcode": "motion_goto",
                "args": [{"type": "input_value", "name": "TO", "menu": "motion_goto_menu"}],
                "shape": "statement"
            },
        },
        /*{
            "template": ["pen down"],
            "description": {"opcode": "pen_pendown", "shape": "statement"}
        },*/
        {
            "template": ["say %1"],
            "description": {
                "opcode": "looks_say",
                "args": [{"type": "input_value", "name": "MESSAGE"}],
                "shape": "statement"
            }
        }, {
            "template": "go to x: %1 y: %2",
            "description": {
                "opcode": "motion_gotoxy",
                "args": [
                    {"type": "input_value", "name": "X","shadowType":"math_number"},
                    {"type": "input_value", "name": "Y","shadowType":"math_number"}],
                "shape": "statement"
            }
        }, {
            "template": "set rotation style %1",
            "description": {
                "opcode": "motion_setrotationstyle",
                "args": [{
                    "type": "field_dropdown",
                    "name": "STYLE",
                    "options": [["left-right", "left-right"], ["don't rotate", "don't rotate"], ["all around", "all around"]]
                }],
                "shape": "statement"
            }
        }, {
            "template": "%1 + %2",
            "description": {
                "opcode": "operator_add",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            }
        }, {
            "template": "not %1",
            "description": {
                "opcode": "operator_not",
                "args": [{"type": "input_value", "name": "OPERAND", "check": "Boolean"}],
                "shape": "booleanblock"
            }
        },

//==== operator ===================================================
        {
            "template": "%1 - %2",
            "description": {
                "opcode": "operator_subtract",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "%1 * %2",
            "description": {
                "opcode": "operator_multiply",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "%1 / %2",
            "description": {
                "opcode": "operator_divide",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "pick random %1 to %2",
            "description": {
                "opcode": "operator_random",
                "args": [{"type": "input_value", "name": "FROM"}, {"type": "input_value", "name": "TO"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": ["%1 lt %2", "%1 < %2", "%1 less than %2"],
            "description": {
                "opcode": "operator_lt",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": ["%1 = %2","%1 eq %2","%1 equals %2",],
            "description": {
                "opcode": "operator_equals",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": ["%1 gt %2", "%1 > %2", "%1 greater than %2"],
            "description": {
                "opcode": "operator_gt",
                "args": [{"type": "input_value", "name": "OPERAND1"}, {"type": "input_value", "name": "OPERAND2"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": "%1 and %2",
            "description": {
                "opcode": "operator_and",
                "args": [{"type": "input_value", "name": "OPERAND1", "check": "Boolean"}, {
                    "type": "input_value",
                    "name": "OPERAND2",
                    "check": "Boolean"
                }],
                "shape": "booleanblock"
            }
        },
        {
            "template": "%1 or %2",
            "description": {
                "opcode": "operator_or",
                "args": [{"type": "input_value", "name": "OPERAND1", "check": "Boolean"}, {
                    "type": "input_value",
                    "name": "OPERAND2",
                    "check": "Boolean"
                }],
                "shape": "booleanblock"
            }
        },
        {
            "template": "join %1 %2",
            "description": {
                "opcode": "operator_join",
                "args": [{"type": "input_value", "name": "STRING1"}, {"type": "input_value", "name": "STRING2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "letter %1 of %2",
            "description": {
                "opcode": "operator_letter_of",
                "args": [{"type": "input_value", "name": "LETTER"}, {"type": "input_value", "name": "STRING"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "%1 mod %2",
            "description": {
                "opcode": "operator_mod",
                "args": [{"type": "input_value", "name": "NUM1"}, {"type": "input_value", "name": "NUM2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "round %1",
            "description": {
                "opcode": "operator_round",
                "args": [{"type": "input_value", "name": "NUM"}],
                "shape": "reporterblock"
            }
        },
//=== control ===============================================================
        {
            "template": "wait %1 seconds",
            "description": {
                "opcode": "control_wait",
                "args": [{"type": "input_value", "name": "DURATION"}],
                "shape": "statement"
            }
        },
        {
            "template": "wait until %1",
            "description": {
                "opcode": "control_wait_until",
                "args": [{"type": "input_value", "name": "CONDITION", "check": "Boolean"}],
                "shape": "statement"
            }
        },
        {
            "template": "when I start as a clone",
            "description": {"opcode": "control_start_as_clone", "args": [], "shape": "hatblock"}
        },
        {
            "template": "create clone of %1",
            "description": {
                "opcode": "control_create_clone_of",
                "args": [{"type": "input_value", "name": "CLONE_OPTION", "menu": "control_create_clone_of_menu"}],
                "shape": "statement"
            }
        },
        {
            "template": "delete this clone",
            "description": {"opcode": "control_delete_this_clone", "args": [], "shape": "capblock"}
        },
//=== sensing ===============================================================
        {
            "template": ["touching %1?", "touching %1"],
            "description": {
                "opcode": "sensing_touchingobject",
                "args": [{"type": "input_value", "name": "TOUCHINGOBJECTMENU", "menu": "sensing_touchingobjectmenu"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": ["touching color %1?", "touching color %1"],
            "description": {
                "opcode": "sensing_touchingcolor",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": ["color %1 is touching %2?", "color %1 is touching %2"],
            "description": {
                "opcode": "sensing_coloristouchingcolor",
                "args": [{"type": "input_value", "name": "COLOR"}, {"type": "input_value", "name": "COLOR2"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": "distance to %1",
            "description": {
                "opcode": "sensing_distanceto",
                "args": [{"type": "input_value", "name": "DISTANCETOMENU", "menu": "sensing_distancetomenu"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "ask %1 and wait",
            "description": {
                "opcode": "sensing_askandwait",
                "args": [{"type": "input_value", "name": "QUESTION"}],
                "shape": "statement"
            }
        },
        {
            "template": "answer",
            "description": {"opcode": "sensing_answer", "shape": "reporterblock"}
        },
        {
            "template": ["key %1 pressed?", "key %1 pressed"],
            "description": {
                "opcode": "sensing_keypressed",
                "args": [{
                    "type": "input_value",
                    "name": "KEY_OPTION",
                    "options": [["space", "space"], ["left arrow", "left arrow"], ["right arrow", "right arrow"], ["down arrow", "down arrow"], ["up arrow", "up arrow"], ["any", "any"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"]],
                    "menu": "sensing_keyoptions"
                }],
                "shape": "booleanblock"
            }
        },
        {
            "template": ["mouse down?", "mouse down"],
            "description": {"opcode": "sensing_mousedown", "shape": "booleanblock"}
        },
        {
            "template": "mouse x",
            "description": {"opcode": "sensing_mousex", "shape": "reporterblock"}
        },
        {
            "template": "mouse y",
            "description": {"opcode": "sensing_mousey", "shape": "reporterblock"}
        },
        {
            "template": "set drag mode %1",
            "description": {
                "opcode": "sensing_setdragmode",
                "args": [{
                    "type": "field_dropdown",
                    "name": "DRAG_MODE",
                    "options": [["draggable", "draggable"], ["not draggable", "not draggable"]]
                }],
                "shape": "statement"
            }
        },
        {
            "template": "loudness",
            "description": {"opcode": "sensing_loudness", "shape": "reporterblock"}
        },
        {
            "template": "video %1 on %2",
            "description": {
                "opcode": "sensing_videoon",
                "args": [{"type": "input_value", "name": "VIDEOONMENU1"}, {"type": "input_value", "name": "VIDEOONMENU2"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "turn video %1",
            "description": {
                "opcode": "sensing_videotoggle",
                "args": [{"type": "input_value", "name": "VIDEOTOGGLEMENU"}],
                "shape": "statement"
            }
        },
        {
            "template": "set video transparency to %1%",
            "description": {
                "opcode": "sensing_setvideotransparency",
                "args": [{"type": "input_value", "name": "TRANSPARENCY"}],
                "shape": "statement"
            }
        },
        {
            "template": "timer",
            "description": {"opcode": "sensing_timer", "shape": "reporterblock"}
        },
        {
            "template": "reset timer",
            "description": {"opcode": "sensing_resettimer", "shape": "statement"}
        },
        {
            "template": "current %1",
            "description": {
                "opcode": "sensing_current",
                "args": [{
                    "type": "field_dropdown",
                    "name": "CURRENTMENU",
                    "options": [["year", "YEAR"], ["month", "MONTH"], ["date", "DATE"], ["day of week", "DAYOFWEEK"], ["hour", "HOUR"], ["minute", "MINUTE"], ["second", "SECOND"]]
                }],
                "shape": "reporterblock"
            }
        },
        {
            "template": "days since 2000",
            "description": {"opcode": "sensing_dayssince2000", "shape": "reporterblock"}
        },
        {
            "template": "username",
            "description": {"opcode": "sensing_username", "shape": "reporterblock"}
        },


//=== motion  ===============================================================
        {
            "template": "move %1 steps",
            "description": {
                "opcode": "motion_movesteps",
                "args": [{"type": "input_value", "name": "STEPS"}],
                "shape": "statement"
            }
        },
        {
            "template": ["turn right %1 degrees", "turn cw %1 degrees", "turn clockwise %1 degrees", "turn \u21BB %1 degrees"],
            "description": {
                "opcode": "motion_turnright",
                "args": [{"type": "input_value", "name": "DEGREES"}],
                "shape": "statement"
            }
        },
        {
            "template": ["turn left %1 degrees", "turn ccw %1 degrees", "turn counterclockwise %1 degrees",
                "turn anticlockwise %1 degrees", "turn acw %1 degrees", "turn \u21BA %1 degrees",],
            "description": {
                "opcode": "motion_turnleft",
                "args": [{"type": "input_value", "name": "DEGREES"}],
                "shape": "statement"
            }
        },
        {
            "template": "point in direction %1",
            "description": {
                "opcode": "motion_pointindirection",
                "args": [{"type": "input_value", "name": "DIRECTION"}],
                "shape": "statement"
            }
        },
        {
            "template": "point towards %1",
            "description": {
                "opcode": "motion_pointtowards",
                "args": [{"type": "input_value", "name": "TOWARDS", "menu": "motion_pointtowards_menu"}],
                "shape": "statement"
            }
        },
        {
            "template": "glide %1 secs to x: %2 y: %3",
            "description": {
                "opcode": "motion_glidesecstoxy",
                "args": [{"type": "input_value", "name": "SECS"}, {
                    "type": "input_value",
                    "name": "X"
                }, {"type": "input_value", "name": "Y"}],
                "shape": "statement"
            }
        },
        {
            "template": "glide %1 secs to %2",
            "description": {
                "opcode": "motion_glideto",
                "args": [{"type": "input_value", "name": "SECS"}, {
                    "type": "input_value",
                    "name": "TO",
                    "menu": "motion_glideto_menu"
                }],
                "shape": "statement"
            }
        },
        {
            "template": "change x by %1",
            "description": {
                "opcode": "motion_changexby",
                "args": [{"type": "input_value", "name": "DX"}],
                "shape": "statement"
            }
        },
        {
            "template": "set x to %1",
            "description": {"opcode": "motion_setx", "args": [{"type": "input_value", "name": "X"}], "shape": "statement"}
        },
        {
            "template": "change y by %1",
            "description": {
                "opcode": "motion_changeyby",
                "args": [{"type": "input_value", "name": "DY"}],
                "shape": "statement"
            }
        },
        {
            "template": "set y to %1",
            "description": {"opcode": "motion_sety", "args": [{"type": "input_value", "name": "Y"}], "shape": "statement"}
        },
        {
            "template": ["if on edge, bounce","bounce on edge"],
            "description": {"opcode": "motion_ifonedgebounce", "shape": "statement"}
        },
        {
            "template": "x position",
            "description": {"opcode": "motion_xposition", "shape": "reporterblock"}
        },
        {
            "template": "y position",
            "description": {"opcode": "motion_yposition", "shape": "reporterblock"}
        },
        {
            "template": "direction",
            "description": {"opcode": "motion_direction", "shape": "reporterblock"}
        },
//=== looks ======================================
        {
            "template": "say %1 for %2 seconds",
            "description": {
                "opcode": "looks_sayforsecs",
                "args": [{"type": "input_value", "name": "MESSAGE"}, {"type": "input_value", "name": "SECS"}],
                "shape": "statement"
            }
        },
        {
            "template": "think %1 for %2 seconds",
            "description": {
                "opcode": "looks_thinkforsecs",
                "args": [{"type": "input_value", "name": "MESSAGE"}, {"type": "input_value", "name": "SECS"}],
                "shape": "statement"
            }
        },
        {
            "template": "think %1",
            "description": {
                "opcode": "looks_think",
                "args": [{"type": "input_value", "name": "MESSAGE"}],
                "shape": "statement"
            }
        },
        {
            "template": "show",
            "description": {"opcode": "looks_show", "shape": "statement"}
        },
        {
            "template": "hide",
            "description": {"opcode": "looks_hide", "shape": "statement"}
        },
        {
            "template": "clear graphic effects",
            "description": {"opcode": "looks_cleargraphiceffects", "shape": "statement"}
        },
        {
            "template": "change size by %1",
            "description": {
                "opcode": "looks_changesizeby",
                "args": [{"type": "input_value", "name": "CHANGE"}],
                "shape": "statement"
            }
        },
        {
            "template": "set size to %1 %",
            "description": {
                "opcode": "looks_setsizeto",
                "args": [{"type": "input_value", "name": "SIZE"}],
                "shape": "statement"
            }
        },
        {
            "template": "size",
            "description": {"opcode": "looks_size", "shape": "reporterblock"}
        },
        {
            "template": "switch costume to %1",
            "description": {
                "opcode": "looks_switchcostumeto",
                "args": [{"type": "input_value", "name": "COSTUME", "menu": "looks_costume"}],
                "shape": "statement"
            }
        },
        {
            "template": "next costume",
            "description": {"opcode": "looks_nextcostume", "shape": "statement"}
        },
        {
            "template": "switch backdrop to %1",
            "description": {
                "opcode": "looks_switchbackdropto",
                "args": [{"type": "input_value", "name": "BACKDROP", "menu": "looks_backdrops"}],
                "shape": "statement"
            }
        },
        {
            "template": "go %1 %2 layers",
            "description": {
                "opcode": "looks_goforwardbackwardlayers",
                "args": [{
                    "type": "field_dropdown",
                    "name": "FORWARD_BACKWARD",
                    "options": [["forward", "forward"], ["backward", "backward"]]
                }, {"type": "input_value", "name": "NUM"}],
                "shape": "statement"
            }
        },
        {
            "template": "backdrop %1",
            "description": {
                "opcode": "looks_backdropnumbername",
                "args": [{
                    "type": "field_dropdown",
                    "name": "NUMBER_NAME",
                    "options": [["number", "number"], ["name", "name"]]
                }],
                "shape": "reporterblock"
            }
        },
        {
            "template": "costume %1",
            "description": {
                "opcode": "looks_costumenumbername",
                "args": [{
                    "type": "field_dropdown",
                    "name": "NUMBER_NAME",
                    "options": [["number", "number"], ["name", "name"]]
                }],
                "shape": "reporterblock"
            }
        },
        {
            "template": "switch backdrop to %1 and wait",
            "description": {
                "opcode": "looks_switchbackdroptoandwait",
                "args": [{"type": "input_value", "name": "BACKDROP", "menu": "looks_backdrops"}],
                "shape": "statement"
            }
        },
        {
            "template": "next backdrop",
            "description": {"opcode": "looks_nextbackdrop", "shape": "statement"}
        },
        //=== sounds =======================================================
        {
            "template": "start sound %1",
            "description": {
                "opcode": "sound_play",
                "args": [{"type": "input_value", "name": "SOUND_MENU", "menu": "sound_sounds_menu"}],
                "shape": "statement"
            }
        },
        {
            "template": "play sound %1 until done",
            "description": {
                "opcode": "sound_playuntildone",
                "args": [{"type": "input_value", "name": "SOUND_MENU", "menu": "sound_sounds_menu"}],
                "shape": "statement"
            }
        },
        {
            "template": "stop all sounds",
            "description": {"opcode": "sound_stopallsounds", "shape": "statement"}
        },
        {
            "template": "clear sound effects",
            "description": {"opcode": "sound_cleareffects", "shape": "statement"}
        },
        {
            "template": "change volume by %1",
            "description": {
                "opcode": "sound_changevolumeby",
                "args": [{"type": "input_value", "name": "VOLUME"}],
                "shape": "statement"
            }
        },
        {
            "template": "set volume to %1 %",
            "description": {
                "opcode": "sound_setvolumeto",
                "args": [{"type": "input_value", "name": "VOLUME"}],
                "shape": "statement"
            }
        },
        {
            "template": "volume",
            "description": {"opcode": "sound_volume", "shape": "reporterblock"}
        },
        //=== events =============================================================
        {
            "template": ["when gf clicked", "when greenflag clicked", "when green flag clicked", "when \u2691 clicked", "when flag clicked",],
            "description": {"opcode": "event_whenflagclicked", "args": [], "shape": "hatblock"}
        },
        {
            "template": "when this sprite clicked",
            "description": {"opcode": "event_whenthisspriteclicked", "shape": "hatblock"}
        },
        {
            "template": "when backdrop switches to %1",
            "description": {
                "opcode": "event_whenbackdropswitchesto",
                "args": [{"type": "field_dropdown", "name": "BACKDROP", "options": [["backdrop1", "BACKDROP1"]]}],
                "shape": "hatblock"
            }
        },
        {
            "template": ["when %1 gt %2", "when %1 greater than %2", "when %1 > %2"],
            "description": {
                "opcode": "event_whengreaterthan",
                "args": [{
                    "type": "field_dropdown",
                    "name": "WHENGREATERTHANMENU",
                    "options": [["timer", "TIMER"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "hatblock"
            }
        },
        {
            "template": "when %1 key pressed",
            "description": {
                "opcode": "event_whenkeypressed",
                "args": [{
                    "type": "field_dropdown",
                    "name": "KEY_OPTION",
                    "options": [["space", "space"], ["left arrow", "left arrow"], ["right arrow", "right arrow"], ["down arrow", "down arrow"], ["up arrow", "up arrow"], ["any", "any"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"]]
                }],
                "shape": "hatblock"
            }
        },
// =========================================================
// with the same text
// =========================================================
        {
            "template": "set %1 effect to %2",
            "description": {
                "opcode": "sound_seteffectto",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["pitch", "PITCH"], ["pan left/right", "PAN"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "predicate": looksSoundPredicate
        },
        {
            "template": "set %1 effect to %2",
            "description": {
                "opcode": "looks_seteffectto",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["color", "COLOR"], ["fisheye", "FISHEYE"], ["whirl", "WHIRL"], ["pixelate", "PIXELATE"], ["mosaic", "MOSAIC"], ["brightness", "BRIGHTNESS"], ["ghost", "GHOST"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            }
        },
        {
            "template": "change %1 effect by %2",
            "description": {
                "opcode": "sound_changeeffectby",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["pitch", "PITCH"], ["pan left/right", "PAN"]]
                }, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "predicate": looksSoundPredicate
        },
        {
            "template": "change %1 effect by %2",
            "description": {
                "opcode": "looks_changeeffectby",
                "args": [{
                    "type": "field_dropdown",
                    "name": "EFFECT",
                    "options": [["color", "COLOR"], ["fisheye", "FISHEYE"], ["whirl", "WHIRL"], ["pixelate", "PIXELATE"], ["mosaic", "MOSAIC"], ["brightness", "BRIGHTNESS"], ["ghost", "GHOST"]]
                }, {"type": "input_value", "name": "CHANGE"}],
                "shape": "statement"
            }
        },
        {
            "template": "length of %1",
            "description": {
                "opcode": "data_lengthoflist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "reporterblock"
            },
            "converter": listBlockConverter,
            "predicate": listOperatorPredicate
        }, {
            "template": "length of %1",
            "description": {
                "opcode": "operator_length",
                "args": [{"type": "input_value", "name": "STRING"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": ["%1 contains %2?", "%1 contains %2"],
            "description": {
                "opcode": "data_listcontainsitem",
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
                "opcode": "operator_contains",
                "args": [{"type": "input_value", "name": "STRING1"}, {"type": "input_value", "name": "STRING2"}],
                "shape": "booleanblock"
            }
        },
        {
            "template": "%1 of %2",
            "description": {
                "opcode": "sensing_of",
                "args": [{
                    "type": "field_dropdown",
                    "name": "PROPERTY",
                    "options": [["x position", "x position"], ["y position", "y position"], ["direction", "direction"], ["costume #", "costume #"], ["costume name", "costume name"], ["size", "size"], ["volume", "volume"], ["backdrop #", "backdrop #"], ["backdrop name", "backdrop name"]],

                }, {"type": "input_value", "name": "OBJECT", 'menu': 'sensing_of_object_menu'}],
                "shape": "reporterblock"
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
                "opcode": "operator_mathop",
                "args": [{
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [["abs", "abs"], ["floor", "floor"], ["ceiling", "ceiling"], ["sqrt", "sqrt"], ["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["asin", "asin"], ["acos", "acos"], ["atan", "atan"], ["ln", "ln"], ["log", "log"], ["e ^", "e ^"], ["10 ^", "10 ^"]]
                }, {"type": "input_value", "name": "NUM"}],
                "shape": "reporterblock"
            }
        },
        {
            "template": "when I receive %1",
            "description": {
                "opcode": "event_whenbroadcastreceived",
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
                "opcode": "event_broadcast",
                "args": [{"type": "input_value", "name": "BROADCAST_INPUT"}],
                "shape": "statement"
            },
            "converter": messageShadowBlockconverter
        },
        {
            "template": "broadcast %1 and wait",
            "description": {
                "opcode": "event_broadcastandwait",
                "args": [{"type": "input_value", "name": "BROADCAST_INPUT"}],
                "shape": "statement"
            },
            "converter": messageShadowBlockconverter
        },
        {
            "template": "set %1 to %2",
            "description": {
                "opcode": "data_setvariableto",
                "args": [{"type": "field_variable", "name": "VARIABLE"}, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "change %1 by %2",
            "description": {
                "opcode": "data_changevariableby",
                "args": [{"type": "field_variable", "name": "VARIABLE"}, {"type": "input_value", "name": "VALUE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "show variable %1",
            "description": {
                "opcode": "data_showvariable",
                "args": [{"type": "field_variable","name": "VARIABLE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "hide variable %1",
            "description": {
                "opcode": "data_hidevariable",
                "args": [{"type": "field_variable","name": "VARIABLE"}],
                "shape": "statement"
            },
            "converter": variableBlockConverter
        },
        {
            "template": "add %1 to %2",
            "description": {
                "opcode": "data_addtolist",
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
                "opcode": "data_deleteoflist",
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
                "opcode": "data_insertatlist",
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
                "opcode": "data_replaceitemoflist",
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
                "opcode": "data_itemoflist",
                "args": [{"type": "input_value", "name": "INDEX"}, {
                    "type": "field_variable",
                    "name": "LIST",
                    "variabletypes": ["list"]
                }],
                "shape": "reporterblock"
            },
            "converter": listBlockConverter
        },
        {
            "template": "item # of %1 in %2",
            "description": {
                "opcode": "data_itemnumoflist",
                "args": [
                    {
                        "type": "input_value",
                        "name": "ITEM"
                    },
                    {
                        "type": "field_variable",
                        "name": "LIST",
                        "variableTypes":  ["list"]
                    }
                ],
                "shape": "reporterblock"
            },
            "converter": listBlockConverter
        },

        {
            "template": "show list %1",
            "description": {
                "opcode": "data_showlist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
        {
            "template": "hide list %1",
            "description": {
                "opcode": "data_hidelist",
                "args": [{"type": "field_variable", "name": "LIST", "variabletypes": ["list"]}],
                "shape": "statement"
            },
            "converter": listBlockConverter
        },
// special case:stop
        {
            "template": "stop %1",
            "description": {
                "opcode": "control_stop",
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

