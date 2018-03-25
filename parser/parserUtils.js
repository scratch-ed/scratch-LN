/**
 * Provide high level function to transform text to XML
 *
 * Perform lexing,parsing and visiting.
 *
 * @file   This files defines the parseTextToXML function.
 * @author Ellen Vanhove.
 */

import {parse} from './LNParserF'
import {XMLVisitor} from './XMLVisitor'
import {blockspecifications} from '../blockspecification/blockspecification'
import blocks from './blocks'

let visitor = XMLVisitor;

/**
 * init blocks with information from blockspecifications
 */
export function init_parser_utils() {
    console.log('parser utils called');
    // blockspecifications
    //generate the functions in blocks
    for (let x = 0; x < blockspecifications.length; x++) {
        let b = blockspecifications[x];
        if (Array.isArray(b['template'])) {
            let ts = b['template'];
            for (let t = 0; t < ts.length; t++) {
                //can this differently?
                /*blocks[b['template'][t]] = function (ctx, visitor) {
                    return b['converter'](ctx, visitor, b['description']);
                }*/
                createBlockEntry(b['template'][t], b)
            }
        } else {
            //console.log(typeof b['template']);
            /*blocks[b['template']] = function (ctx, visitor) {
                if(!b['predicate'] || b['predicate'](ctx,visitor)) {
                    return b['converter'](ctx, visitor, b['description']);
                }
            };*/
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
        blocks[templateString] = createBlockFunction(specification);
    } else {
        let higherDefinedSpecification = blocks[templateString];
        //wrap the previous one
        blocks[templateString] = function (ctx, visitor) {
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

init_parser_utils();

/**
 * todo: return error message in case something goes wrong
 * @param text
 * @returns xml or undefined
 */
export default function parseTextToXML(text,location=true) {
    let cst = getCst(text);
    if (cst) {
        let xml = execXmlVisitor(cst,location);
        //console.log(xml);
        return xml;
    }
}

function getCst(text) {
    let r = parse(text);
    return r.value;
}

function execXmlVisitor(cst,location) {
    let v = new visitor({
        x: 10,
        y: 10
    },location);
    let xml = v.getXML(cst);
    return xml;
}