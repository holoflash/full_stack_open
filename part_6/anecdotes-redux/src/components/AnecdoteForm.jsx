import { addAnecdoteToDb } from '../reducers/anecdoteReducer';
import { useDispatch } from 'react-redux';
import { messenger } from '../reducers/messageReducer';

const AnecdoteForm = () => {
    const dispatch = useDispatch();
    const addAnecdote = async (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = '';
        dispatch(addAnecdoteToDb(content))
        dispatch(messenger(`${content} added`, 5))
    };
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <input name="anecdote" />
                <button type="submit">create</button>
            </form>
        </>
    )
}

export default AnecdoteForm