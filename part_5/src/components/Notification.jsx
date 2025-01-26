import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message.text === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
}

export default Notification
