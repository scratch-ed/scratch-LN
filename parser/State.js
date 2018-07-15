/**
 * Storage of the state of the workspace
 *
 * things that need to be possible are:
 *      - get the last block and the type of the block
 *
 * @file   This files defines the State class.
 * @author Ellen Vanhove.
 */

const MODUS = {
    NONE:0,
    STACK:1,
    REPORTER:2,
    BOOLEAN:3,
}

export class State {

    constructor(informationVisitor) {
        this.infoVisitor = informationVisitor;
        this.reset();
    }

    /**
     * reset the state:
     *  removes all stored information
     */
    reset() {
        //list of all blocks
        this.blocks = [];
        this.blocks.push({ID:-1,SHAPE:null}); //this should not happen normally but this way nothing breaks during dev
        this.modus = MODUS.NONE;
        this.interrupted = false;
        //when opening a new context the previous is stored here
        this.storage = [];
    }



    pushStorage(){
       this.storage.push(
            {
                blocks : this.blocks,
                modus: this.modus
            }
        );
        console.log(this.modus,this.blocks,this.storage)
    }

    popStorage(){
        let stored = this.storage.pop();
        this.blocks = stored.blocks;
        this.modus = stored.modus;
        console.log(this.modus,this.blocks,this.storage)
    }

    isBuildingStackBlock(){
        return this.modus === MODUS.STACK;
    }

    isBuildingReporterBlock(){
        return this.modus === MODUS.REPORTER;
    }

    isBuildingBooleanBlock(){
        return this.modus === MODUS.BOOLEAN;
    }

    /**
     * store informaton about a block
     * @param id the id of the block
     * @param shape the shape of the block
     */
    addBlock(id,shape){
        this.blocks.push({ID:id,SHAPE:shape})
    }

    /**
     * return the type of the last added block
     * @returns {string}
     */
    getFirstBlockType(){
        return this.blocks[0].SHAPE;
    }

    /**
     * return the id of the last added block
     * @returns {string}
     */
    getFirstBlockID(){
        return this.blocks[0].ID;
    }

    /**
     * return the type of the last added block
     * @returns {string}
     */
    getLastBlockType(){
        return this.blocks[this.blocks.length-1].SHAPE;
    }

    /**
     * return the id of the last added block
     * @returns {string}
     */
    getLastBlockID(){
        return this.blocks[this.blocks.length-1].ID;
    }

    startStack(){
        console.log("start stack")
        this.pushStorage();
        this.modus = MODUS.STACK;
        this.interrupted=false;
    }

    endStack(){
        console.log("end stack")
        this.popStorage();
    }

    interruptStack(){
        //todo: go to root
        this.interrupted = true;
    }

    isInterruptedStack(){
        return this.interrupted;
    }

    openBooleanBlock(){
        console.log("start bool")
        this.pushStorage();
        this.modus = MODUS.BOOLEAN;
    }

    closeBooleanBlock(){
        console.log("end bool")
        this.popStorage();
    }

    openReporterBlock(){
        console.log("start rep")
        this.pushStorage();
        this.modus = MODUS.REPORTER;
    }

    closeReporterBlock(){
        console.log("end rep")
        this.popStorage();
    }



}