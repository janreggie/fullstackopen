import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => response.json(blogs))
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => response.status(201).json(result))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
