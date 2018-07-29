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
    "text":INPUTTYPE.text,
    "math_number":INPUTTYPE.NUMBER,
    "math_angle":INPUTTYPE.ANGLE,
    "math_integer":INPUTTYPE.INTEGER,
    "math_positive_number":INPUTTYPE.POSITIVE_NUMBER,
    "math_whole_number":INPUTTYPE.WHOLE_NUMBER,
    "colour_picker":INPUTTYPE.DROPDOWN
};

export function stringToinputType(text){
    if(stringInputTypeMap[text]){
        return stringInputTypeMap[text];
    }else{
        return INPUTTYPE.NONE;
    }
}