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
export default function parseTextToXML(text,location={
        x: 10,
        y: 10
    }) {
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
    let v = new visitor(location);
    let xml = v.getXML(cst);
    return xml;
}