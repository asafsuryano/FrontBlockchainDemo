const sha256 = require("sha256");
const Crypto=require('crypto');
class Block {
    constructor(blockNum,nonce,data,prevHash){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
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
}

class BlockDistributed{
    constructor(blockNum,nonce,data,prevHash,peer){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.peer=peer;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
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
}

class BlockTransactions{
    constructor(blockNum,nonce,allTransactions,prevHash,peer){
        this.nonce=nonce;
        this.allTransactions=allTransactions;
        this.num=blockNum;
        this.peer=peer;
        this.hash="";
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
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
        let verification = Crypto.verify("SHA256",this.text,key);
        if (this.sign===verification){
            return true;
        }else{
            return false;
        }
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
        let verification = Crypto.verify("SHA256",this.toString(),key);
        if (this.sign===verification){
            return true;
        }else{
            return false;
        }
    }
}

module.exports={
    Block:  Block,
    BlockDistributed: BlockDistributed,
    BlockTransactions: BlockTransactions,
    Transaction: Transaction,
    Message: Message
}