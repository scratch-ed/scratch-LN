/**
 * Specification of blocks.
 *
 * Specifications of the blocks. See wiki: https://github.com/scratch4d/scratch-LN/wiki/blockspecifications
 *
 * @file   This files defines the blockspecifications const.
 * @author Ellen Vanhove.
 */
import {universalBlockConverter} from "../parser/blocks";

/*
 {"template":"",
        "description": ,
            "converter": universalBlockConverter
        }

 */
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
                let arg = visitor.getString(ctx.argument[0]);
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
        {
            "template": ["pen down"],
            "description": {"type": "pen_pendown", "shape": "statement"},
            "converter": universalBlockConverter
        },
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
            "template": "%1 \\< %2",
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
            "template": "%1 \\> %2",
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
            "template": "touching %1?",
            "description": {
                "type": "sensing_touchingobject",
                "args": [{"type": "input_value", "name": "TOUCHINGOBJECTMENU", "menu": "sensing_touchingobjectmenu"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "touching color %1?",
            "description": {
                "type": "sensing_touchingcolor",
                "args": [{"type": "input_value", "name": "COLOR"}],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "color %1 is touching %2?",
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
            "template": "key %1 pressed?",
            "description": {
                "type": "sensing_keypressed",
                "args": [{
                    "type": "field_dropdown",
                    "name": "KEY_OPTION",
                    "options": [["space", "space"], ["left arrow", "left arrow"], ["right arrow", "right arrow"], ["down arrow", "down arrow"], ["up arrow", "up arrow"], ["any", "any"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"]]
                }],
                "shape": "booleanblock"
            },
            "converter": universalBlockConverter
        },
        {
            "template": "mouse down?",
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
            "template": ["turn cw %1 degrees","turn right %1 degrees"],
            "description": {
                "type": "motion_turnright",
                "args": [{"type": "input_value", "name": "DEGREES"}],
                "shape": "statement"
            },
            "converter": universalBlockConverter
        },
        {
            "template": ["turn ccw %1 degrees","turn left %1 degrees"],
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
            "template": "\\if on edge, bounce",
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
        }
    ]
;
