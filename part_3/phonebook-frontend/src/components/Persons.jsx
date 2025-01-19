const Persons = ({ filteredPersons, deleteName }) => {
    return (
        <div>
            {filteredPersons.map(person => (
                <div key={person.id}>
                    <div>Name: {person.name}</div>
                    <div>Number: {person.number} </div>
                    <div>ID: {person.id} </div>
                    <button onClick={() => deleteName(person.id, person.name)}>Delete</button>
                </div>
            ))}
        </div>
    )
};

export default Persons