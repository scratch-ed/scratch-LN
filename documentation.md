# documentation
## Parser
### functions
`parseTextToXML` in `parser\parserUtils.js`
TODO: warnings+errors
added to workspace like:
"""
	    var xml = parseTextToXML(text);
        if (xml) {
            var dom = Blockly.Xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(dom, workspace);
        }
"""

### text -> XML
#### id generation (blockID)
blocks and shadows are numbered by occurence. (for now)

#### warnings
TODO

## Webtools
add `class='scratch'` to a code element and call `scratchify`. Optionally add an id  `id='x'` to name the workspace otherwise workspaces are named by the index. To glow/stackglow/change value/... provide this name to the functions as the id. The blockID is as mentioned above.

## Generator
convert scratchblocks to text using the Blockly Generator.
TODO
