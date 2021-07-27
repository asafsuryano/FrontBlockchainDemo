import React, { useEffect, useState, useRef } from 'react';
import {ConnectingWithServerFunctions} from './ClassesForProject';
import BlockWithTransactions from './BlockTransactionUI';

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

export default Tokens;