import React, { useEffect, useState, useRef } from 'react';
import sha256 from 'sha256';

function HashUi(){
    const [Text,ChangeText]=useState("");
    useEffect(()=>{
      document.getElementById("hashResult").value=sha256(Text);
    },[Text])
    return (
      <div className="hashUi">
        <textarea id="data" name="data" onInput={e=>{
          ChangeText(e.target.value);
          }}></textarea>
        <label  for="data">Data</label>
        <br></br>
        <textarea id="hashResult"></textarea>
      </div>
    )
}

export default HashUi;