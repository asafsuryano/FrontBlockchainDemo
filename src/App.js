import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import HashUi from './Hash';
import BlockUi from './BlockUI';
import BlockChainUI from './Blockchain_Thin';
import Distributed from './Blockchain_Distributed';
import Tokens from './BlockchainWithTokens';
import Coinbase from './BlockchainWithCoinbase';
import Keys from './KeysUI';
import SignatureAndVerify from './MessageSigAndVerify';
import TransactionSignOrVerify from './SignAndVerifyTransaction';
import FullBlockchain from './FullBlockchain';
import Button from './Button'


function App() {
  const [Page,ChangeState] = useState(0);
  return (
    <div className="App">
      <header className="App-header header">
      <Button onClick={()=>ChangeState(1)} text="Hash"></Button>
      <Button onClick={()=>ChangeState(2)} text="Block"></Button>
      <Button onClick={()=>ChangeState(3)} text="Thin Blockchain"></Button>
      <Button onClick={()=>ChangeState(4)} text="Distributed"></Button>
      <Button onClick={()=>ChangeState(5)} text="Tokens"></Button>
      <Button onClick={()=>ChangeState(6)} text="Coinbase"></Button>
      <Button onClick={()=>ChangeState(7)} text="Keys"></Button>
      <Button onClick={()=>ChangeState(8)} text="Signature"></Button>
      <Button onClick={()=>ChangeState(9)} text="TransactionSignature"></Button>
      <Button onClick={()=>ChangeState(10)} text="Full Blockchain"></Button>
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

export default App;
