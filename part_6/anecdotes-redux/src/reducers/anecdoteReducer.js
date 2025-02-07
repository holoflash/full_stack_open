import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    add(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setAnecdotes, add, vote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdoteToDb = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(add(anecdote))
  }
}

export const upvoteAnecdote = (id) => {
  return async dispatch => {
    const upvoted = await anecdoteService.addVote(id)
    const anecdotes = await anecdoteService.getAll()
    const newAnecdotes = anecdotes.map((a) => (a.id !== id ? a : upvoted))
    dispatch(setAnecdotes(newAnecdotes))
  }
}

export default anecdoteSlice.reducer