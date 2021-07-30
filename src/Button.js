import PropTypes from 'prop-types'


const Button = ({ color, text, onClick, kind }) => {
  return (
    <button
      onClick={() => { console.log('clicked');onClick();}}
      style={{ backgroundColor: color }}
      className='btn'
    >
      {text} {kind}
    </button>
  )
}

Button.defaultProps = {
  color: 'gray',
  kind: undefined
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  kind:  PropTypes.object,
  onClick: PropTypes.func
}

export default Button