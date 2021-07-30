const sha256 = require("sha256");
const axios = require('axios');
const clone=require('clone');
class BlockJsonToBlock{
    constructor(data){
        this.inner = new Block(data.blockNum,data.nonce,data.data,data.prevHash,data.hash,data.type_code)
    }
}
class Block {
    constructor(blockNum,nonce,data,prevHash,hash,type_code){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.hash=hash;
        this.prevHash=prevHash;
        if  (this.hash===""){
            this.calculateHash();
        }
        this.type_code=type_code;
    }
    calculateHash(){
        this.hash = sha256(this.nonce+JSON.stringify(this.data).toString()+this.prevHash);
    }
    mine(difficulty) {
        this.nonce=0;
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.calculateHash();
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
            "previousHash":this.prevHash,
            "hash":this.hash
        }
        return ans;
    }
}

class BlockDistributed{
    constructor (blockNum,nonce,data,prevHash,hash,peer,type_code){
        this.nonce=nonce;
        this.data=data;
        this.num=blockNum;
        this.peer=peer;
        this.hash=hash;
        this.prevHash=prevHash;
        if  (this.hash===""){
            this.calculateHash();
        }
        this.type_code=type_code;
    }
    calculateHash(){
        this.hash = sha256(this.nonce+JSON.stringify(this.data).toString()+this.prevHash);
        if (this.hash === undefined){
            console.log("hash is undefined");
        }
    }
    mine(difficulty) {
        this.nonce=0;
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.calculateHash();
        }
    }
    checkCorrectHash(difficulty) {
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
            "previousHash":this.prevHash,
            "hash":this.hash,
            "peer":this.peer
        }
        return ans;
    }
}

