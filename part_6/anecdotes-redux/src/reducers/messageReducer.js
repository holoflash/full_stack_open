import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showMessage(state, action) {
            return action.payload
        },
        clearMessage() {
            return initialState
        }
    }
})

export const { showMessage, clearMessage } = messageSlice.actions

export const messenger = (message, time) => {
    return dispatch => {
        dispatch(showMessage(message))
        setTimeout(() => {
            dispatch(clearMessage())
        }, (time * 1000));
    }
}

export default messageSlice.reducer