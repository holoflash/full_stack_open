import { useMessenger } from '../NotificiationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const notification = useMessenger()
  console.log(notification)


  return (
    notification && (
      <div style={style} > {notification}</div>
    )
  )
}



export default Notification