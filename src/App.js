import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import sha256 from 'sha256';
import {Block} from './ClassesForProject';
import {BlockDistributed, BlockTransactions, Transaction} from './ClassesForProject';
import { Message, TransactionSignature } from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import axios from  'axios';


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
      {(Page===1 &&
      <HashUi />)||
      (Page===2 && 
      <BlockUi />)||
      (Page===3 &&
      <BlockChainUI />)||
      (Page===4 &&
      <Distributed />)||
      (Page===5 &&
      <Tokens />)||
      (Page===6 &&
      <Coinbase />)||
      (Page===7 &&
      <Keys />)||
      (Page===8 &&
      <SignatureAndVerify />)||
      (Page===9 &&
      <TransactionSignOrVerify />)||
      (Page===10 &&
      <FullBlockchain />)}
    </div>
  );
}

function HashUi(){
  const [Text,ChangeText]=useState("");
  useEffect(()=>{
    document.getElementById("hashResult").value=sha256(Text);
  },[Text])
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
  const [Block1,ChangeParameters]=useState(new Block(0,0,"","","","single"));
  useEffect(()=>{
    document.getElementById("blockHash").value=Block1.hash;
  },[Block1])
  return (
    <div>
      <div className="blockUi">
        <form>
          <input type="text" id="blockNum" name="blockNum" value={Block1.num} readOnly></input>
          <label for="blockNum">block number:</label>
          <br></br>
          <input type="textarea" id="nonce" name="nonce" value={Block1.nonce} onInput={e=>{
            ChangeParameters(new Block(Block1.num,e.target.value,Block1.data,Block1.prevHash,"","single"));
          }}></input>
          <label for="nonce">nonce:</label>
          <br></br>
          <input type="textarea"  id="dataArea" name="dataArea" onInput={e=>{
            ChangeParameters(new Block(Block1.num,Block1.nonce,e.target.value,Block1.prevHash,"","single"));
          }}></input>
          <label for="dataArea">Data:</label>
          <br></br>
          <input type="text" id="blockHash" name="blockHash" readOnly></input>
          <label for="blockHash">Hash:</label>
        </form>
        <button onClick={()=>{Block1.mine(4);ChangeParameters(new Block(Block1.num,Block1.nonce,Block1.data,Block1.prevHash,Block1.hash,Block1.type_code))}}>Mine</button>
    </div>
    </div>
  );
}

function BlockChainUI(){
  const mounted=useRef(true);
  let i=0;
  const [AllBlocks,ChangeBlock]=useState(undefined);
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocks.slice();
    newAllblocksPeers[blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers.length;i++){
      newAllblocksPeers[i].prevHash=newAllblocksPeers[i-1].hash;
      newAllblocksPeers[i].calculateHash();
    }
    ChangeBlock(newAllblocksPeers)
  })
  let loadBlocksForThinBlockchain=(async()=>{
    let blocks= await ConnectingWithServerFunctions.loadBlocksThinBlockchain();
    ChangeBlock(blocks);
  })
  useEffect(()=>{
    if (mounted.current){
      mounted.current=false;
      loadBlocksForThinBlockchain();
    }
  })
  if (AllBlocks===undefined){
    return(
      <h1>please wait until the server finishes loading</h1>
    )
  } else {
    return (
      <div>
        {AllBlocks.map(element =>
          (<BlockBlockchainUi  changeByIndex={ChangeByIndex} newBlock = {element} prevHash={element.prevHash} key={i++} /> ))
        } 
      </div>
    )
  }
}
function BlockBlockchainUi(props){
  const [Block2Changed,ChangeParameters]=useState(props.newBlock);
  const mounted=useRef(true);
  useEffect(()=>{
    //if (mounted.current){
      if (Block2Changed.checkCorrectHash(4)){
        document.getElementById("BlockBlockchain"+Block2Changed.num).style.backgroundColor="green";
      }else{
        document.getElementById("BlockBlockchain"+Block2Changed.num).style.backgroundColor="red";
      }
      mounted.current=false;
    //}
  })
  useEffect(()=>{
    document.getElementById("blockHash"+Block2Changed.num).value=Block2Changed.hash;
    if (Block2Changed.checkCorrectHash(4)){
      document.getElementById("BlockBlockchain"+Block2Changed.num).style.backgroundColor="green";
    }else{
      document.getElementById("BlockBlockchain"+Block2Changed.num).style.backgroundColor="red";
    }
    props.changeByIndex(Block2Changed);
  },[Block2Changed])
  return (
    <div id={"BlockBlockchain"+Block2Changed.num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block2Changed.num}></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block2Changed.num} name={"nonce"} value={Block2Changed.nonce} onChange={(e)=>{
          //e.stopPropagation(
            console.log(e.target.value);
          ChangeParameters(new Block(Block2Changed.num,e.target.value,Block2Changed.data,Block2Changed.prevHash,"",Block2Changed.type_code));
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
        <input type="textarea" id={"dataArea"+Block2Changed.num} name="dataArea" onChange={(e)=>{
          //e.stopPropagation();
          ChangeParameters(new Block(Block2Changed.num,Block2Changed.nonce,e.target.value,Block2Changed.prevHash,"",Block2Changed.type_code));
        }}></input>
        <label for="dataArea">Data:</label>
        <br></br> 
        <input type="text" id={"prevHash"+Block2Changed.num} name="prevHash" value={Block2Changed.prevHash} onChange={()=>{}} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block2Changed.num} name="blockHash" value={Block2Changed.hash} onChange={()=>{}}  readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
        <br></br>
      </form>
      <button onClick={()=>{Block2Changed.mine(4);ChangeParameters(new Block(Block2Changed.num,Block2Changed.nonce,Block2Changed.data,Block2Changed.prevHash,Block2Changed.hash,Block2Changed.type_code))}}>Mine</button>
    </div>
  );
}

