const axios=require('axios');
const {Block}=require('./ClassesForProject');
const {BlockDistributed, BlockTransactions, Transaction}=require('./ClassesForProject');
const { Message, TransactionSignature }=require('./ClassesForProject');
const {ConnectingWithServerFunctions } =require('./ClassesForProject');
function postSingleBlock(){
  let block=new Block(0,0,"","000000000000000000000000000000000000000000000000000000000000000","single_block");
  block.mine(3);
  let jsonToPost=block.toJSON();
  jsonToPost['mine']=true;
  axios.post("http://localhost:4341/blocks",jsonToPost)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function postThinBlockchain(){
    let blocks=[];
    blocks.push(new Block(0,0,"","000000000000000000000000000000000000000000000000000000000000000","","thin_blockchain"));
    let jsonToPost={"data":[]}
    jsonToPost['data'].push(blocks[0].toJSON());
    for (let i=1;i<4;i++){
    blocks.push(new Block(i,0,"",blocks[i-1].hash,"","thin_blockchain"));
    jsonToPost['data'].push(blocks[i].toJSON());
    }
    jsonToPost["mine"]=true;
    console.log(jsonToPost)
    axios.post("http://localhost:4341/chain",jsonToPost)
    .then(function (response) {
    console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function postDistributedBlockchain(){
    let blocks=[];
    let blocksA=[];
    let blocksB=[];
    let blocksC=[];
    blocksA.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000","",1,"distributed"));
    blocksB.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000","",2,"distributed"));
    blocksC.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000","",3,"distributed"));
    for (let i=1;i<4;i++){
      blocksA.push(new BlockDistributed(i,0,"",blocksA[i-1].hash,"",1,"distributed"));
      blocksB.push(new BlockDistributed(i,0,"",blocksB[i-1].hash,"",2,"distributed"));
      blocksC.push(new BlockDistributed(i,0,"",blocksC[i-1].hash,"",3,"distributed"));
    }
    blocks.push(blocksA,blocksB,blocksC);
      let jsonToPost={"peers":['1','2','3'],"data":[]}
    for (let i=0;i<blocksA.length;i++){
      let newjson=blocksA[i].toJSON();
      jsonToPost['data'].push(newjson);
    }
    jsonToPost['mine']=true;
    axios.post("http://localhost:4341/chain",jsonToPost)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}


function postTokens(){
  let allTransactions1=[];
  let allTransactions2=[];
  let allTransactions3=[];
  let allTransactions4=[];
  allTransactions1.push(new Transaction(0,5,"A","B",false));
  allTransactions1.push(new Transaction(1,2,"A","C",false));
  allTransactions1.push(new Transaction(2,9,"C","B",false));
  allTransactions2.push(new Transaction(0,5,"B","A",false));
  allTransactions3.push(new Transaction(0,4,"D","A",false));
  allTransactions3.push(new Transaction(1,7,"B","D",false));
  allTransactions4.push(new Transaction(0,3,"C","D",false));
  allTransactions4.push(new Transaction(1,10,"D","B",false));
  allTransactions4.push(new Transaction(2,6,"A","D",false));
  let allTransactionsArr=[];
  allTransactionsArr.push(allTransactions1);
  allTransactionsArr.push(allTransactions2);
  allTransactionsArr.push(allTransactions3);
  allTransactionsArr.push(allTransactions4);
  let blocks=[];
  let blocksA=[];
  let blocksB=[];
  let blocksC=[];
  blocksA.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",1,"tokens"));
  blocksB.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",2,"tokens"));
  blocksC.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",3,"tokens"));
  for (let i=1;i<4;i++){
    blocksA.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksA[i-1].hash,"",1,"tokens"));
    blocksB.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksB[i-1].hash,"",2,"tokens"));
    blocksC.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksC[i-1].hash,"",3,"tokens"));
  }
  blocks.push(blocksA,blocksB,blocksC);
  let jsonToPost={"peers":['1','2','3'],"data":[]}
  for (let i=0;i<blocksA.length;i++){
      let newjson=blocksA[i].toJSON();
      jsonToPost['data'].push(newjson);
  }
  jsonToPost['mine']=true;
  axios.post("http://localhost:4341/chain",jsonToPost)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


