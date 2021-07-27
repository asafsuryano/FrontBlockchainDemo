import {ConnectingWithServerFunctions} from './ClassesForProject';
import { Message, TransactionSignature } from './ClassesForProject';
import React, { useEffect, useState, useRef } from 'react';

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

export default SignatureAndVerify;

