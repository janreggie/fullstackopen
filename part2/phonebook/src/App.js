import React, { useEffect, useState } from 'react'
import personData from './services/persons'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchFor, setSearchFor] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => personData.getAll().then(persons => setPersons([...persons, {name: 'Rogue Rougeson', id: 1001, number: '303 444944949 '}])), [])

  const transientNotice = (message) => {
    setNotice(message)
    setTimeout(() => setNotice(''), 5000)
  }
  const transientError = (message) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notice message={notice} />
      <Error message={error} />
      <Filter searchFor={searchFor} setSearchFor={setSearchFor} />

      <h3>add a new</h3>
      <EntryForm persons={persons} setPersons={setPersons} setNotice={transientNotice} />

      <h3>Numbers</h3>
      <Persons persons={persons} setPersons={setPersons} searchFor={searchFor} setNotice={transientNotice} setError={transientError} />
    </div>
  )
}

/** 
 * MessageOrNone returns a div of some className containing message if it exists.
 * Otherwise, return null.
 */
const MessageOrNone = ({ message, cN }) => {
  if (!message) {
    return null
  }

  return (
    <div className={cN}>
      {message}
    </div>
  )
}

const Notice = ({ message }) => <MessageOrNone message={message} cN='notice' />
const Error = ({ message }) => <MessageOrNone message={message} cN='error' />

/** Filter sets what to filter for */
const Filter = ({ searchFor, setSearchFor }) => (
  <div>
    filter shown with <input value={searchFor} onChange={(e) => setSearchFor(e.target.value)} />
  </div>
)

/** EntryForm submits entries */
const EntryForm = ({ persons, setPersons, setNotice }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  /** submitEntry handles submission of Phonebook form.
   * 
   * @param event {React.FormEvent<HTMLFormElement>}
   */
  const submit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const foundPerson = persons.find(person => person.name === newPerson.name)
    if (!!foundPerson) {
      const toUpdate = window.confirm(`${newPerson.name} is already in phonebook. Replace the old number with the new one?`)
      if (!toUpdate) {
        return
      }

      personData.changeEntry(foundPerson.id, newPerson)
        .then(returnedEntry => {
          setPersons(persons.map(person => person.name === returnedEntry.name ? returnedEntry : person))
          setNewName('')
          setNewNumber('')
          setNotice(`Modified ${returnedEntry.name}`)
        })

      return
    }

    personData.addEntry(newPerson)
      .then(returnedEntry => {
        setPersons(persons.concat(returnedEntry))
        setNewName('')
        setNewNumber('')
        setNotice(`Added ${returnedEntry.name}`)
      })
  }

  return (
    <form onSubmit={submit}>
      <div>
        name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

/** 
 * Persons displays persons that contain the string searchFor.
 * Ignore case.
 */
const Persons = ({ persons, setPersons, searchFor, setNotice, setError }) => {
  const onlyDisplay = persons.filter(person => person.name.toLocaleLowerCase().includes(searchFor))

  return (
    <div>
      {onlyDisplay.map(
        person => // They should teach us Redux soon...
          <Person key={person.id} allPersons={persons} person={person} setPersons={setPersons} setNotice={setNotice} setError={setError} />
      )}
    </div>
  )
}

/**
 * Person displays a person.
 * allPersons and setPersons are passed here to allow modification if an entry were deleted.
 */
const Person = ({ person, allPersons, setPersons, setNotice, setError }) => {
  const handleDelete = () => {
    const toDelete = window.confirm(`Delete ${person.name}?`)
    if (!toDelete) {
      return
    }

    personData.deleteEntry(person.id)
      .then(_ => setNotice(`${person.name} has been deleted`))
      .catch(_ => setError(`${person.name} has already been deleted from the server`))
    setPersons(allPersons.filter(pp => pp.id !== person.id))
  }

  return (
    <div>
      {person.name} {person.number} <button onClick={handleDelete}>delete</button>
    </div>
  )
}

export default App;
