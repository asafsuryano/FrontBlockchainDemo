import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import sha256 from 'sha256';
import {Block} from './ClassesForProject';
import {BlockDistributed, BlockTransactions, Transaction} from './ClassesForProject';
import { Message, TransactionSignature } from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import axios from  'axios';
const crypto=require("crypto");
const { generateKeyPair } = require('crypto');


function App() {
  const [Page,ChangeState] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={()=>ChangeState(1)}> Hash </button>
        <button onClick={()=>ChangeState(2)}> Block </button>
        <button onClick={()=>ChangeState(3)}> Blockchain</button>
        <button onClick={()=>ChangeState(4)}> Distributed</button>
        <button onClick={()=>ChangeState(5)}> Tokens</button>
        <button onClick={()=>ChangeState(6)}> Coinbase</button>
        <button onClick={()=>ChangeState(7)}> Keys</button>
        <button onClick={()=>ChangeState(8)}> Signature</button>
        <button onClick={()=>ChangeState(9)}> TransactionSignature</button>
        <button onClick={()=>ChangeState(10)}> Blockchain</button>

      </header>
      {(Page==1 &&
      <HashUi />)||
      (Page==2 && 
      <BlockUi />)||
      (Page==3 &&
      <BlockChainUI />)||
      (Page==4 &&
      <Distributed />)||
      (Page==5 &&
      <Tokens />)||
      (Page==6 &&
      <Coinbase />)||
      (Page==7 &&
      <Keys />)||
      (Page==8 &&
      <SignatureAndVerify />)||
      (Page==9 &&
      <TransactionSignOrVerify />)||
      (Page==10 &&
      <FullBlockchain />)}
    </div>
  );
}

function HashUi(){
  const [Text,ChangeText]=useState("");
  useEffect(()=>{
    document.getElementById("hashResult").value=sha256(Text);
  })
  return (
    <div className="hashUi">
      <textarea id="data" name="data" onInput={e=>{
        ChangeText(e.target.value);
        }}></textarea>
      <label  for="data">Data</label>
      <br></br>
      <textarea id="hashResult"></textarea>
    </div>
  )
}

function BlockUi(){
  const [Block1,ChangeParameters]=useState(new Block(0,0,"",""));
  useEffect(()=>{
    document.getElementById("blockHash").value=Block1.hash;
  })
  return (
    <div>
      <div className="blockUi">
        <form>
          <input type="text" id="blockNum" name="blockNum" value={Block1.num} readOnly></input>
          <label for="blockNum">block number:</label>
          <br></br>
          <input type="textarea" id="nonce" name="nonce" value={Block1.nonce} onInput={e=>{
            ChangeParameters(new Block(Block1.num,e.target.value,Block1.data,Block1.prevHash));
          }}></input>
          <label for="nonce">nonce:</label>
          <br></br>
          <input type="textarea"  id="dataArea" name="dataArea" onInput={e=>{
            ChangeParameters(new Block(Block1.num,Block1.nonce,e.target.value,Block1.prevHash));
          }}></input>
          <label for="dataArea">Data:</label>
          <br></br>
          <input type="text" id="blockHash" name="blockHash" readOnly></input>
          <label for="blockHash">Hash:</label>
        </form>
        <button onClick={()=>Block1.mine(2)}>Mine</button>
    </div>
    </div>
  );
}

