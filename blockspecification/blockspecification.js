import {universalBlockConverter} from "../parser/blocks";

/**
 * Summary.
 *
 * Description.
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */

export const blockspecifications = [{
    "template": ["test","test2"],
    "description": {
        "type": "looks_gotofrontback",
        "args": [{"type": "field_dropdown", "name": "FRONT_BACK", "options": [["front", "front"], ["back", "back"]]}],
        "shape": "statement"
    },
    "converter": universalBlockConverter
}];