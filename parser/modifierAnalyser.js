/**
 * Summary.
 *
 * Description.
 *
 * @file   This files defines the MyClass class.
 * @author Ellen Vanhove.
 */


let modifierExtractors = [];

let listModifierExtractor = function (modifierToken) {
    console.log("mimi",modifierToken);
    if(modifierToken.image.matches(/::list/i)) {
        return {name: "list", info: {}}
    }
};

if(modifierExtractors.length === 0){
    modifierExtractors.push(listModifierExtractor)
}

export class ModifierAnalyser{
    constructor(ctx,informationVisitor) {
        this.infoVisitor = informationVisitor;
    }


    getMods(ctx){
        let mods = {};
        let modifierList =  ctx.children.Modifier;
        if(modifierList) {
            console.log("modlist", modifierList,modifierExtractors);
            for (let i = 0;  i < modifierList.length; i++) {
                for (let m = 0; m < modifierExtractors.length; m++) {
                    console.log("here");
                    let mod = modifierExtractors[m](modifierList[i]);
                    if (mod) {
                        mods[mod.name] = mods.info;
                    }
                }
            }
        }
        return mods;
    }

}