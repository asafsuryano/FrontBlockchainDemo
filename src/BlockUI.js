import React, { useEffect, useState, useRef } from 'react';
import {Block} from './ClassesForProject';


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

export default BlockUi