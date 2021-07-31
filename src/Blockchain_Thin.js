import React, { useEffect, useState, useRef } from 'react';
import {Block} from './ClassesForProject';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import MineButton from './MineButton'


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
        <label for="blockNum">block number:</label>
          <input type="text" id="blockNum" name="blockNum" value={Block2Changed.num}></input>
          <br></br>
          <label for="nonce">nonce:</label>
          <input type="text" id={"nonce"+Block2Changed.num} name={"nonce"} value={Block2Changed.nonce} onChange={(e)=>{
            //e.stopPropagation(
              console.log(e.target.value);
            ChangeParameters(new Block(Block2Changed.num,e.target.value,Block2Changed.data,Block2Changed.prevHash,"",Block2Changed.type_code));
          }}></input>
          <br></br>
          <label for="dataArea">Data:</label>
          <input type="textarea" id={"dataArea"+Block2Changed.num} name="dataArea" onChange={(e)=>{
            //e.stopPropagation();
            ChangeParameters(new Block(Block2Changed.num,Block2Changed.nonce,e.target.value,Block2Changed.prevHash,"",Block2Changed.type_code));
          }}></input>
          <br></br> 
          <label for="prevHash">Prev Hash:</label>
          <input type="text" id={"prevHash"+Block2Changed.num} name="prevHash" value={Block2Changed.prevHash} onChange={()=>{}} readOnly>
            </input>
          <br></br>
          <label for="blockHash">Hash:</label>
          <input type="text" id={"blockHash"+Block2Changed.num} name="blockHash" value={Block2Changed.hash} onChange={()=>{}}  readOnly></input>
          <br></br>
          <br></br>
        </form>
        <MineButton onClick={()=>{Block2Changed.mine(4);ChangeParameters(new Block(Block2Changed.num,Block2Changed.nonce,Block2Changed.data,Block2Changed.prevHash,Block2Changed.hash,Block2Changed.type_code))}}>Mine</MineButton>
      </div>
    );
}

export default BlockChainUI;