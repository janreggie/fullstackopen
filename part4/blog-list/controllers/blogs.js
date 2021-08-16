import express from 'express'
import Blog from '../models/blog.js'

const blogRouter = express.Router()

blogRouter.get('/',
  async (_request, response) => {
    const blogposts = await Blog.find({})
    return response.json(blogposts)
  })

blogRouter.post('/',
  async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  })

blogRouter.delete('/:id',
  async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })

export default blogRouter
