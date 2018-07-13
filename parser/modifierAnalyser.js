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
        for(let i=0;ctx.modifier && i<ctx.modifier.length; i++){
            for(let m=0; m < modifierExtractors.length; m++){
                let mod = modifierExtractors[m](ctx.modifier[i]);
                if(mod){
                    mods[mod.name] = mods.info;
                }
            }
        }
        return mods;
    }

}