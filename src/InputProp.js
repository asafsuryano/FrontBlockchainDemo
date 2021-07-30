import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'



const InputProp =  ({ inputName, value, type, isReadOnly, text, onChange }) => {

    return (
            <div className={ isReadOnly? "contentLine readOnly":"contentLine" }>
                <label for={inputName}>{text}</label>
                
                <input type={type} id={inputName} name={inputName} value={value} readOnly={isReadOnly}
                onChange={onChange}></input>
                <br></br>
            </div>
    )
}

InputProp.defaultProps = {
    isReadOnly: false,
    type: "text"
  }

InputProp.propTypes = {
    text: PropTypes.string,
    inputName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isReadOnly:  PropTypes.bool,
    onChange: PropTypes.func.isRequired
}


export default InputProp

