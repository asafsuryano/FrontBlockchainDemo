const sha256 = require("sha256");
const Crypto=require('crypto');
const axios = require('axios');
const { throws } = require("assert");

class Block {
    constructor(blockNum,nonce,data,prevHash,type_code){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
        this.type_code=type_code;
    }
    calculateHash(){
        return sha256(this.nonce+this.data+this.prevHash);
    }
    mine(difficulty) {
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash=this.calculateHash();
        }
    }
    checkCorrectHash(difficulty){
        if (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            return false;
        }else{
            return true;
        }
    }
    toJSON(){
        let ans={
            "type_code": this.type_code,
            "index":this.num,
            "nonce":this.nonce,
            "data":this.data,
            "prevHash":this.prevHash,
            "hash":this.hash
        }
        return ans;
    }
}

class BlockDistributed{
    constructor(blockNum,nonce,data,prevHash,peer,type_code){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.peer=peer;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
        this.type_code=type_code;
    }
    calculateHash(){
        return sha256(this.nonce+this.data+this.prevHash);
    }
    mine(difficulty) {
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash=this.calculateHash();
        }
    }
    checkCorrectHash(difficulty){
        if (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            return false;
        }else{
            return true;
        }
    }
    toJSON(){
        let ans={
            "type_code": this.type_code,
            "index":this.num,
            "nonce":this.nonce,
            "data":this.data,
            "prevHash":this.prevHash,
            "hash":this.hash,
            "peer":this.peer
        }
        return ans;
    }
}

class BlockTransactions{
    constructor(blockNum,nonce,allTransactions,prevHash,peer,type_code){
        this.nonce=nonce;
        this.allTransactions=allTransactions;
        this.num=blockNum;
        this.peer=peer;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
        this.type_code=type_code;
    }
    calculateHash(){
        let allTransactionsString="";
        for (let i=0;i<this.allTransactions.length;i++){
            allTransactionsString+=this.allTransactions[i].toString();
        }
        return sha256(this.nonce+allTransactionsString+this.prevHash);
    }
    mine(difficulty) {
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash=this.calculateHash();
        }
    }
    checkCorrectHash(difficulty){
        if (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            return false;
        }else{
            return true;
        }
    }
    toJSON(){
        let allTrans=[];
        for (let i=0;i<this.allTransactions.length;i++){
            allTrans.push(this.allTransactions[i].toJSON());
        }
        let ans={
            "type_code": this.type_code,
            "index":this.num,
            "nonce":this.nonce,
            "data":allTrans,
            "prevHash":this.prevHash,
            "hash":this.hash,
            "peer":this.peer
        }
        return ans;
    }
}

class Transaction{
    constructor(number,amount,from,to,isCoinbase){
        this.number=number;
        this.amount=amount;
        this.from=from;
        this.to=to;
        this.isCoinbase=isCoinbase;
    }
    toString(){
        return String(this.amount)+this.from+this.to;
    }
    toJSON(){
        let ans={
            "index":this.number,
            "amount":this.amount,
            "from":this.from,
            "to":this.to,
            "isCoinbase":this.isCoinbase
        }
        return ans;
    }
}

class Message {
    constructor(text){
        this.text=text;
        this.sign="";
    }
    signMessage(key){
        this.sign=Crypto.sign("SHA256",this.text,key);
        return true;
    }
    verifyMessage(key){
        return Crypto.verify("SHA256",this.text,key,this.sign);
    }
}

class TransactionSignature {
    constructor(number,amount,from,to,isCoinbase){
        this.number=number;
        this.amount=amount;
        this.from=from;
        this.to=to;
        this.isCoinbase=isCoinbase;
        this.sign=""
    }
    toString(){
        return String(this.amount)+this.from+this.to+this.sign;
    }
    signTransaction(key){
        this.sign=Crypto.sign("SHA256",this.toString(),key);
        return true;
    }
    verifyTransaction(key){
        return Crypto.verify("SHA256",this.toString(),key,this.sign);
    }
    toJSON(){
        let ans={
            "index":this.number,
            "amount":this.amount,
            "from":this.from,
            "to":this.to,
            "isCoinbase":this.isCoinbase,
            "signature":this.sign
        }
        return ans;
    }
}

class ConnectingWithServerFunctions{
    static async loadSingleBlock(){
        var config = {
        method: 'get',
        url: 'http://localhost:4341/blocks/single_block',
        headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    async saveSingleBlock(blockToSave){

    }
    static async loadBlocksThinBlockchain(){
        var config = {
        method: 'get',
        url: 'http://localhost:4341/blocks/thin_blockchain',
        headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    async saveBlocksThinBlockchain(blocksToSave){

    }
    static async loadBlocksDistributed(){
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/distributed',
            headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    async saveBlocksDistributed(blocksToSave){

    }
    static async loadBlocksTokens(blocksToSave){
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/tokens',
            headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    async saveBlocksTokens(blocksToSave){

    }
    static async loadBlocksCoinbase(blocksToSave){
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/coinbase',
            headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    async saveBlocksCoinbase(){

    }
    static async loadAndGenerateKeys(){

    }
    async loadTransaction(){

    }
    static async loadFullBlockchain(){
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/full_blockchain',
            headers: { }
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    // async mine(difficulty){

    // }
    // async requestHash(text){

    // }
    // async requestSign(key,dataString){

    // }
    // async requestVerify(key,dataString){

    // }

    static async loadKey(){
        let keys=[]
        var config = {
            method: 'get',
            url: 'http://localhost:4341/key',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            console.log(response);
            keys.push(response.data[0]['privateKey']);
            keys.push(response.data[0]['publicKey']);
        })
        .catch(function (error) {
            console.log(error);
        });
        return keys;
    }

    static async generateNewKey(){
        let keys=[]
        var config = {
            method: 'get',
            url: 'http://localhost:4341/key/generate',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            keys.push(response.data[0]['privateKey']);
            keys.push(response.data[0]['publicKey']);
        })
        .catch(function (error) {
            console.log(error);
        });
        return keys;
    }
}

module.exports={
    Block:  Block,
    BlockDistributed: BlockDistributed,
    BlockTransactions: BlockTransactions,
    Transaction: Transaction,
    Message: Message,
    TransactionSignature: TransactionSignature,
    ConnectingWithServerFunctions: ConnectingWithServerFunctions
}