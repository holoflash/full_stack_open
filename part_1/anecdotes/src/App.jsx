import { useState } from 'react'

const AnecdoteOfTheDay = ({ anecdotes, selected, points, handleClick, handleVote }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <button onClick={handleClick}>next anecdote</button>
      <button onClick={() => handleVote(selected)}>vote</button>
    </>
  )
}

const AnecdoteWithMostVotes = ({ anecdotes, topAnecdote, points }) => {
  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[topAnecdote]}</p>
      <p>has {points[topAnecdote]} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [viewing, setViewing] = useState(0)

  const handleVote = (index) => {
    const nextPoints = points.map((c, i) => {
      if (i === index) {
        return c + 1;
      } else {
        return c;
      }
    })
    setPoints(nextPoints)
  }

  const handleClick = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * anecdotes.length);
    } while (randomIndex === viewing);

    setSelected(randomIndex);
    setViewing(randomIndex);
  };

  const topAnecdote = points.indexOf(Math.max(...points))

  return (
    <>
      <AnecdoteOfTheDay {...{ anecdotes, points, selected, handleClick, handleVote }} />
      <AnecdoteWithMostVotes {...{ anecdotes, topAnecdote, points }} />
    </>
  )
}

export default App