function BlockChainUI(){
  let i=0;
  let blocks=[];
  blocks=loadBlocks();
  const [AllBlocks,ChangeBlock]=useState(blocks);
  let ChangeByIndex=((blockToChange)=>{
    let blocks1=[];
    console.log("block number to  change "+blockToChange.num);
    let num=0;
    for (let i=0;i<blockToChange.num;i++){
      blocks1.push(AllBlocks[i]);
      num++;  
    }
    if (num>0){
      blockToChange.prevHash=blocks1[num-1].hash;
    }
    blocks1.push(blockToChange);
    for (let i=blockToChange.num+1;i<AllBlocks.length;i++){
      blocks1.push(new Block(i,AllBlocks[i].nonce,AllBlocks[i].data,blocks1[i-1].hash));
    }
    ChangeBlock([...blocks1]);
  })
  return (
    <div>
      {AllBlocks.map(element =>
        (<BlockBlockchainUi  changeByIndex={ChangeByIndex} newBlock = {element} prevHash={element.prevHash} key={i++} /> ))
      } 
    </div>
  )
}
function BlockBlockchainUi(props){
  const [Block2Changed,ChangeParameters]=useState([props.newBlock,false]);
  const mounted = useRef();
  useEffect(()=>{
    document.getElementById("blockHash"+Block2Changed[0].num).value=Block2Changed[0].hash;
    if (Block2Changed[0].checkCorrectHash(3)){
      document.getElementById("BlockBlockchain"+Block2Changed[0].num).style.backgroundColor="green";
    }else{
      document.getElementById("BlockBlockchain"+Block2Changed[0].num).style.backgroundColor="red";
    }
    if (Block2Changed[1]==true){
      Block2Changed[1]=false;
      props.changeByIndex(Block2Changed[0]);
    }
  })
  return (
    <div id={"BlockBlockchain"+Block2Changed[0].num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block2Changed[0].num}></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block2Changed[0].num} name={"nonce"} value={Block2Changed[0].nonce} onChange={(e)=>{
          //e.stopPropagation()
          ChangeParameters([...[new Block(Block2Changed[0].num,e.target.value,Block2Changed[0].data,Block2Changed[0].prevHash),true]]);
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
        <input type="textarea" id={"dataArea"+Block2Changed[0].num} name="dataArea" onChange={(e)=>{
          //e.stopPropagation();
          ChangeParameters([...[new Block(Block2Changed[0].num,Block2Changed[0].nonce,e.target.value,Block2Changed[0].prevHash),true]]);
        }}></input>
        <label for="dataArea">Data:</label>
        <br></br> 
        <input type="text" id={"prevHash"+Block2Changed[0].num} name="prevHash" value={props.prevHash} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block2Changed[0].num} name="blockHash" value={Block2Changed[0].hash}  readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
        <br></br>
      </form>
      {}
    </div>
  );
}

function BlockDistributedUI(props){
  const [Block2Changed,ChangeParameters]=useState([props.newBlock,false]);
  useEffect(()=>{
    document.getElementById("blockHash"+Block2Changed[0].num).value=Block2Changed[0].hash;
    if (Block2Changed[0].checkCorrectHash(3)){
      document.getElementById("BlockBlockchain"+Block2Changed[0].num).style.backgroundColor="green";
    }else{
      document.getElementById("BlockBlockchain"+Block2Changed[0].num).style.backgroundColor="red";
    }
    if (Block2Changed[1]==true){
      Block2Changed[1]=false;
      props.changeByIndex(Block2Changed[0]);
    }
  })
  return (
    <div id={"BlockBlockchain"+Block2Changed[0].num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block2Changed[0].num}></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block2Changed[0].num} name={"nonce"} value={Block2Changed[0].nonce} onChange={(e)=>{
          //e.stopPropagation()
          ChangeParameters([...[new BlockDistributed(Block2Changed[0].num,e.target.value,Block2Changed[0].data,Block2Changed[0].prevHash,Block2Changed[0].peer),true]]);
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
        <input type="textarea" id={"dataArea"+Block2Changed[0].num} name="dataArea" onChange={(e)=>{
          //e.stopPropagation();
          ChangeParameters([...[new BlockDistributed(Block2Changed[0].num,Block2Changed[0].nonce,e.target.value,Block2Changed[0].prevHash,Block2Changed[0].peer),true]]);
        }}></input>
        <label for="dataArea">Data:</label>
        <br></br> 
        <input type="text" id={"prevHash"+Block2Changed[0].num} name="prevHash" value={props.prevHash} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block2Changed[0].num} name="blockHash" value={Block2Changed[0].hash}  readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
        <br></br>
      </form>
      {}
    </div>
  );
}