function BlockDistributedUI(props){
  const [Block2Changed,ChangeParameters]=useState(props.newBlock);
  const mounted=useRef(true);
  useEffect(()=>{
    //if (mounted.current){
      if (Block2Changed.checkCorrectHash(4)){
        document.getElementById("BlockBlockchain"+Block2Changed.peer+Block2Changed.num).style.backgroundColor="green";
      }else{
        document.getElementById("BlockBlockchain"+Block2Changed.peer+Block2Changed.num).style.backgroundColor="red";
      }
      mounted.current=false;
    //}
  })
  useEffect(()=>{
    document.getElementById("blockHash"+Block2Changed.num).value=Block2Changed.hash;
    if (Block2Changed.checkCorrectHash(4)){
      document.getElementById("BlockBlockchain"+Block2Changed.peer+Block2Changed.num).style.backgroundColor="green";
    }else{
      document.getElementById("BlockBlockchain"+Block2Changed.peer+Block2Changed.num).style.backgroundColor="red";
    }
      props.changeByIndex(Block2Changed);
  },[Block2Changed])
  return (
    <div id={"BlockBlockchain"+Block2Changed.peer+Block2Changed.num}>
      <form>
        <input type="text" id="blockNum" name="blockNum" value={Block2Changed.num} onChange={()=>{}} readOnly></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block2Changed.num} name={"nonce"} value={Block2Changed.nonce} onChange={(e)=>{
          console.log("in onchange nonce text");
          //e.stopPropagation()
          ChangeParameters(new BlockDistributed(Block2Changed.num,e.target.value,Block2Changed.data,Block2Changed.prevHash,"",Block2Changed.peer,Block2Changed.type_code));
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
        <input type="textarea" id={"dataArea"+Block2Changed.num} name="dataArea" onChange={(e)=>{
          console.log("in onchange data");
          //e.stopPropagation();
          ChangeParameters(new BlockDistributed(Block2Changed.num,Block2Changed.nonce,e.target.value,Block2Changed.prevHash,"",Block2Changed.peer,Block2Changed.type_code));
        }}></input>
        <label for="dataArea">Data:</label>
        <br></br> 
        <input type="text" id={"prevHash"+Block2Changed.num} name="prevHash" value={props.prevHash} onChange={()=>{}} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block2Changed.num} name="blockHash" value={Block2Changed.hash} onChange={()=>{}} readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
        <br></br>
      </form>
      <button onClick={()=>{
        Block2Changed.mine(4);
        ChangeParameters(new BlockDistributed(Block2Changed.num,Block2Changed.nonce,Block2Changed.data,Block2Changed.prevHash,Block2Changed.hash,Block2Changed.peer,Block2Changed.type_code))}}>Mine</button>
    </div>
  );
}


function Distributed(){
  const [AllblocksPeers,ChangeBlocks]=useState(undefined);
  const mounted=useRef(true);
  let peerNumber=1;
  let i=0;
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllblocksPeers.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks(newAllblocksPeers)
  })
  let loadBlocksForDistributed=(async()=>{
    let blocks = await ConnectingWithServerFunctions.loadBlocksDistributed();
    ChangeBlocks(blocks);
  })
  useEffect(()=>{
    if (mounted.current){
      mounted.current=false;
      loadBlocksForDistributed();
    }
  })
  if (AllblocksPeers===undefined){
    return (<h1>please until all blocks are loaded</h1>)
  } else {
    return(
      <div>
        {AllblocksPeers.map((peerType)=>{
          return(
          <div>
          <h1>{"peer "+peerNumber++}</h1>
          {peerType.map((element)=>
          <BlockDistributedUI changeByIndex={ChangeByIndex}  newBlock={element} prevHash={element.prevHash} key={i++} />)}
          </div>
          )})}
      </div>
    )
  }
}