function postCoinbase(){
  let allTransactions1=[];
  let allTransactions2=[];
  let allTransactions3=[];
  let allTransactions4=[];
  allTransactions1.push(new Transaction(0,5,"","A",true));
  allTransactions1.push(new Transaction(1,2,"A","C",false));
  allTransactions1.push(new Transaction(2,9,"C","B",false));
  allTransactions2.push(new Transaction(0,5,"","B",true));
  allTransactions3.push(new Transaction(0,4,"D","A",false));
  allTransactions3.push(new Transaction(1,7,"B","D",false));
  allTransactions4.push(new Transaction(0,3,"C","D",false));
  allTransactions4.push(new Transaction(1,10,"D","B",false));
  allTransactions4.push(new Transaction(2,6,"A","D",false));
  let allTransactionsArr=[];
  allTransactionsArr.push(allTransactions1);
  allTransactionsArr.push(allTransactions2);
  allTransactionsArr.push(allTransactions3);
  allTransactionsArr.push(allTransactions4);
  let blocks=[];
  let blocksA=[];
  let blocksB=[];
  let blocksC=[];
  blocksA.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",1,"coinbase"));
  blocksB.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",2,"coinbase"));
  blocksC.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",3,"coinbase"));
  for (let i=1;i<4;i++){
    blocksA.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksA[i-1].hash,"",1,"coinbase"));
    blocksB.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksB[i-1].hash,"",2,"coinbase"));
    blocksC.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksC[i-1].hash,"",3,"coinbase"));
  }
  blocks.push(blocksA,blocksB,blocksC);
  let jsonToPost={"peers":['1','2','3'],"data":[]}
  for (let i=0;i<blocksA.length;i++){
    let newjson=blocksA[i].toJSON();
    jsonToPost['data'].push(newjson);
  }
  jsonToPost['mine']=true;
  axios.post("http://localhost:4341/chain",jsonToPost)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

async function postFullBlockchain(){
  let allTransactions1=[];
  let allTransactions2=[];
  let allTransactions3=[];
  let allTransactions4=[];
  allTransactions1.push(new TransactionSignature(0,5,"","A",true,""));
  allTransactions1.push(new TransactionSignature(1,2,"A","C",false,""));
  allTransactions1.push(new TransactionSignature(2,9,"C","B",false,""));
  allTransactions2.push(new TransactionSignature(0,5,"","B",true,""));
  allTransactions3.push(new TransactionSignature(0,4,"D","A",false,""));
  allTransactions3.push(new TransactionSignature(1,7,"B","D",false,""));
  allTransactions4.push(new TransactionSignature(0,3,"C","D",false,""));
  allTransactions4.push(new TransactionSignature(1,10,"D","B",false,""));
  allTransactions4.push(new TransactionSignature(2,6,"A","D",false,""));
  let allTransactionsArr=[];
  allTransactionsArr.push(allTransactions1);
  allTransactionsArr.push(allTransactions2);
  allTransactionsArr.push(allTransactions3);
  allTransactionsArr.push(allTransactions4);
  let blocks=[];
  let blocksA=[];
  let blocksB=[];
  let blocksC=[];
  blocksA.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",1,"full_blockchain"));
  blocksB.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",2,"full_blockchain"));
  blocksC.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000","",3,"full_blockchain"));
  for (let i=1;i<4;i++){
    blocksA.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksA[i-1].hash,"",1,"full_blockchain"));
    blocksB.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksB[i-1].hash,"",2,"full_blockchain"));
    blocksC.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksC[i-1].hash,"",3,"full_blockchain"));
  }
  blocks.push(blocksA,blocksB,blocksC);
  let jsonToPost={"peers":['1','2','3'],"data":[]}
  for (let i=0;i<blocksA.length;i++){
    let newjson=blocksA[i].toJSON();
    jsonToPost['data'].push(newjson);
  }
  jsonToPost['mine']=true;
  axios.post("http://localhost:4341/chain",jsonToPost)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


postThinBlockchain();
postDistributedBlockchain();
postTokens();
postCoinbase();
postFullBlockchain();

