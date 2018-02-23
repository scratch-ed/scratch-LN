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

let visitor = XMLVisitor;

/**
 * todo: return error message in case something goos wrong
 * @param text
 * @returns xml or undefined
 */
export default function parseTextToXML(text) {
    let cst = getCst(text);
    if (cst) {
        let xml = execXmlVisitor(cst);
        //console.log(xml);
        return xml;
    }
}

function getCst(text) {
    let r = parse(text);
    return r.value;
}

function execXmlVisitor(cst) {
    let v = new visitor({
        x: 10,
        y: 10
    });
    let xml = v.getXML(cst);
    return xml;
}