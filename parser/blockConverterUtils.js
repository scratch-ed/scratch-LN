/**
 * Functions that structure the functions that generate the xml of the build-in blocks;.
 *
 * @file   This files defines the functions
 * @author Ellen Vanhove.
 */
import {blockspecifications} from "../blockspecification/blockspecification";
import {MODUS} from "./typeConfig";

let blocks = {};
//map of strings -> objects that look like
/**
 * WARNING: blocks with the same text are wrapped in the converter.
 * WARNING: currently only one modus for each block,
 * so should be relooked in case same string in two modusses can be used.
 * {
 *  converter: function that generates xml
 *  modus: see typeConfig, in which context can this block been build.
 * }
 */

export default blocks;

/**
 * init blocks with information from blockspecifications
 */
export function init_parser_utils() {
    // blockspecifications
    //generate the functions in blocks
    for (let x = 0; x < blockspecifications.length; x++) {
        let b = blockspecifications[x];
        if (Array.isArray(b['template'])) {
            let ts = b['template'];
            for (let t = 0; t < ts.length; t++) {
                createBlockEntry(b['template'][t], b)
            }
        } else {
            createBlockEntry(b['template'], b)

        }

    }

}

/**
 * adds an function element to blocks
 * @param templateString {String} to match so that the block from the definition is build
 * @param specification as defined in blockspecifications
 */
function createBlockEntry(templateString, specification) {
    //if the template has no converter assigned yet, there is no problem, just create it
    if (!blocks[templateString]) {
        blocks[templateString] = {};
        blocks[templateString].converter = createBlockFunction(specification);
        let modus;
        switch (specification.shape) {
            case "booleanblock":
                modus = MODUS.BOOLEAN;
                break;
            case "reporterblock":
                modus=MODUS.REPORTER;
                break;
            default:
                modus = MODUS.STACK;
        }

        blocks[templateString].modus = modus;

    } else {
        let higherDefinedSpecification = blocks[templateString].converter;
        //wrap the previous one
        blocks[templateString].converter = function (ctx, visitor) {
            //if it not succeeds
            let first_call_executed = higherDefinedSpecification(ctx, visitor);
            if (!first_call_executed) {
                //Call the next one
                return createBlockFunction(specification)(ctx, visitor);
            }
            return first_call_executed;
        }
    }
}

/**
 * creates a function that can be called with (ctx,visitor)
 * it creates xml based on the specifications by calling the converter function if the predicate is true
 * @param specification object as defined in the file blockspecifications
 * @returns {Function}
 */
function createBlockFunction(specification) {
    let b = specification;
    return function (ctx, visitor) {
        if (!b['predicate'] || b['predicate'](ctx, visitor)) {
            b['converter'](ctx, visitor, b['description']);
            return true;
        }
        return false;
    };

}