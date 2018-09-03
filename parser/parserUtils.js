/**
 * Provide high level function to transform text to XML
 *
 * Perform lexing,parsing and visiting.
 *
 * @file   This files defines the parseTextToXML function.
 * @author Ellen Vanhove.
 */

import {parse} from './LNParser'
import {XMLLNVisitor} from './XMLLNVisitor'
import {init_parser_utils} from "./blockConverterUtils";

const visitor = XMLLNVisitor;

//todo make this return a value and not just some global value
init_parser_utils();

//////////////////////////////////////////////////////////////////
// public functions
//////////////////////////////////////////////////////////////////

/**
 * @param text
 * @param location boolean indicating an location is added to top blocks
 * @returns xml or undefined
 */
export default function parseTextToXML(text) {
    let r = parse(text);
    let cst = r.value;
    if (cst) {
        let v = new visitor();
        let xml = v.getXML(cst).xml;
        return xml;
    }
}

/**
 * @param text
 * @returns object with xml and error/warning information
 */
export function parseTextToXMLWithWarnings(text) {
    let r = parse(text);
    let cst = r.value;
    if (cst) {
        let v = new visitor();
        let ret = v.getXML(cst);
        return {
            xml: ret.xml,
            lexErrors: r.lexErrors,
            parseErrors: r.parseErrors,
            visitorWarnings: ret.warnings,
        };
    }else{
        return {
            lexErrors: r.lexErrors,
            parseErrors: r.parseErrors
        };
    }
}

