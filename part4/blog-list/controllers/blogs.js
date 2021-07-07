import express from 'express'
import Blog from '../models/blog.js'

const blogRouter = express.Router()

blogRouter.get('/', (_request, response) => {
  Blog
    .find({})
    .then(blogs => response.json(blogs))
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => response.status(201).json(result))
})

export default blogRouter
