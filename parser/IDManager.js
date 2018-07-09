/**
 * Generation and storage of ids during the generation of an XML.
 *
 * things that need to be possible are:
 *      - varID, id for the variable
 *      - unique id for every block
 *      - text on a block -> parent ID (define block)
 *      -
 *
 * @file   This files defines the BasicIDManager class.
 * @author Ellen Vanhove.
 */


export class BasicIDManager{

    constructor(informationVisitor) {
        this.infoVisitor = informationVisitor;
        this.reset();
    }

    reset(){
        this.counter = 0;
        //maps blockid -> counter for the inputs
        this.inputCounter = {};
        //-- variables --
        //map a variablename  to its id
        this.varMap = {};
        this.varCounter = 0;
        //define blocks
        this.procedureDefinitions = {};
    }


    /**
     * generates an unique id for every block
     * todo: if an id is defined in the ctx this one should be used
     * todo: waring in case an id is used twice.
     * @param ctx
     * @param procedure_definition
     * @returns {string}
     */
    getNextBlockID(ctx, procedure_definition=false) {
        let id;
        id = "block_"+this.counter++;
        if (this.inputCounter[id]) {
            //the id is already used, this is not allowed
            //todo generate warning
        }
        this.inputCounter[id] = 0;
        if(procedure_definition){
            procedureDefinitions[this.infoVisitor.atomic(ctx).TEXT.replace(/^define/i,"")] = id;
        }
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
     * todo: do the variabletype a bit better: types: none=normal, list, mesage,arg,custom???
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
     * returns the ID of the define block with the same text.
     * @param ctx
     * @returns {string}
     */
    getProcedureParentID(ctx){
        return procedureDefinitions[this.infoVisitor.atomic(ctx).TEXT];
    }

    /**
     * returns the ID of the define block with the same text.
     * @param mutation string
     * @returns {string}
     */
    getProcedureParentIDMutation(mutation){
        return procedureDefinitions[mutation];
    }
}