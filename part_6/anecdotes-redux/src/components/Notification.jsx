import { useSelector, useDispatch } from 'react-redux'
import { clearMessage } from '../reducers/messageReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.messages)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification !== '') {
    setTimeout(() => {
      dispatch(clearMessage())
    }, 5000);



    return (
      notification && (
        <div style={style}>
          {notification}
        </div>)
    )
  }
}

export default Notification