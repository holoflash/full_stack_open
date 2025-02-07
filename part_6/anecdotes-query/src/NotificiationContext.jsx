import { createContext, useReducer, useContext, useEffect } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.payload;
    case 'CLEAR_MESSAGE':
      return '';
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGE' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const value = { notification, dispatch };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const { notification, dispatch } = useContext(NotificationContext);
  return { notification, dispatch };
};

export const useMessenger = () => {
  const { notification } = useNotification();
  return notification;
}

export const useNotificationDispatch = () => {
  const { dispatch } = useNotification();
  return dispatch;
};


export default NotificationContext;