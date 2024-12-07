const path = require('path')

const PORT = 8080
const PUBLIC_PATH = path.join(__dirname, '..', 'public')

module.exports = {
  PORT,
  PUBLIC_PATH,
}