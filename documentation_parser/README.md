# tech details

Used library:
https://github.com/SAP/chevrotain/tree/master/examples/grammars

playground (copy past the content of `parser.js` or `temp.js`):
http://sap.github.io/chevrotain/playground/


https://github.com/SAP/chevrotain/issues/643

generate diagrams `generated_diagrams.html`

# problems/remarks

- sensitive to the amount of `\n`
- `:` cannot be at the end of a label -> "go to x:" is not valid and should be "go to x: "
- Label cannot start with a keyword (`forever`,`repeat`,`if`,`then`,`else`,`repeat`,`until`,`end`)
- Forever can be used invalidly in the middle of a stack...
- empty input does not work?

# todo

- {} around reporters and booleans and args can be ignored but than `scripts` is not a valid toprule anymore. See `parser_reducecurlies.js`
- allow multiple newlines between stacks

# construction
## top rules
The top rules that make sense are:

- block: parse 1 block (not with a keyword)
- stack: pare 1 stack of blocks (parse multiple blocks, including keyword blocks)
- multipleStacks: seperate multiple stacks with lineEnd
- scripts: use reporterblock and booleanblock on its own

## design choices
### Tokens

- [{(<>})]  seperate different argument types
- :: add option
- keywords (`forever`,`repeat`,`if`,`then`,`else`,`repeat`,`until`,`end`)
- Label can be any text with escaped prev chars and not starting with keyword
- Arg: Text (starting with " end ending with "),number(incl negative and decimal) or color (# followed by 6 numbers or letters)
- LineEnd '\n' or ';' also '\n;' is vallid and considered as 1 lineEnd reason: first because '\n' did not work and then looked easy if used inline <code> pen up;pen down </code> is easier to use?
- Whitespaces that are not '\n' are skipped if not part of a label


### Rules
The most basic rule parses one block. A block consist of atleast one Label or argument can be followed by and option. This is the universal representation of a block.
An argument is surrounded by {} or []. Both can be empty. [] indicates a menu/dropdown. {} indicates another block or primitive(arg:text,number,color).
An option is '::' followed by one label and can provide additional information about the block.
An block ends with a LineEnd or not if used at the end of a file.

Keywords make up rules specific for their meaning, refered to as keywordblocks.

Multiple blocks can be stacked. Therefor are the rules stack and stackline, stackline aggregates blocks and keywordblocks. A stack cannot be empty (otherwise this would introduce ambigousity)

Keywordblocks contain optionally a stacks which ends with end or not (if it is just everything)
for ifElse the else was split from the if because of maximum amount of occurence of OPTION in one rule is 5 (see documentation of  chevrotain)

end is a serpetate rule because it can or cannot be folowed by a lineend and this is used multiple times.

countable input is a rule for repeat because this cannot be followed by a boolean.

multipleStacks allows to use multiple stacks seperated by 1 LineEnd

Scrips allows to use reporter and booleanblocks on their own.