function Distributed(){
  let blocks=[];
  blocks=loadBlocksDistributed();
  console.log("in distributed");
  const [AllblocksPeers,ChangeBlocks]=useState(blocks);
  console.log(AllblocksPeers);
  let peerNumber=1;
  let i=0;
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllblocksPeers.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].hash=newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks([...newAllblocksPeers])
  })
  return(
    <div>
      {AllblocksPeers.map((peerType)=>{
        return(
        <div>
        <h1>{"peer "+peerNumber++}</h1>
        {peerType.map(element=>
          <BlockDistributedUI changeByIndex={ChangeByIndex}  newBlock = {element} prevHash={element.prevHash} key={i++} />)}
        </div>
        )})}
    </div>
  )
}

function Tokens(){
  let blocks=loadBlocksTokens();
  let peerNumber=1;
  let i=0;
  const [AllBlocksTokens,ChangeBlocks]=useState(blocks);
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocksTokens.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].hash=newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks([...newAllblocksPeers])
  })
  return(
    <div>
      {
        AllBlocksTokens.map((peerType)=>{
          return(
            <div>
              <h1>{"peer "+peerNumber++}</h1>
              {peerType.map(element=>
                <BlockWithTransactions newBlock = {element} prevHash={element.prevHash} key={i++} />)}
            </div>
          )
        })
      }
    </div>
  )
}

function Coinbase(){
  let blocks=loadBlocksCoinbase();
  let peerNumber=1;
  let i=0;
  const [AllBlocksCoinbase,ChangeBlocks]=useState(blocks);
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocksCoinbase.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].hash=newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks([...newAllblocksPeers])
  })
  return(
    <div>
      {
        AllBlocksCoinbase.map((peerType)=>{
          return(
            <div>
              <h1>{"peer "+peerNumber++}</h1>
              {peerType.map(element=>
                <BlockWithTransactions updateBlockchainPeer={ChangeByIndex} newBlock = {element} prevHash={element.prevHash} key={i++} />)}
            </div>
          )
        })
      }
    </div>
  )
}

