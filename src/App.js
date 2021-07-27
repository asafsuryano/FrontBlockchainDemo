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


function App() {
  const [Page,ChangeState] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={()=>ChangeState(1)}> Hash </button>
        <button onClick={()=>ChangeState(2)}> Block </button>
        <button onClick={()=>ChangeState(3)}> Thin Blockchain</button>
        <button onClick={()=>ChangeState(4)}> Distributed</button>
        <button onClick={()=>ChangeState(5)}> Tokens</button>
        <button onClick={()=>ChangeState(6)}> Coinbase</button>
        <button onClick={()=>ChangeState(7)}> Keys</button>
        <button onClick={()=>ChangeState(8)}> Signature</button>
        <button onClick={()=>ChangeState(9)}> TransactionSignature</button>
        <button onClick={()=>ChangeState(10)}> Full Blockchain</button>
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
