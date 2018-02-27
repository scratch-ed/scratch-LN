import {universalBlockConverter} from "../parser/blocks";
import blocks from "../parser/blocks";

/**
 * Specification of blocks.
 *
 * Specifications of the blocks. See wiki: https://github.com/scratch4d/scratch-LN/wiki/blockspecifications
 *
 * @file   This files defines the blockspecifications const.
 * @author Ellen Vanhove.
 */

export const blockspecifications = [{
    "template": ["test", "test2"],
    "description": {
        "type": "looks_gotofrontback",
        "args": [{"type": "field_dropdown", "name": "FRONT_BACK", "options": [["front", "front"], ["back", "back"]]}],
        "shape": "statement"
    },
    "converter": universalBlockConverter
}, {
    "template": ["pen"],
    "description": {"type": "pen_penup", "shape": "statement"},
    "converter": universalBlockConverter
}
];

