import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Persons from './components/Persons'
import Form from './components/Form'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [message, setMessage] = useState({
    text: null,
    type: 'good'
  })

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage(prev => ({ ...prev, text: null }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    personService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames)
      })
      .catch((error) => {
        setMessage(prev => ({ ...prev, text: `${error}`, type: 'error' }))
      })
  }, [message])

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

    personService
      .create(newPerson)
      .then(returnedName => {
        setPersons(persons.concat(returnedName))
        setNewName('')
        setNewNumber('')
        setMessage(prev => ({ ...prev, text: `Added ${returnedName.name}`, type: 'good' }))
      })
      .catch(error => {
        setMessage(prev => ({ ...prev, text: `${error.response.data.error}`, type: 'error' }))
      })
  }

  const deleteName = (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
      personService
        .deleteNameFromServer(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(prev => ({ ...prev, text: `Deleted ${name}`, type: 'error' }))
        })
        .catch(error => {
          setMessage(prev => ({
            ...prev,
            text: `Information of ${name} has already been removed from server`,
            type: 'error'
          }))
        })
    }
  }

  const updateNumber = (id, newObject) => {
    personService
      .update(id, newObject)
      .then(updatedPerson => {
        setPersons(persons.map(person => (person.id == id ? updatedPerson : person)))
        setMessage(prev => ({ ...prev, text: `Updated ${newObject.name}`, type: 'good' }))
      })
      .catch(error => {
        setMessage(prev => ({
          ...prev,
          text: `Information of ${newObject.name} has already been removed from server`,
          type: 'error'
        }))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterBy(event.target.value)
  }

  const filteredPersons = persons.filter(person => person?.name.toLowerCase().startsWith(filterBy.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter {...{ filterBy, handleFilter }} />
      <h3>Add New</h3>
      <Form {...{ addName, newName, handleNameChange, newNumber, handleNumberChange }} />
      <h3>Numbers</h3>
      <Persons {...{ filteredPersons, deleteName }} />
    </div>
  )
}

export default App