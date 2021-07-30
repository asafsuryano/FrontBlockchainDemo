import React, { useEffect, useState, useRef } from 'react';
import {Block,BlockJsonToBlock} from './ClassesForProject';
import MineButton from './MineButton'
import InputProp from './InputProp'

function BlockUi(){
    const [Block1,ChangeParameters]=useState(() => {return new Block(0,0,"","","","single")});
    useEffect(()=>{
      // document.getElementById("blockHash").value=Block1.hash;
    },[Block1])
    return (
      <div>
        <div className="container blockUi">
          <form>
            
            <InputProp isReadOnly={true} type="text" name="blockNum" text="block number:" value={Block1.num}
            onChange={(e) =>{
              const blockData = {...Block1, num: e.target.value};
              const block = new BlockJsonToBlock(blockData);
              block.inner.calculateHash();
              ChangeParameters(block.inner);
            }} 
            ></InputProp>
        

          <InputProp type="number" name="nonce" text="nonce:" value={Block1.nonce}
            onChange={(e) =>{
              const blockData = {...Block1, nonce: e.target.value};
              const block = new BlockJsonToBlock(blockData);
              block.inner.calculateHash();
              ChangeParameters(block.inner);
            }}  ></InputProp>

          <InputProp type="textarea" name="dataArea" text="Data:" value={Block1.data}
            onChange={(e) =>{
              const blockData = {...Block1, data: e.target.value};
              const block = new BlockJsonToBlock(blockData);
              block.inner.calculateHash();
              ChangeParameters(block.inner);
            }}  ></InputProp>

          <InputProp type="text" name="blockHash" isReadOnly={true} text="Hash:" value={Block1.hash}
            ></InputProp>

            {/* <input type="text" id="blockHash" name="blockHash" readOnly></input>
            <label for="blockHash">Hash:</label> */}
          </form>
          <MineButton onClick={()=>{
            Block1.mine(4);
             const block = {...Block1
            };
            ChangeParameters(block);
            
            // ChangeParameters(new Block(Block1.num,Block1.nonce,Block1.data,Block1.prevHash,Block1.hash,Block1.type_code))
            // ChangeParameters(prevBlock => {return new Block(Block1.num,Block1.nonce,Block1.data,Block1.prevHash,Block1.hash,Block1.type_code)});
            
            }}></MineButton>
      </div>
      </div>
    );
}

export default BlockUi