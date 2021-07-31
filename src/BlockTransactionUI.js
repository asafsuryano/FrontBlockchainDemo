import {BlockDistributed, BlockTransactions, Transaction} from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import React, { useEffect, useState, useRef } from 'react';
import MineButton from './MineButton'

function BlockWithTransactions(props){
    const [Block3Changed,ChangeParameters]=useState(props.newBlock);
    const mounted=useRef(true);
    useEffect(()=>{
      //if (mounted.current){
        if (Block3Changed.checkCorrectHash(4)){
          document.getElementById("BlockBlockchain"+Block3Changed.peer+Block3Changed.num).style.backgroundColor="green";
        }else{
          document.getElementById("BlockBlockchain"+Block3Changed.peer+Block3Changed.num).style.backgroundColor="red";
        }
        mounted.current=false;
      //}
    })
    useEffect(()=>{
      document.getElementById("BlockBlockchain"+Block3Changed.peer+Block3Changed.num).value=Block3Changed.hash;
      if (Block3Changed.checkCorrectHash(4)){
        document.getElementById("BlockBlockchain"+Block3Changed.peer+Block3Changed.num).style.backgroundColor="green";
      }else{
        document.getElementById("BlockBlockchain"+Block3Changed.peer+Block3Changed.num).style.backgroundColor="red";
      }
      props.updateBlockchainPeer(Block3Changed);
    },[Block3Changed])
    let calculateNewHashAndChangeBlockchain=((transaction)=>{
        let allTransactions=Block3Changed.allTransactions.slice();
        allTransactions[transaction.number]=transaction;
        let newBlock=new BlockTransactions(Block3Changed.num,Block3Changed.nonce,allTransactions,Block3Changed.prevHash,"",Block3Changed.peer,Block3Changed.type_code);
        ChangeParameters(newBlock);
    });
    return (
      <div id={"BlockBlockchain"+Block3Changed.peer+Block3Changed.num}>
        <form>
        <label for="blockNum">block number:</label>
          <input type="text" id="blockNum" name="blockNum" value={Block3Changed.num} readOnly></input>
          <br></br>
          <label for="nonce">nonce:</label>
          <input type="text" id={"nonce"+Block3Changed.num} name={"nonce"} value={Block3Changed.nonce} onChange={(e)=>{
            //e.stopPropagation()
            ChangeParameters(new BlockTransactions(Block3Changed.num,e.target.value,Block3Changed.allTransactions,Block3Changed.prevHash,"",Block3Changed.peer,Block3Changed.type_code));
          }}></input>
          <br></br>
            <div className="allTransactions">
              <p>Tx: </p>
              {Block3Changed.allTransactions.map(transaction=>
              <TransactionUi transaction={transaction} updateTransaction={calculateNewHashAndChangeBlockchain} key={transaction.number} />)}
            </div>
          <label for="prevHash">Prev Hash:</label>
          <input type="text" id={"prevHash"+Block3Changed.num} name="prevHash" value={props.prevHash} readOnly>
            </input>
          <br></br>
          <label for="blockHash">Hash:</label>
          <input type="text" id={"blockHash"+Block3Changed.num} name="blockHash" value={Block3Changed.hash}  readOnly></input>
          <br></br>
        </form>
        <MineButton onClick={()=>{
          Block3Changed.mine(4);
          ChangeParameters(new BlockTransactions(Block3Changed.num,Block3Changed.nonce,Block3Changed.allTransactions,Block3Changed.prevHash,Block3Changed.hash,Block3Changed.peer,Block3Changed.type_code));
        }}>Mine</MineButton>
      </div>
    );
  
}


function TransactionUi(props){
    const [Details,ChangeDetails]=useState(props.transaction);
    useEffect(()=>{
      props.updateTransaction(Details);
    },[Details])
    if (Details.isCoinbase){
      return(
        <div>
          <form className="transactionUI">
            <label for="amount">Amount:</label>
            <input type="text" id="amount" name="amount" value={Details.amount} onChange={(e)=>{
              let amount=e.target.value;
              if (Number(e.target.value)!=='Nan'){
                amount=Number(e.target.value);
              }
               ChangeDetails(new Transaction(Details.number,amount,Details.from,Details.to,true))
            }}></input>
            <label for="to">To:</label>
            <input type="text" id="to" name="to" value={Details.to} onChange={(e)=>{
              ChangeDetails(new Transaction(Details.Details.amount.value,Details.from,e.target.value,true))
            }}></input>
          </form>
        </div>
      )
    }else{
      return(
        <div>
          <form className="transactionUI">
            <label for="amount">Amount:</label>
            <input type="text" id="amount" name="amount" value={Details.amount} onChange={(e)=>{
                let amount=e.target.value;
                if (Number(e.target.value)!=='Nan'){
                  amount=Number(e.target.value);
                }
               ChangeDetails(new Transaction(Details.number,amount,Details.from,Details.to,false))
            }}></input>
            <label for="from">From:</label>
            <input type="text" id="from" name="from" value={Details.from} onChange={(e)=>{
               ChangeDetails(new Transaction(Details.number,Details.amount,e.target.value,Details.to,false))
            }}></input>
            <label for="to">To:</label>
            <input type="text" id="to" name="to" value={Details.to} onChange={(e)=>{
               ChangeDetails(new Transaction(Details.number,Details.amount,Details.from,e.target.value,false))
            }}></input>
          </form>
        </div>
      )
    }
}

export default BlockWithTransactions;