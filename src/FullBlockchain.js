import {BlockDistributed, BlockTransactions, Transaction} from './ClassesForProject';
import { Message, TransactionSignature } from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import React, { useEffect, useState, useRef } from 'react';


function FullBlockchain(){
    const mounted=useRef(true);
    const [KeysAndAllBlocksInBlockchain,Change]=useState(undefined);
    let i=1;
    let ChangeByIndex=((blockToChange)=>{
      let newAllblocksPeers=KeysAndAllBlocksInBlockchain[1].slice();
      newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
      for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
        newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
        newAllblocksPeers[blockToChange.peer][i].calculateHash();
      }
      Change([KeysAndAllBlocksInBlockchain[0],newAllblocksPeers]) 
    })
    let loadKeysAndSignAllTransactions=(async()=>{
      let keys=await ConnectingWithServerFunctions.loadKey();
      console.log("loaded keys");
      let allBlocks=await ConnectingWithServerFunctions.loadFullBlockchain();
      console.log("loaded all blocks");
      let temp=allBlocks.slice();
      Change([keys,temp]);
    })
    if (mounted.current){
      mounted.current=false;
      loadKeysAndSignAllTransactions();
    }
    if (KeysAndAllBlocksInBlockchain===undefined){
      return (
        <div>
          <h1>wait for blockchain to load</h1>
        </div>
      )
    }else{
    return (
      <div>
        {KeysAndAllBlocksInBlockchain[1].map((peerType)=>{
            return(
              <div>
                <h1>{"Peer "+i++}</h1>
                {peerType.map((element)=>{
                  return(
                  <BlockFullBlockchain ChangeByIndex={ChangeByIndex}  publicKey={KeysAndAllBlocksInBlockchain[0][1]} newBlock={element} />)
                })}
              </div>
            )
          })}
        </div>
      )
      }
}
  

function BlockFullBlockchain(props){
    const [Block4Change,ChangeBlock]=useState(props.newBlock);
    let calculateNewHashAndChangeBlockchain=((transaction)=>{
      let allTransactions=Block4Change.allTransactions.slice();
      allTransactions[transaction.number]=transaction;
      let newBlock=new BlockTransactions(Block4Change.num,Block4Change.nonce,allTransactions,Block4Change.prevHash,"",Block4Change.peer,Block4Change.type_code);
      ChangeBlock(newBlock);
    })
    useEffect(()=>{
      //if (mounted.current){
        if (Block4Change.checkCorrectHash(4)){
          document.getElementById("block"+Block4Change.peer+Block4Change.num).style.backgroundColor="green";
        }else{
          document.getElementById("block"+Block4Change.peer+Block4Change.num).style.backgroundColor="red";
        }
      //}
    })
    useEffect(()=>{
      document.getElementById("hash").value=Block4Change.hash;
      if (Block4Change.checkCorrectHash(4)){
        document.getElementById("block"+Block4Change.peer+Block4Change.num).style.backgroundColor="green";
      }else{
        document.getElementById("block"+Block4Change.peer+Block4Change.num).style.backgroundColor="red";
      }
        props.ChangeByIndex(Block4Change);
    },[Block4Change])
    return(
      <div id={"block"+Block4Change.peer+Block4Change.num}>
        <form>
          <input type="text" id="blockNum" name="blockNum" value={Block4Change.num}></input>
          <label for="blockNum">block number:</label>
          <br></br>
          <input type="text" id={"nonce"+Block4Change.num} name={"nonce"} value={Block4Change.nonce} onChange={(e)=>{
            //e.stopPropagation()
            let temp=e.target.value;
            if (Number(temp)!=='NaN'){
              temp=Number(temp);
            }
            ChangeBlock(new BlockTransactions(Block4Change.num,temp,Block4Change.allTransactions,Block4Change.prevHash,"",Block4Change.peer,Block4Change.type_code));
          }}></input>
          <label for="nonce">nonce:</label>
          <br></br>
            <div className="allTransactions">
              <p>Tx: </p>
              {Block4Change.allTransactions.map(transaction=>
              <TransactionFullBlockchain transaction={transaction} publicKey={props.publicKey} updateTransaction={calculateNewHashAndChangeBlockchain} key={transaction.number} />)}
            </div>
          <label for="prevHash"> Prev Hash</label>
          <input type="text" id="prevHash" name="prevHash" value={Block4Change.prevHash} readOnly></input>
          <br></br>
          <label for="hash">Hash</label>
          <input type="text" id="hash" name="hash" value={Block4Change.hash} readOnly></input>
          <br></br>
        </form>
        <button onClick={()=>{Block4Change.mine(4);
          ChangeBlock(new BlockTransactions(Block4Change.num,Block4Change.nonce,Block4Change.allTransactions,Block4Change.prevHash,Block4Change.hash,Block4Change.peer,Block4Change.type_code))}}>Mine</button>
      </div>
    );
  
}
  
function TransactionFullBlockchain(props){
    const [TransactionDetails,ChangeTransaction]=useState(props.transaction);
    useEffect(()=>{
      if (TransactionDetails.verifyTransaction(props.publicKey)){
        document.getElementById("transactionSig").style.color="black";
      }else{
        document.getElementById("transactionSig").style.color="red";
      }
        props.updateTransaction(TransactionDetails);
    },[TransactionDetails])
    if (TransactionDetails.isCoinbase){
        return (
            <form>
                <div className="transactionSignVer">
                    <label for="amount">Amount</label>
                    <input type="text" id="amount" name="amount" value={TransactionDetails.amount} onChange={(e)=>{
                        ChangeTransaction(new TransactionSignature(TransactionDetails.number,e.target.value,TransactionDetails.from,TransactionDetails.to,TransactionDetails.isCoinbase));
                    }}></input>
                    <label for="to">To</label>
                    <input type="text" id="to" name="to" value={TransactionDetails.to} onChange={(e)=>{
                        ChangeTransaction(new TransactionSignature(TransactionDetails.number,TransactionDetails.amount,TransactionDetails.from,e.target.value,TransactionDetails.isCoinbase));
                    }}></input>
                </div>
                <label for="transactionSig">Transaction signature</label>
                <br></br>
                <input type="text" id="transactionSig" name="transactionSig" value={TransactionDetails.sign} readOnly></input>
            </form>
        )
    } else {
    return(
        <div>
            <form>
              <div className="transactionSignVer">
                <label for="amount">Amount</label>
                <input type="text" id="amount" name="amount" value={TransactionDetails.amount} onChange={(e)=>{
                  ChangeTransaction(new TransactionSignature(TransactionDetails.number,e.target.value,TransactionDetails.from,TransactionDetails.to,TransactionDetails.isCoinbase));
                }}></input>
                <label for="from">From</label>
                <input type="text" id="from" name="from" value={TransactionDetails.from} onChange={(e)=>{
                  console.log(e.target.value);
                  ChangeTransaction(new TransactionSignature(TransactionDetails.number,TransactionDetails.amount,e.target.value,TransactionDetails.to,TransactionDetails.isCoinbase));
                }}></input>
                <label for="to">To</label>
                <input type="text" id="to" name="to" value={TransactionDetails.to} onChange={(e)=>{
                  ChangeTransaction(new TransactionSignature(TransactionDetails.number,TransactionDetails.amount,TransactionDetails.from,e.target.value,TransactionDetails.isCoinbase));
                }}></input>
              </div>
              <label for="transactionSig">Transaction signature</label>
              <br></br>
              <input type="text" id="transactionSig" name="transactionSig" value={TransactionDetails.sign} readOnly></input>
            </form>
        </div>
      )
    }
}

export default FullBlockchain;