function BlockWithTransactions(props){
  const [Block3Changed,ChangeParameters]=useState([props.newBlock,false]);
  useEffect(()=>{
    document.getElementById("blockHash"+Block3Changed[0].num).value=Block3Changed[0].hash;
    if (Block3Changed[0].checkCorrectHash(3)){
      document.getElementById("BlockBlockchain"+Block3Changed[0].num).style.backgroundColor="green";
    }else{
      document.getElementById("BlockBlockchain"+Block3Changed[0].num).style.backgroundColor="red";
    }
    if (Block3Changed[1]){
      Block3Changed[1]=false;
      props.updateBlockchainPeer(Block3Changed[0]);
    }
  })
  let calculateNewHashAndChangeBlockchain=((transaction)=>{
    console.log(transaction);
      let allTransactions=Block3Changed[0].allTransactions;
      allTransactions[transaction.number]=transaction;
      let newBlock=new BlockTransactions(Block3Changed[0].num,Block3Changed[0].nonce,allTransactions,Block3Changed[0].prevHash,Block3Changed[0].peer);
      ChangeParameters([newBlock,true]);
  });
  return (
    <div id={"BlockBlockchain"+Block3Changed[0].num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block3Changed[0].num}></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block3Changed[0].num} name={"nonce"} value={Block3Changed[0].nonce} onChange={(e)=>{
          //e.stopPropagation()
          ChangeParameters([...[new Block(Block3Changed[0].num,e.target.value,Block3Changed[0].data,Block3Changed[0].prevHash),true]]);
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
          <div className="allTransactions">
            <p>Tx: </p>
            {Block3Changed[0].allTransactions.map(transaction=>
            <TransactionUi transaction={transaction} updateTransaction={calculateNewHashAndChangeBlockchain} key={transaction.number} />)}
          </div>
        <input type="text" id={"prevHash"+Block3Changed[0].num} name="prevHash" value={props.prevHash} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block3Changed[0].num} name="blockHash" value={Block3Changed[0].hash}  readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
        <br></br>
      </form>
      {}
    </div>
  );

}
function TransactionUi(props){
  const [Details,ChangeDetails]=useState([props.transaction,false]);
  useEffect(()=>{
    if (Details[1]==true){
      Details[1]=false;
      props.updateTransaction(Details[0]);
    }
  })
  if (Details.isCoinbase){
    return(
      <div>
        <form className="transactionUI">
          <label for="amount">Amount:</label>
          <input type="text" id="amount" name="amount" value={Details[0].amount} onChange={(e)=>{
             ChangeDetails([...[new Transaction(Details[0].number,e.target.value,Details[0].from,Details[0].to,true),true]])
          }}></input>
          <label for="to">To:</label>
          <input type="text" id="to" name="to" value={Details[0].to} onChange={(e)=>{
            ChangeDetails([...[new Transaction(Details[0].Details[0].amount.value,Details[0].from,e.target.value,true),true]])
          }}></input>
        </form>
      </div>
    )
  }else{
    return(
      <div>
        <form className="transactionUI">
          <label for="amount">Amount:</label>
          <input type="text" id="amount" name="amount" value={Details[0].amount} onChange={(e)=>{
             ChangeDetails([...[new Transaction(Details[0].number,e.target.value,Details[0].from,Details[0].to,false),true]])
          }}></input>
          <label for="from">From:</label>
          <input type="text" id="from" name="from" value={Details[0].from} onChange={(e)=>{
             ChangeDetails([...[new Transaction(Details[0].number,Details[0].amount,e.target.value,Details[0].to,false),true]])
          }}></input>
          <label for="to">To:</label>
          <input type="text" id="to" name="to" value={Details[0].to} onChange={(e)=>{
             ChangeDetails([...[new Transaction(Details[0].number,Details[0].amount,Details[0].from,e.target.value,false),true]])
          }}></input>
        </form>
      </div>
    )
  }
}

function Keys(){
  const [Keys,ChangeKey]=useState([]);
  useEffect(()=>{
    if (Keys[0]!==undefined){
      document.getElementById("private").value=Keys[0].slice(27,Keys[0].length-26);
      document.getElementById("public").value=Keys[1].slice(26,Keys[1].length-25);
    }
  })
  return(
    <div>
      <form>
        <button onClick={()=>{}}>Generate random key pair</button>
        <label for="private">Private key</label>
        <input type="text" id="private" name="private" value={Keys[0]} readOnly></input>
        <br></br>
        <label for="public"> Public key</label>
        <input type="text" id="public" name="public" value={Keys[1]} readOnly></input>
      </form>
    </div>
  )
}


function SignatureAndVerify(){
  const [MessageDetails,ChangeMessage]=useState(new Message(""));
  const [SignOrVerify,ChangeState]=useState(1);
  let keys=loadKeys();
  return(
    <div>
      <div>
        <button onClick={()=>{ChangeState(1)}}> Sign</button>
        <button onClick={()=>{ChangeState(2)}}> Verify</button>
      </div>
      {(SignOrVerify==1 &&
        (<div>
          <form>
            <label  for="message">  Message text:</label>
            <br></br>
            <input type="text" id="message" name="message" onChange={(e)=>{ChangeMessage(new Message(e.target.value))}}></input>
            <br></br>
            <label for="privateKey"> Private key</label>
            <br></br>
            <input type="text" id="privateKey" name="privateKey" value={keys[0]} readOnly></input>
            <br></br>
            <button  onClick={()=>{MessageDetails.signMessage(keys[0])}}>Sign</button>
            <br></br>
            <label for="signature">Signature</label>
            <br></br>
            <input type="text" id="signature" name="signature" value={MessageDetails.sign} readOnly></input>
          </form>
        </div>))||
        (SignOrVerify==2 &&
          (<div id="messageBlock">
            <form>
              <label  for="message">  Message text:</label>
              <br></br>
              <input type="text" id="message" name="message" onChange={(e)=>{ChangeMessage(new Message(e.target.value))}}></input>
              <br></br>
              <label for="publicKey"> Private key</label>
              <br></br>
              <input type="text" id="publicKey" name="publicKey" value={keys[1]} readOnly></input>
              <label for="signature">Signature</label>
              <br></br>
              <input type="text" id="signature" name="signature" value={MessageDetails.sign} readonly></input>
              <br></br>
              <button  onClick={()=>{
                if (MessageDetails.verifyMessage(keys[1])){
                  document.getElementById("messageBlock").style.backgroundColor="green";
                }else{
                  document.getElementById("messageBlock").style.backgroundColor="red";
                }
              }}>Verify</button>
              <br></br>
            </form>
          </div>))}
    </div>
  )
}

