/**
 * Generation and storage of ids during the generation of an XML.
 *
 * things that need to be possible are:
 *      - varID, id for the variable
 *      - unique id for every block
 *      -
 *
 * @file   This files defines the BasicIDManager class.
 * @author Ellen Vanhove.
 */

export const BROADCAST = 'broadcast_msg';
export const LIST = 'list';

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
        //comments
        this.commentCounter = 0;
    }


    /**
     * generates an unique id for every block
     * todo: if an id is defined in the ctx this one should be used
     * todo: waring in case an id is used twice.
     * @param definedID the id defiend by the user, null incase the id is not defined
     * @returns {string}
     */
    getNextBlockID(definedID=null) {
        let id;
        if(definedID){
            id=definedID;
        }else {
            id = "block_" + this.counter++;
        }
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
     * @param definedID the id defiend by the user, null incase the id is not defined
     * @param parentID the id of the parent block that contains this input
     * @returns {string}
     */
    getNextInputID(parentID,definedID=null) {
        let id;
        if(definedID){
            id=definedID;
        }else {
            id=parentID + '_input_' + this.inputCounter[parentID]++;
        }
        return id;
    }

    /**
     * todo: do the variabletype a bit better: types: none=normal, list, mesage,arg,custom???
     * variable id is never defined or used by the user. it is only for internal reference to the same block
     * @param varName
     * @param variableType
     */
    acquireVariableID(varName, variableType = '') {
        //if first time this variable is encountered, create an ID for it
        if (!this.varMap[varName]) {
            this.varMap[varName] = {
                'id': 'var' + this.varCounter++,
                'variableType': variableType
            }
        }
        return this.varMap[varName].id;
    }


    /**
     * generates an unique id for every coment
     * todo: if an id is defined in the ctx this one should be used
     * todo: waring in case an id is used twice.
     * @param definedID
     * @param {boolean} pinned is it a stand alone block?
     * @returns {string}
     */
    getNextCommentID(definedID,pinned=true){
        let id;
        if(definedID){
            id=definedID;
        }else {
            id="comment_"+this.commentCounter++;
        }
        return id;
    }
}