import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Blog from '../models/blog.js'
import { blogpostsInDB, initialBlogposts, removeIDFromBlogpost } from './blog_test_helper.js'

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

    const contents = response.body.map(removeIDFromBlogpost)
    const toExpect = initialBlogposts.map(removeIDFromBlogpost)
    expect(contents).toEqual(expect.arrayContaining(toExpect))
  })

test('desired properties exists',
  async () => {
    const response = await api.get('/api/blogs')
    const firstPost = response.body[0]

    const proplist = ['id', 'title', 'author', 'url', 'likes']
    proplist.map(prop => expect(firstPost).toHaveProperty(prop))
  })

test('can add entries properly',
  async () => {
    const post = { title: 'Ang Musmos na Kabihasnan ng Maynila', author: 'Ibn Saud', likes: 69 }
    await api
      .post('/api/blogs')
      .send(post)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogpostsAtEnd = await blogpostsInDB()
    const contents = blogpostsAtEnd.map(removeIDFromBlogpost)
    expect(contents).toHaveLength(initialBlogposts.length + 1)
    expect(contents).toContainEqual(post)
  })

test('if likes is missing, use zero as default',
  async () => {
    const post = { title: 'A post with undefined likes', author: 'Unliked author', url: 'https://exammple.com' }
    await api
      .post('/api/blogs')
      .send(post)
      .expect(201)

    const expectedPost = { ...post, likes: 0 }
    const blogpostsAtEnd = await blogpostsInDB()
    const contents = blogpostsAtEnd.map(removeIDFromBlogpost)
    expect(contents).toContainEqual(expectedPost)
  })