function TransactionSignOrVerify(){
  const [MessageDetails,ChangeTransaction]=useState(new TransactionSignature(0,20,"A","B",false));
  const [SignOrVerify,ChangeState]=useState(1);
  let keys=loadKeys();
  return(
    <div>
      <div>
        <button onClick={()=>{ChangeState(1)}}> Sign</button>
        <button onClick={()=>{ChangeState(2)}}> Verify</button>
      </div>
      <div>
      {(SignOrVerify==1 &&
        (<div>
          <form>
            <div className="transactionSignVer">
              <label for="amount">Amount</label>
              <input type="text" id="amount" name="amount" value={MessageDetails.amount} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,e.target.value,MessageDetails.from,MessageDetails.to,MessageDetails.isCoinbase))
              }}></input>
              <label for="from">From</label>
              <input type="text" id="from" name="from" value={MessageDetails.from} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,e.target.value,MessageDetails.to,MessageDetails.isCoinbase))
              }}></input>
              <label for="to">To</label>
              <input type="text" id="to" name="to" value={MessageDetails.to} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,MessageDetails.from,e.target.value,MessageDetails.isCoinbase))
              }}></input>
            </div>
            <label for="privateKey">Private Key</label>
            <br></br>
            <input type="text" id="privateKey" name="privateKey" value={keys[0]}></input>
            <br></br>
            <button onClick={()=>{MessageDetails.signTransaction(keys[0])}}>Sign transaction</button>
            <br></br>
            <label for="transactionSig">Transaction signature</label>
            <br></br>
            <input type="text" id="transactionSig" name="transactionSig" value={MessageDetails.sign} readOnly></input>
          </form>
        </div>))||
        (SignOrVerify==2 &&
          (<div id="TransactionBox">
            <form>
            <div className="transactionSignVer">
              <label for="amount">Amount</label>
              <input type="text" id="amount" name="amount" value={MessageDetails.amount} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,e.target.value,MessageDetails.from,MessageDetails.to,MessageDetails.isCoinbase))
              }}></input>
              <label for="from">From</label>
              <input type="text" id="from" name="from" value={MessageDetails.from} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,e.target.value,MessageDetails.to,MessageDetails.isCoinbase))
              }}></input>
              <label for="to">To</label>
              <input type="text" id="to" name="to" value={MessageDetails.to} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,MessageDetails.from,e.target.value,MessageDetails.isCoinbase))
              }}></input>
            </div>
            <br></br>
            <label for="PublicKey">Public Key</label>
            <br></br>
            <input type="text" id="publicKey" name="publicKey" value={keys[1]}></input>
            <br></br>
            <label for="transactionSig">Transaction signature</label>
            <br></br>
            <input type="text" id="transactionSig" name="transactionSig" value={MessageDetails.sign} readOnly></input>
            <br></br>
            <button onClick={()=>{
              if (MessageDetails.verifyTransaction(keys[1])){
                document.getElementById("TransactionBox").style.backgroundColor="green";
              }else{
                document.getElementById("TransactionBox").style.backgroundColor="red";
              }}}>Verify transaction</button>
          </form>
          </div>))}
      </div>
    </div>
  )
}

