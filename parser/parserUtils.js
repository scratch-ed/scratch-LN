import myGrammar from './grammar.js'

var {
    lexer,
    parser,
    visitor,
} = myGrammar()


export default function parseTextToXML(text) {
    var cst = getCst(text);
    if (cst) {
        var xml = execXmlVisitor(cst);
        return xml;
    }
}

function getCst(text) {
    let lexingResult = lexer.tokenize(text);
    // "input" is a setter which will reset the parser's state.
    parser.input = lexingResult.tokens;

    let cst = parser.scripts(); //startrule

    if (parser.errors.length > 0) {
        console.log(parser.errors)
        console.log("sad sad panda, Parsing errors detected");
        return;
    } else {
        return cst;
    }
}

function execXmlVisitor(cst) {
    var v = new visitor({
        x: 10,
        y: 10
    });
    var xml = v.getXML(cst);
    return xml;
}