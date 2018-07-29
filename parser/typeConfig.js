/**
 * Summary.
 *
 * Description.
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */

//related to the parser
export const MODUS = {
    NONE: 0,
    STACK: 1,
    REPORTER: 2,
    BOOLEAN: 3,
};

//input types in Scratch 3.0
export const INPUTTYPE = {
    NONE: 0,
    BOOLEAN: 1, //boolean check
    TEXT: 2, //text and numbers
    NUMBER: 3, //math_number(no specs)
    ANGLE: 4,// math_angle(nice view)
    INTEGER: 5,// math_integer(-1,0,1)
    POSITIVE_NUMBER: 6, //math_positive_number(0,0.1,1)
    WHOLE_NUMBER: 7,// math_whole_number(0,1,2)
    COLOR: 8, //colour_picker
    DROPDOWN: 9, // does not map to one specific type
};

//block types in scratch
export const BLOCKTYPE = {
    NONE: 0,
    STATEMENT: 1,
    REPORTER: 2,
    BOOLEAN: 3,
    HATBLOCK: 4,
    CAPBLOCK: 5
};

//categories of the blocks
export const CATEGORY = {
    NONE: 0,
    VARIABLES: 1,
    MYBLOCK: 2,
    //todo add others

};