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

/**
 * maps a string of an inputtype to an inputtype
 * @param text string textual version of inputtype
 * @returns {*}
 */
export function stringToinputType(text){
    if(stringInputTypeMap[text]){
        return stringInputTypeMap[text];
    }else{
        return INPUTTYPE.NONE;
    }
}




/**
 * returns whether a certain text matches an certain inputtype
 * @param text an text
 * @param type an inputType
 * @returns {boolean}
 */
export function verifyInputType(text,type){
    switch (type){
            case INPUTTYPE.NONE:
                return false;
            case INPUTTYPE.BOOLEAN:
                return false;
            case INPUTTYPE.TEXT:
                return true;
            case INPUTTYPE.NUMBER:
            case INPUTTYPE.ANGLE:
                return !/[^0-9.]/i.test(text);
            case INPUTTYPE.INTEGER:
                return !/\./i.test(text);
            case INPUTTYPE.WHOLE_NUMBER:
                if(/\./i.test(text)){
                    return false;
                }
                //fallthrough
            case INPUTTYPE.POSITIVE_NUMBER:
                let num;
                try{
                    num=parseInt(text);
                }catch(e){
                    return false;
                }
                return num>=0;
            case INPUTTYPE.COLOR:
                return /#[0-F]{6}/i.test(text);
            case INPUTTYPE.DROPDOWN:
                return false;
    }
}