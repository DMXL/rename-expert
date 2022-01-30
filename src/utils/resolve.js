const path = require('path')

module.exports = (dir) => {
  if (dir[0] === '~') {
    return path.join(process.env.HOME, dir.slice(1))
  }
  return path.resolve(__dirname, process.cwd(), dir)
}