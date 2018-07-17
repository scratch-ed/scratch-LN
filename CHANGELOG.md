#v0.3.0
- 

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
