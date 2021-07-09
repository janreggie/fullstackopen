// dummy is a dummy funciton that returns 1 always
//
const dummy = (blogs) => {
  return 1
}

// totalLikes returns how many likes are there in total
// from a list of blogs that it is passed on to.
//
const totalLikes = (blogs) =>
  blogs.map(blog => blog.likes)
    .filter(v => v != null) // remove items without likes param, if any
    .reduce((c, s) => c + s, 0)

// favoriteBlog returns the blog wtih the most likes.
// If there are many top favorites, it's enough to return one of them
//
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return {} }

  // See https://stackoverflow.com/a/6102340/14020202 for max of array
  const maxLikes = Math.max.apply(Math,
    blogs.map(blog => blog.likes)
      .filter(v => v != null))
  const found = blogs.filter(blog => blog.likes === maxLikes)[0]

  return {
    id: found._id || found.id,
    title: found.title,
    author: found.author,
    url: found.url,
    likes: found.likes
  }
}

// mostBlog returns the author with the most number of blogs
// as well as how many blogs has he written
// from a list of blogs
//
const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return {} }

  // Create a map of authors and their counts
  //
  const counts = blogs.reduce(
    (prevCounts, blog) => {
      const author = blog.author
      if (typeof author !== 'string') {
        return prevCounts
      }
      if (!prevCounts.has(author)) {
        prevCounts.set(author, 1)
      } else {
        prevCounts.set(author, prevCounts.get(author) + 1)
      }
      return prevCounts
    },
    new Map()
  )

  let maxBlogCount = 0
  let mostWrittenAuthor = ''
  for (const [author, count] of counts.entries()) {
    if (count > maxBlogCount) {
      mostWrittenAuthor = author
      maxBlogCount = count
    }
  }

  return { author: mostWrittenAuthor, blogs: maxBlogCount }
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs }
