// dummy is a dummy funciton that returns 1 always
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

export default { dummy, totalLikes, favoriteBlog }
