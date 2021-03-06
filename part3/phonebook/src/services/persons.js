import axios from "axios"

const BASE_URL = '/api/persons'

/** getAll returns a promise that resolves to a list of persons */
const getAll = () => axios.get(BASE_URL)
  .then(response => response.data)
  .catch(error => {
    if (error.response) {
      throw error.response.data.error
    }
  })

/** addEntry returns a promise that resolves to the person who has just been added */
const addEntry = (person) => axios.post(BASE_URL, person)
  .then(response => response.data)
  .catch(error => {
    if (error.response) {
      throw error.response.data.error
    }
  })

/** changeEntry changes the entry of a given ID to person */
const changeEntry = (id, person) => axios.put(BASE_URL + "/" + id, person)
  .then(response => response.data)
  .catch(error => { 
    if (error.response) {
      throw error.response.data.error
    }
  })

/** deleteEntry delets a person with a particular ID */
const deleteEntry = (id) => axios.delete(BASE_URL + "/" + id)
  .then(response => response.data)
  .catch(error => { 
    if (error.response) {
      throw error.response.data.error
    }
  })

const exportedObject = { getAll, addEntry, changeEntry, deleteEntry }

export default exportedObject
