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
};

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
    }

    popStorage(){
        let stored = this.storage.pop();
        this.setBack(stored);
    }

    setBack(stored) {
        this.blocks = stored.blocks;
        this.modus = stored.modus;
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
        this.pushStorage();
        this.modus = MODUS.STACK;
        this.interrupted=false;
    }

    endStack(){
        this.popStorage();
    }

    interruptStack(){
        let stored =  this.storage[0];
        this.setBack(stored);
        this.storage = []
        this.interrupted = true;
    }

    isInterruptedStack(){
        return this.interrupted;
    }

    openBooleanBlock(){
        this.pushStorage();
        this.modus = MODUS.BOOLEAN;
    }

    closeBooleanBlock(){
        this.popStorage();
    }

    openReporterBlock(){
        this.pushStorage();
        this.modus = MODUS.REPORTER;
    }

    closeReporterBlock(){
        this.popStorage();
    }



}