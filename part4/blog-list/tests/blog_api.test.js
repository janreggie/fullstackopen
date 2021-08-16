import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Blog from '../models/blog.js'
import { blogpostsInDB, initialBlogposts, removeIDFromBlogpost } from './blog_test_helper.js'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogposts)
})

describe('in reading blogposts initially stored', () => {
  test('they are stored in JSON with their desired properties', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstPost = response.body[0]
    const proplist = ['id', 'title', 'author', 'url', 'likes']
    proplist.map(prop => expect(firstPost).toHaveProperty(prop))
  })

  test('all blogposts are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogposts.length)

    const contents = response.body.map(removeIDFromBlogpost)
    const toExpect = initialBlogposts.map(removeIDFromBlogpost)
    expect(contents).toEqual(expect.arrayContaining(toExpect))
  })
})

describe('adding a new blogpost', () => {
  test('succeeds with 201 if the fields are properly added', async () => {
    const post = { title: 'Ang Musmos na Kabihasnan ng Maynila', author: 'Ibn Saud', url: 'https://example.org', likes: 69 }
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

  test('succeeds, and if likes is undefined, use 0 as default', async () => {
    const post = { title: 'A post with undefined likes', author: 'Unliked author', url: 'https://example.org' }
    await api
      .post('/api/blogs')
      .send(post)
      .expect(201)

    const expectedPost = { ...post, likes: 0 }
    const blogpostsAtEnd = await blogpostsInDB()
    const contents = blogpostsAtEnd.map(removeIDFromBlogpost)
    expect(contents).toContainEqual(expectedPost)
  })

  test('fails with a 400 Bad Request if Title or URL is undefined', async () => {
    const postWithoutTitle = { author: 'Anon', url: 'https://example.com' }
    const postWihtoutURL = { title: 'Sans URL', author: 'Anon' }
    await api
      .post('/api/blogs')
      .send(postWithoutTitle)
      .expect(400)
    await api
      .post('/api/blogs')
      .send(postWihtoutURL)
      .expect(400)

    const blogpostsAtEnd = await blogpostsInDB()
    expect(blogpostsAtEnd).toHaveLength(initialBlogposts.length)
  })
})

describe('deleting a blogpost', () => {
  test('returns a 204', async () => {
    const blogpostsAtStart = await blogpostsInDB()
    const postToDelete = blogpostsAtStart[0]
    await api
      .delete(`/api/blogs/${postToDelete.id}`)
      .expect(204)

    const blogpostsAtEnd = await blogpostsInDB()
    expect(blogpostsAtEnd).not.toContainEqual(postToDelete)
  })

  test('returns a 204 if ID does not exist', async () => {
    const idToDelete = await nonExistingID()
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(204)
  })
})

afterAll(() => mongoose.connection.close())
