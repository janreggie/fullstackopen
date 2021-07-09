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
  if (blogs.length === 1) {
    const blog = blogs[0]
    return { author: blog.author, blogs: 1 }
  }

  // Create a map of authors and their counts
  //
  const blogCounts = blogs.reduce(
    (counts, blog) => {
      const author = blog.author
      if (typeof author !== 'string') {
        return counts
      }

      if (!counts.has(author)) {
        counts.set(author, 1)
      } else {
        counts.set(author, counts.get(author) + 1)
      }
      return counts
    },
    new Map()
  )

  let maxBlogCount = 0
  let mostWrittenAuthor = ''
  for (const [author, count] of blogCounts.entries()) {
    if (count > maxBlogCount) {
      mostWrittenAuthor = author
      maxBlogCount = count
    }
  }

  return { author: mostWrittenAuthor, blogs: maxBlogCount }
}

// mostLikes returns the author with the most number of likes received
// as well as said number
//
const mostLikes = (blogs) => {
  if (blogs.length === 0) { return {} }
  if (blogs.length === 1) {
    const blog = blogs[0]
    return { author: blog.author, likes: blog.likes }
  }

  // Create map of authors and how many likes they received
  const likeCounts = blogs.reduce(
    (counts, blog) => {
      const author = blog.author
      const likes = blog.likes
      if (typeof author !== 'string' || typeof likes !== 'number') {
        return counts
      }

      if (!counts.has(author)) {
        counts.set(author, likes)
      } else {
        counts.set(author, counts.get(author) + likes)
      }

      return counts
    },
    new Map()
  )

  let maxLikes = 0
  let mostLikedAuthor = ''
  for (const [author, likes] of likeCounts) {
    if (likes > maxLikes) {
      mostLikedAuthor = author
      maxLikes = likes
    }
  }

  return { author: mostLikedAuthor, likes: maxLikes }
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
