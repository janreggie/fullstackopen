import express from 'express'
import cors from 'cors'
import middleware from './utils/middleware.js'
import blogRouter from './controllers/blogs.js'
import 'express-async-errors' // No need for try-except's in controllers/notes.js

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
