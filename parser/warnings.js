/**
 * Warnings.
 *
 * An object that determines the structure of the warnings.
 *
 * @file   This files defines the WarningsKeeper class.
 * @author Ellen Vanhove.
 */

export class WarningsKeeper {

    constructor(informationVisitor) {
        this.reset();
    }

    reset(){
        this.list = [];
    }

    add(ctx,msg){
        this.list.push({
            msg:msg,
            ctx:ctx,
        })
    }

    getList(){
        return this.list;
    }

}