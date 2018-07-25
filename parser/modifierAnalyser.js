/**
 * Extract modifiers.
 *
 * This files contains all necessary classes to extract information about a modifier.
 * A modifier extract implements all methods from ModifierExtractor, so it extends the class.
 *
 *
 * @file   This files defines the Modifierextractor,ListmodifierExtractor, ModifierAnalyser class.
 * @author Ellen Vanhove.
 */

class ModifierExtractor {

    /**
     * analyse the modifier token and return whether it contains a certain key
     * @param modifierToken
     * return {boolean} the modifier token contains the key
     */
    containsKey(modifierToken) {
        throw new Error('You have to implement the method containsKey!');
    }

    /**
     * returns an object
     * @param modifierToken
     * returns object
     */
    extractParameters(modifierToken) {
        throw new Error('You have to implement the method extractParameters!');
    }

    /**
     * return a generic name for this extractor
     */
    getName() {
        throw new Error('You have to implement the method getName!');
    }

}

class listModifierExtractor extends ModifierExtractor {
    containsKey(modifierToken) {
        return modifierToken.image.match(/::list/i);
    }

    extractParameters(modifierToken) {
        return {}
    }

    getName() {
        return "list"
    }
}

class myBlockModifierExtractor extends ModifierExtractor {
    containsKey(modifierToken) {
        return modifierToken.image.match(/::local/i)
            || modifierToken.image.match(/::myblock/i)
            || modifierToken.image.match(/::custom-arg/i);
    }

    extractParameters(modifierToken) {
        return {}
    }

    getName() {
        return "myblock"
    }
}

class varModifierExtractor extends ModifierExtractor {
    containsKey(modifierToken) {
        return modifierToken.image.match(/::user/i)
            || modifierToken.image.match(/::var/i)
            || modifierToken.image.match(/::user-defined/i)
            || modifierToken.image.match(/::custom/i)
            || modifierToken.image.match(/::variable/i);
    }

    extractParameters(modifierToken) {
        return {}
    }

    getName() {
        return "user"
    }
}

export class ModifierAnalyser {
    constructor(ctx, informationVisitor) {
        this.infoVisitor = informationVisitor;
        this.modifierExtractors = [];
        this.modifierExtractors.push(new listModifierExtractor());
        this.modifierExtractors.push(new myBlockModifierExtractor());
        this.modifierExtractors.push(new varModifierExtractor());
    }

    getMods(modifierList) {
        let mods = {};
        //let modifierList =  ctx.children.Modifier;
        if (modifierList) {
            for (let i = 0; i < modifierList.length; i++) {
                for (let m = 0; m < this.modifierExtractors.length; m++) {
                    if (this.modifierExtractors[m].containsKey(modifierList[i])) {
                        mods[this.modifierExtractors[m].getName()] = this.modifierExtractors[m].extractParameters(modifierList[i]);
                    }
                }
            }
        }
        return mods;
    }

}