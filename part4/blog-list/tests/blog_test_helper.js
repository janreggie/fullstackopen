import Blog from '../models/blog'

const initialBlogposts = [
  {
    title: 'Sample blog post',
    author: 'Jessica Rodriguez',
    url: 'https://example.com',
    likes: 43
  },
  {
    title: 'Yet another blog post',
    author: 'Jessica Rodriguez',
    url: 'https://example.com',
    likes: 43
  }
]

const nonExistingID = async () => {
  const blog = new Blog({ title: 'Will remove this soon' })
  await blog.save()
  await blog.remove()
  return blog.__id.toString()
}

const blogpostsInDB = async () => {
  const blogposts = await Blog.find({})
  return blogposts.map(post => post.toJSON())
}

export { initialBlogposts, nonExistingID, blogpostsInDB }
