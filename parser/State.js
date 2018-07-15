/**
 * Storage of the state of the workspace
 *
 * things that need to be possible are:
 *      - get the last block and the type of the block
 *
 * @file   This files defines the State class.
 * @author Ellen Vanhove.
 */


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
        this.everythingFalse();
        this.interrupted = false;
    }

    everythingFalse(){
        this.stack = false;
        this.boolean = false;
        this.reporter = false;
    }

    isBuildingStackBlock(){
        return this.stack
    }

    isBuildingReporterBlock(){
        return this.reporter
    }

    isBuildingBooleanBlock(){
        return this.boolean
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

    /**
     * todo The start of a new stack
     */
    startStack(){
        this.everythingFalse();
        this.stack = true;
        this.interrupted=false;
    }

    /**
     * todo The end of the current stack
     */
    endStack(){
        this.everythingFalse();
    }

    interruptStack(){
        this.interrupted = true;
    }

    isInterruptedStack(){
        return this.interrupted;
    }

    openBooleanBlock(){
        this.everythingFalse();
        this.boolean = true;
    }

    closeBooleanBlock(){
        this.everythingFalse();
    }

    openReporterBlock(){
        this.everythingFalse();
        this.reporter = true;
    }

    closeReporterBlock(){
        this.everythingFalse();
    }



}