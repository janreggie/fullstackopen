// dummy is a dummy funciton that returns 1 always
const dummy = (blogs) => {
  return 1
}

// totalLikes returns how many likes are there in total
// from a list of blogs that it is passed on to.
//
const totalLikes = (blogs) =>
  blogs.map(blog => blog.likes)
    .filter(v => v) // remove items without likes param, if any
    .reduce((c, s) => c + s, 0)

export default { dummy, totalLikes }
