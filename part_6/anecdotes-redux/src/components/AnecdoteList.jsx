import { useSelector, useDispatch } from 'react-redux';
import { upvoteAnecdote } from '../reducers/anecdoteReducer';
import { messenger } from '../reducers/messageReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector((state) => state.anecdotes);
    const filter = useSelector((state) => state.filter);

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

    const filteredAnecdotes = filter
        ? sortedAnecdotes.filter((a) =>
            a.content.toLowerCase().startsWith(filter.toLowerCase())
        )
        : sortedAnecdotes;

    const dispatch = useDispatch();

    const upvote = (id, content) => {
        dispatch(upvoteAnecdote(id))
        dispatch(messenger(`Upvoted ${content}`, 2))
    }

    return (
        <>
            {filteredAnecdotes
                .map((anecdote) => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => upvote(anecdote.id, anecdote.content)}>
                                vote
                            </button>
                        </div>
                    </div>
                ))}
        </>
    )
}

export default AnecdoteList