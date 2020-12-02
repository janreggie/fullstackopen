import React, { useEffect, useState } from 'react'
import personData from './services/persons'

/** Filter sets what to filter for */
const Filter = ({ searchFor, setSearchFor }) => (
  <div>
    filter shown with <input value={searchFor} onChange={(e) => setSearchFor(e.target.value)} />
  </div>
)

/** EntryForm submits entries */
const EntryForm = ({ persons, setPersons }) => {
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
        })

      return
    }

    personData.addEntry(newPerson)
      .then(returnedEntry => {
        setPersons(persons.concat(returnedEntry))
        setNewName('')
        setNewNumber('')
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
 * Person displays a person.
 * setPersons is passed here to allow modification if an entry were deleted.
 * 
 * @param {{person: {name: string, number: string, id: number}}}
 */
const Person = ({ person, setPersons }) => {
  const handleDelete = () => {
    const toDelete = window.confirm(`Delete ${person.name}?`)
    if (!toDelete) {
      return
    }

    personData.deleteEntry(person.id)
      .then(_ => personData.getAll().then(persons => setPersons(persons)))
  }

  return (
    <div>
      {person.name} {person.number} <button onClick={handleDelete}>delete</button>
    </div>
  )
}

/** 
 * Persons displays persons that contain the string searchFor.
 * Ignore case.
 */
const Persons = ({ persons, setPersons, searchFor }) => {
  const onlyDisplay = persons.filter(person => person.name.toLocaleLowerCase().includes(searchFor))

  return (
    <div>
      {onlyDisplay.map(person => <Person key={person.id} person={person} setPersons={setPersons} />)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchFor, setSearchFor] = useState('')

  useEffect(() => personData.getAll().then(persons => setPersons(persons)), [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchFor={searchFor} setSearchFor={setSearchFor} />

      <h3>add a new</h3>
      <EntryForm persons={persons} setPersons={setPersons} />

      <h3>Numbers</h3>
      <Persons persons={persons} setPersons={setPersons} searchFor={searchFor} />
    </div>
  )
}

export default App;
