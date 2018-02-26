# notes and temporary explanation of the parser, see wiki for more

## tech details
Used library:
https://github.com/SAP/chevrotain/tree/master/examples/grammars

playground (copy past the content of `temp.js`):
http://sap.github.io/chevrotain/playground/

the playground is now on version 3.0 i'am using version 1
https://github.com/SAP/chevrotain/blob/75bc41679367d4057b87f3e1c3bf0ed5d97fab04/CHANGELOG.md
`if(ctx.iets.length>0)` has to be chagned to `if(ctx.iets)` 

https://github.com/SAP/chevrotain/issues/643

the most recent generated diagrams can be found in  `generated_diagrams.html`

## problems/remarks

- sensitive to the amount of `\n`
- `:` cannot be at the end of a label -> "go to x:" is not valid and should be "go to x: "
- Label cannot start with a keyword (`forever`,`repeat`,`if`,`then`,`else`,`repeat`,`until`,`end`)
- Forever can be used invalidly in the middle of a stack...
- empty input does not work?
- make {} optional in case of "" or <>

## todo

- {} around reporters and booleans and args can be ignored but than `scripts` is not a valid toprule anymore. See `parser_reducecurlies.js`
- allow multiple newlines between stacks









