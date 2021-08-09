import config from './config.js'

const info = (...params) => {
  if (config.NODE_ENV === 'test') {
    return
  }
  console.log(...params)
}

const error = (...params) => {
  if (config.NODE_ENV === 'test') {
    return
  }
  console.error(...params)
}

export default { info, error }
