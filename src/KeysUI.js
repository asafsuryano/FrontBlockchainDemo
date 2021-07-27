import {ConnectingWithServerFunctions} from './ClassesForProject';
import React, { useEffect, useState, useRef } from 'react';

function Keys(){
    const [Keys,ChangeKey]=useState(['0','0']);
    const mounted=useRef(true);
    useEffect(()=>{
      if (mounted.current){
        mounted.current=false;
        ConnectingWithServerFunctions.loadKey().then((val)=>{ChangeKey(val);});
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

export default Keys;