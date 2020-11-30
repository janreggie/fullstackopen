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

    /** check if newName is in persons.
     * I *can* do `persons.map(p => p.name).includes(newName)` but I'd rather not because potential performance issues.
     * The function just reduces acc, initially to false, to check if any cur.name equals newName.
     * If acc is true, then it stays true.
     **/
    const isInPersons = persons.reduce((acc, cur) => ( acc ? acc : cur.name === newName ), false)
    if (isInPersons) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
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
 * Persons displays persons that contain the string searchFor.
 * Ignore case.
 * 
 * @param {{persons: {name: string, number: string}[], searchFor: string}}
 */
const Persons = ({ persons, searchFor }) => {
  const onlyDisplay = persons.filter(person => person.name.toLocaleLowerCase().includes(searchFor))

  return (
    <div>
      {onlyDisplay.map(person => <div key={person.name}>{person.name} {person.number}</div>)}
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
      <Persons persons={persons} searchFor={searchFor} />
    </div>
  )
}

export default App;
