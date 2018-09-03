/**
 * Utilities for converting to and from typeConfigs.
 *
 * string -> type etc.
 *
 * @file   This files defines the stringToinputType
 * @author Ellen Vanhove.
 */
import {INPUTTYPE} from "./typeConfig";

export const stringInputTypeMap = {
    "text": INPUTTYPE.text,
    "math_number": INPUTTYPE.NUMBER,
    "math_angle": INPUTTYPE.ANGLE,
    "math_integer": INPUTTYPE.INTEGER,
    "math_positive_number": INPUTTYPE.POSITIVE_NUMBER,
    "math_whole_number": INPUTTYPE.WHOLE_NUMBER,
    "colour_picker": INPUTTYPE.COLOR
};

/**
 * maps a string of an inputtype to an inputtype
 * @param text string textual version of inputtype
 * @returns {*}
 */
export function stringToinputType(text) {
    if (stringInputTypeMap[text]) {
        return stringInputTypeMap[text];
    } else {
        return INPUTTYPE.NONE;
    }
}


/**
 * returns whether a certain text matches an certain inputtype
 * text should already have "" or other things removed.
 * Ofcourse for color # is part of the color code definition so this should remain.
 * @param text an text
 * @param type an inputType
 * @returns {boolean}
 */
export function verifyInputType(text, type) {
    switch (type) {
        case INPUTTYPE.NUMBER://fallthrough (for now?)
        case INPUTTYPE.ANGLE:
            return !/[^0-9.]/i.test(text);
        case INPUTTYPE.INTEGER:
            return !/\./i.test(text);
        case INPUTTYPE.WHOLE_NUMBER:
            if (/\./i.test(text)) {
                return false;
            }
        //fallthrough
        case INPUTTYPE.POSITIVE_NUMBER:
            if (/[^0-9.]/i.test(text)) {
                return false;
            }
            let num = parseFloat(text); // "1a1" is parsed to 1 "a" is parsed to nan
            return num >= 0;

        case INPUTTYPE.COLOR:
            return /#[0-F]{6}/i.test(text);
        case INPUTTYPE.NONE: //everything is ok if no inputtype is specified
        case INPUTTYPE.TEXT:
            return true;
        case INPUTTYPE.BOOLEAN:
        case INPUTTYPE.DROPDOWN:
        default:
            return null; //not specified, not enough information based only on the text
    }
}

/**
 * return the type and name of the tags related to the inputtype
 * @param inputType
 * @returns {*}
 */
export function getXMLTags(inputType) {
    switch (inputType) {
        case INPUTTYPE.NONE: //none is treated as text.
        case INPUTTYPE.TEXT:
            return {type: 'text', name: 'TEXT'};
        case INPUTTYPE.NUMBER:
            return {type: 'math_number', name: 'NUM'};
        case INPUTTYPE.ANGLE:
            return {type: 'math_angle', name: 'NUM'};
        case INPUTTYPE.INTEGER:
            return {type: 'math_integer', name: 'NUM'};
        case INPUTTYPE.WHOLE_NUMBER:
            return {type: 'math_whole_number', name: 'NUM'};
        case INPUTTYPE.POSITIVE_NUMBER:
            return {type: 'math_positive_number', name: 'NUM'};
        case INPUTTYPE.COLOR:
            return {type: 'colour_picker', name: 'COLOUR'};
        case INPUTTYPE.BOOLEAN:
        case INPUTTYPE.DROPDOWN:
        default:
            return null;
    }
}