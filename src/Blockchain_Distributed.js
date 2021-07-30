import React, { useEffect, useState, useRef } from 'react';
import {BlockDistributed, BlockTransactions, Transaction} from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import MineButton from './MineButton'

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
        <MineButton onClick={()=>{
          Block2Changed.mine(4);
          ChangeParameters(new BlockDistributed(Block2Changed.num,Block2Changed.nonce,Block2Changed.data,Block2Changed.prevHash,Block2Changed.hash,Block2Changed.peer,Block2Changed.type_code))}}>Mine</MineButton>
      </div>
    );
}

export default Distributed;