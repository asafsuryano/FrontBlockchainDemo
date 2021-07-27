import {ConnectingWithServerFunctions} from './ClassesForProject';
import { Message, TransactionSignature } from './ClassesForProject';
import React, { useEffect, useState, useRef } from 'react';

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

export default TransactionSignOrVerify;