function FullBlockchain(){
  let blocksInChain=loadAllBlocksInChain();
  const [AllBlocksInBlockchain,ChangeBlocks]=useState(blocksInChain);
  let keys=loadKeys();
  let i=1;
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocksInBlockchain.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].hash=newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks([...newAllblocksPeers])
  })
  return (
    <div>
      {AllBlocksInBlockchain.map((peerType)=>{
        return(
          <div>
            <h1>{"Peer "+i++}</h1>
            {peerType.map((element)=>{
              <BlockFullBlockchain ChangeByIndex={ChangeByIndex} publicKey={keys[1]} newBlock={element} />
            })}
          </div>
        )
      })}
    </div>
  )
}

function BlockFullBlockchain(props){
  const [Block4Change,ChangeBlock]=useState([props.newBlock,false]);
  let calculateNewHashAndChangeBlockchain=((transaction)=>{
    let allTransactions=Block4Change[0].allTransactions;
    allTransactions[transaction.number]=transaction;
    let newBlock=new BlockTransactions(Block4Change[0].num,Block4Change[0].nonce,allTransactions,Block4Change[0].prevHash,Block4Change[0].peer);
    ChangeBlock([newBlock,true]);
  })
  useEffect(()=>{
    document.getElementById("hash").value=Block4Change[0].hash;
    if (Block4Change[0].checkCorrectHash(3)){
      document.getElementById("block"+Block4Change[0].peer+Block4Change[0].num).style.backgroundColor="green";
    }else{
      document.getElementById("block"+Block4Change[0].peer+Block4Change[0].num).style.backgroundColor="red";
    }
    if (Block4Change[1]==true){
      Block4Change[1]=false;
      props.ChangeByIndex(Block4Change[0]);
    }
  })
  return(
    <div id={"block"+Block4Change[0].peer+Block4Change[0].num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block4Change[0].num}></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block4Change[0].num} name={"nonce"} value={Block4Change[0].nonce} onChange={(e)=>{
          //e.stopPropagation()
          ChangeBlock([...[new Block(Block4Change[0].num,e.target.value,Block4Change[0].data,Block4Change[0].prevHash),true]]);
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
          <div className="allTransactions">
            <p>Tx: </p>
            {Block4Change[0].allTransactions.map(transaction=>
            <TransactionFullBlockchain transaction={transaction} publicKey={props.publicKey} updateTransaction={calculateNewHashAndChangeBlockchain} key={transaction.number} />)}
          </div>
        <label for="prevHash"> Prev Hash</label>
        <input type="text" id="prevHash" name="prevHash" value={Block4Change[0].prevHash} readOnly></input>
        <br></br>
        <label for="hash">Hash</label>
        <input type="text" id="hash" name="hash" value={Block4Change[0].hash} readOnly></input>
        <br></br>
      </form>
    </div>
  );

}

function TransactionFullBlockchain(props){
  const [TransactionDetails,ChangeTransaction]=useState([props.transaction,false]);
  useEffect(()=>{
    if (TransactionDetails[0].verifyTransaction(props.publicKey)){
      document.getElementById("transactionSig").style.color="black";
    }else{
      document.getElementById("transactionSig").style.color="red";
    }
    if (TransactionDetails[1]==true){
      TransactionDetails[1]=false;
      props.updateTransaction(TransactionDetails[0]);
    }
  })
  return(
    <div>
        <form>
          <div className="transactionSignVer">
            <label for="amount">Amount</label>
            <input type="text" id="amount" name="amount" value={TransactionDetails.amount} onChange={(e)=>{
              ChangeTransaction([new TransactionSignature(TransactionDetails[0].number,e.target.value,TransactionDetails[0].from,TransactionDetails[0].to,TransactionDetails[0].isCoinbase),true]);
            }}></input>
            <label for="from">From</label>
            <input type="text" id="from" name="from" value={TransactionDetails.from} onChange={(e)=>{
              ChangeTransaction([new TransactionSignature(TransactionDetails[0].number,TransactionDetails[0].amount,e.target.value,TransactionDetails[0].to,TransactionDetails[0].isCoinbase),true]);
            }}></input>
            <label for="to">To</label>
            <input type="text" id="to" name="to" value={TransactionDetails.to} onChange={(e)=>{
              ChangeTransaction([new TransactionSignature(TransactionDetails[0].number,TransactionDetails[0].amount,TransactionDetails[0].from,e.target.value,TransactionDetails[0].isCoinbase),true]);
            }}></input>
          </div>
          <label for="transactionSig">Transaction signature</label>
          <br></br>
          <input type="text" id="transactionSig" name="transactionSig" value={TransactionDetails[0].sign} readOnly></input>
        </form>
    </div>
  )
}

// function loadBlocks(){
//   let res= await axios.get('http://localhost:4341/blocks')
//   return res;
// }
function loadBlocks(){
  let blocks=[];
  blocks.push(new Block(0,0,"","000000000000000000000000000000000000000000000000000000000000000"));
  blocks[0].mine(3);
  for (let i=1;i<4;i++){
    blocks.push(new Block(i,0,"",blocks[i-1].hash));
    blocks[i].mine(3);
  }
  return blocks;
}
/*
function loadBlocksDistributed(){
  load blocks from server and organize to differrent arrays by peer
}
*/
function loadBlocksDistributed(){
  let blocks=[];
  let blocksA=[];
  let blocksB=[];
  let blocksC=[];
  blocksA.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000",1));
  blocksA[0].mine(3);
  blocksB.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000",2));
  blocksB[0].mine(3);
  blocksC.push(new BlockDistributed(0,0,"","000000000000000000000000000000000000000000000000000000000000000",3));
  blocksC[0].mine(3);
  for (let i=1;i<4;i++){
    blocksA.push(new BlockDistributed(i,0,"",blocksA[i-1].hash,1));
    blocksA[i].mine(3);
    blocksB.push(new BlockDistributed(i,0,"",blocksB[i-1].hash,2));
    blocksB[i].mine(3);
    blocksC.push(new BlockDistributed(i,0,"",blocksC[i-1].hash,3));
    blocksC[i].mine(3);
  }
  blocks.push(blocksA,blocksB,blocksC);
  return blocks;
}

/*function loadBlocksTokens(){
  load all blocks with transactions from server
}*/

function loadBlocksTokens(){
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
  blocksA.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",1));
  blocksA[0].mine(3);
  blocksB.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",2));
  blocksB[0].mine(3);
  blocksC.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",3));
  blocksC[0].mine(3);
  for (let i=1;i<4;i++){
    blocksA.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksA[i-1].hash,1));
    blocksA[i].mine(3);
    blocksB.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksB[i-1].hash,2));
    blocksB[i].mine(3);
    blocksC.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksC[i-1].hash,3));
    blocksC[i].mine(3);
  }
  blocks.push(blocksA,blocksB,blocksC);
  return blocks;
}

/*
function loadBlocksCoinbase(){
  load from server blocks with coinbase
}
*/
function loadBlocksCoinbase(){
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
  blocksA.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",1));
  blocksA[0].mine(3);
  blocksB.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",2));
  blocksB[0].mine(3);
  blocksC.push(new BlockTransactions(0,0,allTransactions1,"000000000000000000000000000000000000000000000000000000000000000",3));
  blocksC[0].mine(3);
  for (let i=1;i<4;i++){
    blocksA.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksA[i-1].hash,1));
    blocksA[i].mine(3);
    blocksB.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksB[i-1].hash,2));
    blocksB[i].mine(3);
    blocksC.push(new BlockTransactions(i,0,allTransactionsArr[i],blocksC[i-1].hash,3));
    blocksC[i].mine(3);
  }
  blocks.push(blocksA,blocksB,blocksC);
  return blocks;
}

/*
function loadKeys(){
  load keys from database
}
*/

function loadKeys(){
  generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    }
  }, (err, publicKey, privateKey) => {
    return [privateKey,publicKey];
  });
}

function loadAllBlocksInChain(){

}

export default App;
