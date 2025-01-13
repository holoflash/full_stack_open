import { useState, useEffect } from 'react'
import nameService from './services/names'

const Persons = ({ filteredPersons, deleteName }) => {
  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.id}>
          <div>Name: {person.name}</div>
          <div>Number: {person.number} </div>
          <button onClick={() => deleteName(person.id, person.name)}>Delete</button>
        </div>
      ))}
    </div>
  )
};

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

const Filter = ({ filterBy, handleFilter }) => {
  return (
    <div>Filter: <input value={filterBy} onChange={handleFilter} /></div>
  )
};

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    nameService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updateNumber(existingPerson.id, { ...existingPerson, number: newNumber });
      }
      setNewName('')
      setNewNumber('')
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    nameService
      .create(newPerson)
      .then(returnedName => {
        setPersons(persons.concat(returnedName))
        setNewName('')
        setNewNumber('')
      })
  }

  const deleteName = (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
      nameService
        .deleteNameFromServer(id)
        .then(personToDelete =>
          setPersons(persons.filter(person => personToDelete.id !== person.id))
        )
    }
  }

  const updateNumber = (id, newObject) => {
    nameService
      .update(id, newObject)
      .then(updatedPerson => {
        setPersons(persons.map(person => (person.id == id ? updatedPerson : person)))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterBy(event.target.value.toLowerCase())
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().startsWith(filterBy))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter {...{ filterBy, handleFilter }} />
      <h3>Add New</h3>
      <Form {...{ addName, newName, handleNameChange, newNumber, handleNumberChange }} />
      <h3>Numbers</h3>
      <Persons {...{ filteredPersons, deleteName }} />
    </div>
  )
}

export default App