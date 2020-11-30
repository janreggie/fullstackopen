import axios from "axios"

const BASE_URL = 'http://localhost:3001/persons'

/** getAll returns a promise that resolves to a list of persons */
const getAll = () => axios.get(BASE_URL).then(response => response.data)

/** addEntry returns a promise that resolves to the person who has just been added */
const addEntry = (person) => axios.post(BASE_URL, person).then(response => response.data)

export default { getAll, addEntry }