class BlockTransactions{
    constructor(blockNum,nonce,allTransactions,prevHash,hash,peer,type_code){
        this.nonce=nonce;
        this.allTransactions=allTransactions;
        this.num=blockNum;
        this.peer=peer;
        this.hash=hash;
        this.prevHash=prevHash;
        if  (this.hash===""){
            this.calculateHash();
        }
        this.type_code=type_code;
    }
    calculateHash(){
        let allTransactionsString=JSON.stringify(this.allTransactions).toString();
        // for (let i=0;i<this.allTransactions.length;i++){
        //     allTransactionsString+=this.allTransactions[i].toString();
        // }
        this.hash = sha256(this.nonce+allTransactionsString+this.prevHash);
    }
    mine(difficulty) {
        this.nonce=0;
        this.calculateHash();
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join('0')){
            this.nonce++;
            this.calculateHash();
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
            "previousHash":this.prevHash,
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
    constructor(text,sign){
        this.text=text;
        this.sign=sign;
    }
    async signMessage(key){
        let ans;
        let temp=this.text;
        if (this.text===""){
            temp="empty"
        }
        let  toURL='http://localhost:4341/key/sign/'+temp;
        var config = {
            method: 'get',
            url: toURL,
            headers: {}
          };
          
          await axios(config)
          .then(function (response) {
            ans = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return ans;
    }
    async verifyMessage(key){
        let ans;
        let temp=this.text;
        if (this.text===""){
            temp="empty"
        }
        let  toURL='http://localhost:4341/key/verify/'+temp+'/'+this.sign;
        var config = {
            method: 'get',
            url: toURL,
            headers: {}
          };
          
          await axios(config)
          .then(function (response) {
              console.log(response);
            ans=response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return ans;
    }
}

class TransactionSignature {
    constructor(number,amount,from,to,isCoinbase,sign){
        this.number=number;
        this.amount=amount;
        this.from=from;
        this.to=to;
        this.isCoinbase=isCoinbase;
        this.sign=sign;
    }
    toString(){
        return String(this.amount)+this.from+this.to;
    }
    async signTransaction(key){
        let ans;
        let  toURL='http://localhost:4341/key/sign/'+this.toString();
        var config = {
            method: 'get',
            url: toURL,
            headers: {}
          };
          await axios(config)
          .then(function (response) {
            ans = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return ans;
    }
    async verifyTransaction(key){
        let ans;
        let  toURL='http://localhost:4341/key/verify/'+this.toString()+'/'+this.sign;
        var config = {
            method: 'get',
            url: toURL,
            headers: {}
          };
          
          await axios(config)
          .then(function (response) {
            ans=response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        return ans;    }
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
    static async loadBlocksThinBlockchain(){
        let ans=[];
        var config = {
        method: 'get',
        url: 'http://localhost:4341/blocks/thin_blockchain',
        headers: { }
        };
        await axios(config)
        .then(function (response) {
            console.log(response);
            for (let i=0;i<response.data.length;i++){
                ans.push(new Block(response.data[i].num,response.data[i].nonce,response.data[i].data,response.data[i].prev,response.data[i].hash,response.data[i].type_code))
                console.log(ans[i]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        return ans;
    }
    async saveBlocksThinBlockchain(blocksToSave){

    }
    static async loadBlocksDistributed(){
        let ans=[];
        let peer1=new Array();
        let peer2=new Array();
        let peer3=new Array();
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/distributed',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            console.log(response);
            for (let i=0;i<response.data.length;i+=3){
                let num1 =response.data[i].num;
                let num2 = response.data[i+1].num;
                let num3 =  response.data[i+2].num;
                let nonce1= response.data[i].nonce;
                let nonce2= response.data[i+1].nonce;
                let nonce3= response.data[i+2].nonce;
                let data1= response.data[i].data;
                let data2= response.data[i+1].data;
                let data3= response.data[i+2].data;
                let prev1= response.data[i].prev;
                let prev2= response.data[i+1].prev;
                let prev3= response.data[i+2].prev;
                let hash1= response.data[i].hash;
                let hash2= response.data[i+1].hash;
                let hash3= response.data[i+2].hash;
                let type_code1= response.data[i].type_code;
                let type_code2= response.data[i+1].type_code;
                let type_code3= response.data[i+2].type_code;
                var block1 = new BlockDistributed(num1,nonce1,data1,prev1,hash1,0,type_code1);
                var block2 = new BlockDistributed(num2,nonce2,data2,prev2,hash2,1,type_code2);
                var block3 = new BlockDistributed(num3,nonce3,data3,prev3,hash3,2,type_code3);
                peer1.push(new BlockDistributed(num1,nonce1,data1,prev1,hash1,0,type_code1));
                peer2.push(new BlockDistributed(num2,nonce2,data2,prev2,hash2,1,type_code2));
                peer3.push(new BlockDistributed(num3,nonce3,data3,prev3,hash3,2,type_code3));
                // ans.push(block1,block2,block3);
            } 
            ans.push(peer1,peer2,peer3);
        })
        .catch(function (error) {
            console.log(error);
        });

        return ans;
    }
    static async loadBlocksTokens(blocksToSave){
        let ans=[];
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/tokens',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            let peer1=[];
            let peer2=[];
            let peer3=[];
            for (let i=0;i<response.data.length;i+=3){
                let allTransactions=[];
                for (let j=0;j<response.data[i].data.length;j++){
                    allTransactions.push(new Transaction(response.data[i].data[j].index,response.data[i].data[j].amount,
                        response.data[i].data[j].from,response.data[i].data[j].to,response.data[i].data[j].isCoinbase));
                }
                peer1.push(new BlockTransactions(response.data[i].num,response.data[i].nonce,allTransactions,response.data[i].prev,response.data[i].hash,0,response.data[i].type_code));
                peer2.push(new BlockTransactions(response.data[i+1].num,response.data[i+1].nonce,allTransactions,response.data[i+1].prev,response.data[i+1].hash,1,response.data[i+1].type_code));
                peer3.push(new BlockTransactions(response.data[i+2].num,response.data[i+2].nonce,allTransactions,response.data[i+2].prev,response.data[i+2].hash,2,response.data[i].type_code));
            }
            ans.push(peer1,peer2,peer3);
        })
        .catch(function (error) {
            console.log(error);
        });
        return ans;
    }
    static async loadBlocksCoinbase(blocksToSave){
        let ans=[];
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/coinbase',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            let peer1=[];
            let peer2=[];
            let peer3=[];
            for (let i=0;i<response.data.length;i+=3){
                let allTransactions=[];
                for (let j=0;j<response.data[i].data.length;j++){
                    allTransactions.push(new Transaction(response.data[i].data[j].index,response.data[i].data[j].amount,
                        response.data[i].data[j].from,response.data[i].data[j].to,response.data[i].data[j].isCoinbase));
                }
                peer1.push(new BlockTransactions(response.data[i].num,response.data[i].nonce,allTransactions,response.data[i].prev,response.data[i].hash,0,response.data[i].type_code));
                peer2.push(new BlockTransactions(response.data[i+1].num,response.data[i+1].nonce,allTransactions,response.data[i+1].prev,response.data[i+1].hash,1,response.data[i+1].type_code));
                peer3.push(new BlockTransactions(response.data[i+2].num,response.data[i+2].nonce,allTransactions,response.data[i+2].prev,response.data[i+2].hash,2,response.data[i].type_code));
            }
            ans.push(peer1,peer2,peer3);
        })
        .catch(function (error) {
            console.log(error);
        });
        return ans;
    }
    static async loadFullBlockchain(){
        let ans=[];
        var config = {
            method: 'get',
            url: 'http://localhost:4341/blocks/full_blockchain',
            headers: { }
        };
        await axios(config)
        .then(function (response) {
            console.log(response);
            let peer1=[];
            let peer2=[];
            let peer3=[];
            for (let i=0;i<response.data.length;i+=3){
                let allTransactions=[];
                for (let j=0;j<response.data[i].data.length;j++){
                    allTransactions.push(new TransactionSignature(response.data[i].data[j].index,response.data[i].data[j].amount,
                        response.data[i].data[j].from,response.data[i].data[j].to,response.data[i].data[j].isCoinbase,response.data[i].data[j].signature));
                }
                peer1.push(new BlockTransactions(response.data[i].num,response.data[i].nonce,allTransactions,response.data[i].prev,response.data[i].hash,0,response.data[i].type_code));
                peer2.push(new BlockTransactions(response.data[i+1].num,response.data[i+1].nonce,allTransactions,response.data[i+1].prev,response.data[i+1].hash,1,response.data[i+1].type_code));
                peer3.push(new BlockTransactions(response.data[i+2].num,response.data[i+2].nonce,allTransactions,response.data[i+2].prev,response.data[i+2].hash,2,response.data[i].type_code));
            }
            ans.push(peer1,peer2,peer3);
        })
        .catch(function (error) {
            console.log(error);
        });
        return ans; 
    }
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
            keys.push(response.data['privateKey']);
            keys.push(response.data['publicKey']);
        })
        .catch(function (error) {
            console.log(error);
        });
        return keys;
    }
}


module.exports={
    Block:  Block,
    BlockJsonToBlock: BlockJsonToBlock,
    BlockDistributed: BlockDistributed,
    BlockTransactions: BlockTransactions,
    Transaction: Transaction,
    Message: Message,
    TransactionSignature: TransactionSignature,
    ConnectingWithServerFunctions: ConnectingWithServerFunctions
}