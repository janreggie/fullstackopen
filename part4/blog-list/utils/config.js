import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3003
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = NODE_ENV === 'test'
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI

export default { PORT, MONGODB_URI, NODE_ENV }
