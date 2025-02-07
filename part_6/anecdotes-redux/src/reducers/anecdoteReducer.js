import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    add(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      state.find(an => an.id === action.payload).votes += 1
    }
  }
})


export const { setAnecdotes, add, vote } = anecdoteSlice.actions
export default anecdoteSlice.reducer