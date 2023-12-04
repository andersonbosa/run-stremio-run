const path = require('path')

const PORT = 8080
const STREMIO_SERVER_PORT = 11470
const SHOULD_AUTHENTICATE = true
const PUBLIC_PATH = path.join(__dirname, '..', 'public')
const URLS_JSON_PATH = path.join(PUBLIC_PATH, 'data.json')
const HOMEPAGE_PATH = path.join(PUBLIC_PATH, 'index.html')

module.exports = {
  PORT,
  STREMIO_SERVER_PORT,
  SHOULD_AUTHENTICATE,
  PUBLIC_PATH,
  URLS_JSON_PATH,
  HOMEPAGE_PATH
}