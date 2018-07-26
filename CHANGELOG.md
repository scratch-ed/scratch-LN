# v0.4.0
- make brackets around boolean and reporters mandatory 
- improved warnings
- change modifiers
- case insensitive matching of built-in blocks
- Scratch-LN comments token definition



# v0.3.0
- update block specifications: remove and add some blocks + add alternatives
- add locale
- add warnings
- change `scratchify` arguments
    - selecter instead of class
    - add workspace properties
    - locale
    - scale
- some improvements to generators 
- modifier for built-in variable vs. user-defined variable with the same name  

# v0.2.0
- arguments of custom block are now generated correctly
- 'if on edge, bounce' can be used 
- `repeat 10` is no longer allowed it is now `repeat {10}`
- added `dist` folder
- update parser: renaming of rules and special cases in tokens.
- added comments
- general bugfixes
- pen can no longer be used see (#63)
- custom reporters and booleans
- code structure:
    - separate id manager
    - infoVisitor is responsible for all string obtaining, types, placeholders etc.
    - state keeps track of which object is being build
    - modifierAnalyser and modifierExtract provide a more generic way to deal with modifiers
- a new stack will be started when using a cap,hat, stand-alone reporter or boolean    
