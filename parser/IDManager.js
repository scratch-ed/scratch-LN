/**
 * Generation and storage of ids during the generation of an XML.
 *
 * things that need to be possible are:
 *      - varID, id for the variable
 *      - text on a block -> parent ID (define block)
 *      -
 *
 * @file   This files defines the BasicIDManager class.
 * @author Ellen Vanhove.
 */


export class BasicIDManager {

    constructor(informationVisitor) {
        this.infoVisitor = informationVisitor;
        this.reset();
    }

    reset(){
        this.counter = 0;
        //maps blockid -> counter for the inputs
        this.inputCounter = new Object();
        //-- variables --
        //map a variablename  to its id
        this.varMap = {};
        this.varCounter = 0;
    }


    /**
     * generates an unique id for every block
     * todo: if an id is defined in the ctx this one should be used
     * todo: waring in case an id is used twice.
     * @param ctx
     * @returns {string}
     */
    getNextBlockID(ctx, Procedure=false) {
        let id;
        id = "block_"+this.counter++;
        if (this.inputCounter[id]) {
            //the id is already used, this is not allowed
            //todo generate warning
        }
        this.inputCounter[id] = 0;
        return id;
    }

    /**
     * generates an unique id for every block
     * todo: if an id is defined in the ctx this one should be used
     * todo: waring in case an id is used twice.
     * @param ctx
     * @param parentID the id of the parent block that contains this input
     * @returns {string}
     */
    getNextInputID(ctx, parentID) {
        let id;
        id=parentID + '_' + this.inputCounter[parentID]++;
        return id;
    }

    /**
     * todo: do the variabletype a bit better
     * @param varName
     * @param variableType
     */
    getVariableID(varName, variableType = '') {
        //if first time this variable is encoutered, create an ID for it
        if (!this.varMap[varName]) {
            this.varMap[varName] = {
                'id': 'var' + this.varCounter++,
                'variableType': variableType
            }
        }
        return this.varMap[varName].id;
    }

    /**
     *
     * @param ctx
     * @returns {string}
     */
    getProcedureParentID(ctx){
        return 0;
    }
}