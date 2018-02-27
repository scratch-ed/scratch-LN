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
export function init_parser_utils(){
    console.log('parser utils called');
   // blockspecifications
    //generate the functions in blocks
    for(let x=0; x<blockspecifications.length;x++){
        let b = blockspecifications[x];
        if(Array.isArray(b['template'])) {
            let ts = b['template'];
            for(let t=0; t<ts.length;t++) {
                //can this differently?
                blocks[b['template'][t]] = function (ctx, visitor) {
                    return b['converter'](ctx, visitor, b['description']);
                }
            }
        }else{
            //console.log(typeof b['template']);
            blocks[b['template']] = function (ctx, visitor) {
                return b['converter'](ctx, visitor, b['description']);
            };

        }

    }
}

init_parser_utils();

/**
 * todo: return error message in case something goes wrong
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