import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({ filteredPersons }) => {
  return (
    <ul>
      {filteredPersons.map(person => (
        <li key={person.id}>{person.name} {person.number}</li>
      ))}
    </ul>
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
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    for (const person in persons) {
      if (persons[person].name.toLowerCase() === newName.toLowerCase()) {
        alert(`${newName} is already added to phonebook`)
        return
      }
    }
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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
      <Persons {...{ filteredPersons }} />
    </div>
  )
}

export default App