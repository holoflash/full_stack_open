const Form = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
    return (
        <form onSubmit={addName}>
            <div>Name: <input value={newName} onChange={handleNameChange} required /></div>
            <div>Number: <input value={newNumber} onChange={handleNumberChange} required /></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
};

export default Form