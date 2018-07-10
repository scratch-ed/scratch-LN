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

}