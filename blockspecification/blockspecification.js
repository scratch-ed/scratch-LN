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
        }
//==================================================================

    ]
;
