import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import blogRouter from './controllers/blogs.js'

const app = express()

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
