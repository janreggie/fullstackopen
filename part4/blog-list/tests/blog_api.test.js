import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Blog from '../models/blog.js'
import { initialBlogposts } from './blog_test_helper.js'

const api = supertest(app)

beforeEach(
  async () => {
    await Blog.deleteMany({})
    const blogpostObjects = initialBlogposts.map(post => new Blog(post))
    const promiseArray = blogpostObjects.map(post => post.save())
    await Promise.all(promiseArray)
  })

afterAll(() => mongoose.connection.close())

test('blogposts are returned as JSON',
  async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('all blogposts are returned',
  async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogposts.length)

    const contents = response.body.map(r => [r.title, r.author, r.likes])
    const toExpect = initialBlogposts.map(r => [r.title, r.author, r.likes])
    expect(contents).toEqual(expect.arrayContaining(toExpect))
  })