function Tokens(){
  const mounted=useRef(true);
  let peerNumber=1;
  let i=0;
  const [AllBlocksTokens,ChangeBlocks]=useState(undefined);
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocksTokens.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks(newAllblocksPeers)
  })
  let loadBlocksForTokens=(async()=>{
    let blocks = await ConnectingWithServerFunctions.loadBlocksTokens();
    ChangeBlocks(blocks);
  })
  useEffect(()=>{
    if (mounted.current){
      mounted.current=false;
      loadBlocksForTokens();
    }
  })
  if (AllBlocksTokens===undefined){
    return(<div><h1>please wait until all blocks load</h1></div>)
  }else {
    return(
      <div>
        {
          AllBlocksTokens.map((peerType)=>{
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
}

function Coinbase(){
  const mounted=useRef(true);
  let peerNumber=1;
  let i=0;
  const [AllBlocksCoinbase,ChangeBlocks]=useState(undefined);
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=AllBlocksCoinbase.slice();
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    console.log(newAllblocksPeers);
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    ChangeBlocks(newAllblocksPeers)
  })
  let loadBlocksForCoinbase=(async()=>{
    let blocks = await ConnectingWithServerFunctions.loadBlocksCoinbase();
    ChangeBlocks(blocks);
  })
  useEffect(()=>{
    if (mounted.current){
      mounted.current=false;
      loadBlocksForCoinbase();
    }
  })
  if (AllBlocksCoinbase===undefined){
    return(<div><h1>please wait until all blocks load</h1></div>);
  }else{
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
}

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
        <input type="text" id="blockNum" name="blockNum" value={Block3Changed.num} readOnly></input>
        <label for="blockNum">block number:</label>
        <br></br>
        <input type="text" id={"nonce"+Block3Changed.num} name={"nonce"} value={Block3Changed.nonce} onChange={(e)=>{
          //e.stopPropagation()
          ChangeParameters(new BlockTransactions(Block3Changed.num,e.target.value,Block3Changed.allTransactions,Block3Changed.prevHash,"",Block3Changed.peer,Block3Changed.type_code));
        }}></input>
        <label for="nonce">nonce:</label>
        <br></br>
          <div className="allTransactions">
            <p>Tx: </p>
            {Block3Changed.allTransactions.map(transaction=>
            <TransactionUi transaction={transaction} updateTransaction={calculateNewHashAndChangeBlockchain} key={transaction.number} />)}
          </div>
        <input type="text" id={"prevHash"+Block3Changed.num} name="prevHash" value={props.prevHash} readOnly>
          </input>
        <label for="prevHash">Prev Hash:</label>
        <br></br>
        <input type="text" id={"blockHash"+Block3Changed.num} name="blockHash" value={Block3Changed.hash}  readOnly></input>
        <label for="blockHash">Hash:</label>
        <br></br>
      </form>
      <button onClick={()=>{
        Block3Changed.mine(4);
        ChangeParameters(new BlockTransactions(Block3Changed.num,Block3Changed.nonce,Block3Changed.allTransactions,Block3Changed.prevHash,Block3Changed.hash,Block3Changed.peer,Block3Changed.type_code));
      }}>Mine</button>
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

function Keys(){
  const [Keys,ChangeKey]=useState(['0','0']);
  const mounted=useRef(true);
  useEffect(()=>{
    if (mounted.current){
      mounted.current=false;
      loadKeys().then((val)=>{ChangeKey(val);});
    }else{
      document.getElementById("private").value=Keys[0].slice(27,Keys[0].length-26);
      document.getElementById("public").value=Keys[1].slice(26,Keys[1].length-25);
    }
  },[Keys])
  return(
    <div>
      <button onClick={()=>{ConnectingWithServerFunctions.generateNewKey().then((val)=>{ChangeKey(val)})}}>Generate random key pair</button>
      <form>
        <label htmlFor="private">Private key</label>
        <input type="text" id="private" name="private" readOnly></input>
        <br></br>
        <label htmlFor="public"> Public key</label>
        <input type="text" id="public" name="public" readOnly></input>
      </form>
    </div>
  )
}


function SignatureAndVerify(){
  const [MessageDetails,ChangeMessage]=useState(new Message("",""));
  const [SignOrVerify,ChangeState]=useState(1);
  const mounted=useRef(true);
  const [Keys,Change]=useState(['0','0']);
  useEffect(()=>{
    console.log(MessageDetails.sign);
    if (mounted.current){
      mounted.current=false;
      console.log("in mounted");
      ConnectingWithServerFunctions.loadKey().then((val)=>{Change(val);});
    }else{
      document.getElementById("signature").value=MessageDetails.sign;
    }
  })
  return(
    <div>
      <div>
        <button onClick={()=>{ChangeState(1)}}> Sign</button>
        <button onClick={()=>{ChangeState(2)}}> Verify</button>
      </div>
      {(SignOrVerify===1 &&
        (<div>
          <form>
            <label  for="message">  Message text:</label>
            <br></br>
            <input type="text" id="message" name="message" onChange={(e)=>{ChangeMessage(new Message(e.target.value,MessageDetails.sign))}}></input>
            <br></br>
            <label for="privateKey"> Private key</label>
            <br></br>
            <input type="text" id="privateKey" name="privateKey" value={Keys[0].slice(27,Keys[0].length-26)} readOnly></input>
            <br></br>
          </form>
            <button  onClick={async()=>{
              let sign= await MessageDetails.signMessage(Keys[0]);
              ChangeMessage(new Message(MessageDetails.text,sign))}}>Sign</button>
            <br></br>
          <form>
            <label for="signature">Signature</label>
            <br></br>
            <input type="text" id="signature" name="signature" value={MessageDetails.sign} readOnly></input>
            </form>
        </div>))||
        (SignOrVerify===2 &&
          (<div id="messageBlock">
            <form>
              <label  for="message">  Message text:</label>
              <br></br>
              <input type="text" id="message" name="message" onChange={(e)=>{ChangeMessage(new Message(e.target.value,MessageDetails.sign))}}></input>
              <br></br>
              <label for="publicKey"> Public key</label>
              <br></br>
              <input type="text" id="publicKey" name="publicKey" value={Keys[1].slice(26,Keys[1].length-25)} readOnly></input>
              <br></br>
              <label for="signature">Signature</label>
              <br></br>
              <input type="text" id="signature" name="signature" value={MessageDetails.sign} readonly></input>
              <br></br>
            </form>
              <button  onClick={async()=>{
                let ans = await MessageDetails.verifyMessage(Keys[1]);
                if (ans){
                  document.getElementById("messageBlock").style.backgroundColor="green";
                }else{
                  document.getElementById("messageBlock").style.backgroundColor="red";
                }
              }}>Verify</button>
              <br></br>
          </div>))}
    </div>
  )
}

function TransactionSignOrVerify(){
  const [MessageDetails,ChangeTransaction]=useState(new TransactionSignature(0,20,"A","B",false,""));
  const [SignOrVerify,ChangeState]=useState(1);
  const mounted=useRef(true);
  const [Keys,Change]=useState(['0','0']);
  useEffect(()=>{
    console.log(MessageDetails);
    if (mounted.current){
      mounted.current=false;
      console.log("in mounted");
      ConnectingWithServerFunctions.loadKey().then((val)=>{Change(val);});
    }else{
      document.getElementById("transactionSig").value=MessageDetails.sign;
    }
  })
  return(
    <div>
      <div>
        <button onClick={()=>{ChangeState(1)}}> Sign</button>
        <button onClick={()=>{ChangeState(2)}}> Verify</button>
      </div>
      <div>
      {(SignOrVerify===1 &&
        (<div>
          <form>
            <div className="transactionSignVer">
              <label for="amount">Amount</label>
              <input type="text" id="amount" name="amount" value={MessageDetails.amount} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,e.target.value,MessageDetails.from,MessageDetails.to,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
              <label for="from">From</label>
              <input type="text" id="from" name="from" value={MessageDetails.from} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,e.target.value,MessageDetails.to,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
              <label for="to">To</label>
              <input type="text" id="to" name="to" value={MessageDetails.to} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,MessageDetails.from,e.target.value,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
            </div>
            <label for="privateKey">Private Key</label>
            <br></br>
            <input type="text" id="privateKey" name="privateKey" value={Keys[0]}></input>
            <br></br>
          </form>
            <button onClick={async()=>{
              let sign = await MessageDetails.signTransaction(Keys[0]);
              ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,MessageDetails.from,MessageDetails.to,MessageDetails.isCoinbase,sign))}}>Sign transaction</button>
            <br></br>
          <form>
            <label for="transactionSig">Transaction signature</label>
            <br></br>
            <input type="text" id="transactionSig" name="transactionSig" value={MessageDetails.sign} readOnly></input>
          </form>
        </div>))||
        (SignOrVerify===2 &&
          (<div id="TransactionBox">
            <form>
            <div className="transactionSignVer">
              <label for="amount">Amount</label>
              <input type="text" id="amount" name="amount" value={MessageDetails.amount} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,e.target.value,MessageDetails.from,MessageDetails.to,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
              <label for="from">From</label>
              <input type="text" id="from" name="from" value={MessageDetails.from} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,e.target.value,MessageDetails.to,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
              <label for="to">To</label>
              <input type="text" id="to" name="to" value={MessageDetails.to} onChange={(e)=>{
                ChangeTransaction(new TransactionSignature(MessageDetails.number,MessageDetails.amount,MessageDetails.from,e.target.value,MessageDetails.isCoinbase,MessageDetails.sign))
              }}></input>
            </div>
            <br></br>
            <label for="PublicKey">Public Key</label>
            <br></br>
            <input type="text" id="publicKey" name="publicKey" value={Keys[1]}></input>
            <br></br>
            <label for="transactionSig">Transaction signature</label>
            <br></br>
            <input type="text" id="transactionSig" name="transactionSig" value={MessageDetails.sign} readOnly></input>
            <br></br>
          </form>
            <button onClick={async()=>{
              let ans = await MessageDetails.verifyTransaction(Keys[1]);
              if (ans){
                document.getElementById("TransactionBox").style.backgroundColor="green";
              }else{
                document.getElementById("TransactionBox").style.backgroundColor="red";
              }}}>Verify transaction</button>
          
          </div>))}
      </div>
    </div>
  )
}

function FullBlockchain(){
  const mounted=useRef(true);
  const [KeysAndAllBlocksInBlockchain,Change]=useState(undefined);
  let i=1;
  let ChangeByIndex=((blockToChange)=>{
    let newAllblocksPeers=KeysAndAllBlocksInBlockchain[1].slice();
    console.log(blockToChange);
    newAllblocksPeers[blockToChange.peer][blockToChange.num]=blockToChange;
    for (let i=blockToChange.num+1;i<newAllblocksPeers[blockToChange.peer].length;i++){
      newAllblocksPeers[blockToChange.peer][i].prevHash=newAllblocksPeers[blockToChange.peer][i-1].hash;
      newAllblocksPeers[blockToChange.peer][i].hash=newAllblocksPeers[blockToChange.peer][i].calculateHash();
    }
    Change([KeysAndAllBlocksInBlockchain[0],newAllblocksPeers]) 
  })
  let loadKeysAndSignAllTransactions=(async()=>{
    let keys=await ConnectingWithServerFunctions.loadKey();
    console.log("loaded keys");
    let allBlocks=await ConnectingWithServerFunctions.loadFullBlockchain();
    console.log("loaded all blocks");
    for (let i=0;i<allBlocks.length;i++){
      for (let j=0;j<allBlocks[i].length;j++){
        for (let k=0;k<allBlocks[i][j].allTransactions.length;k++){
          allBlocks[i][j].allTransactions[k].sign=await allBlocks[i][j].allTransactions[k].signTransaction(keys[0]);
        }
      }
      console.log("finished with "+i+" block");
    }
    Change([keys,allBlocks]);
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
  const [Block4Change,ChangeBlock]=useState([props.newBlock,false]);
  let calculateNewHashAndChangeBlockchain=((transaction)=>{
    let allTransactions=Block4Change[0].allTransactions;
    allTransactions[transaction.number]=transaction;
    let newBlock=new BlockTransactions(Block4Change[0].num,Block4Change[0].nonce,allTransactions,Block4Change[0].prevHash,"",Block4Change[0].peer,Block4Change[0].type_code);
    ChangeBlock([newBlock,true]);
  })
  useEffect(()=>{
    document.getElementById("hash").value=Block4Change[0].hash;
    if (Block4Change[0].checkCorrectHash(4)){
      document.getElementById("block"+Block4Change[0].peer+Block4Change[0].num).style.backgroundColor="green";
    }else{
      document.getElementById("block"+Block4Change[0].peer+Block4Change[0].num).style.backgroundColor="red";
    }
    if (Block4Change[1]===true){
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
          ChangeBlock([new BlockTransactions(Block4Change[0].num,e.target.value,Block4Change[0].allTransactions,Block4Change[0].prevHash,"",Block4Change[0].peer,Block4Change[0].type_code),true]);
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
    if (TransactionDetails[1]===true){
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


async function loadKeys(){
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

/*
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
*/

function loadAllBlocksInChain(){

}


export default App;
