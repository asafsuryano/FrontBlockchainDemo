import React, { useEffect, useState, useRef } from 'react';
import sha256 from 'sha256';

function HashUi(){
    const [Text,ChangeText]=useState("");
    useEffect(()=>{
      document.getElementById("hashResult").value=sha256(Text);
    },[Text])
    return (
      <div className="container">
        <div className="hash-form">
          <div className="form-control">
            <h3  for="data">Data</h3>
            <textarea id="data" name="data" onInput={e=>{
              ChangeText(e.target.value);
              }}></textarea>
            <br></br>
            <textarea id="hashResult"></textarea>
          </div>
        </div>
      </div>
    )
}

export default HashUi;