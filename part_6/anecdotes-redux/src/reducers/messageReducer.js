import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showLikeMessage(state, action) {
            return `You upvoted '${action.payload}'`
        },
        showAddMessage(state, action) {
            return `'${action.payload}' added`
        },
        clearMessage() {
            return initialState
        }
    }
})

export const { showLikeMessage, showAddMessage, clearMessage } = messageSlice.actions
export default messageSlice.reducer