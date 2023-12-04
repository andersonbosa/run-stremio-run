const fs = require('fs').promises
const path = require('path')


const {
  PORT,
  STREMIO_SERVER_PORT,
  SHOULD_AUTHENTICATE,
  PUBLIC_PATH,
  URLS_JSON_PATH,
} = require('./constants')


// Simple in-memory user database (for demonstration purposes)
const users = [
  { username: 'admin', password: 'password123' },
  // Add more users as needed
]

/**
 * Middleware to check user authentication.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const authenticateUser = (req, res, next) => {
  if (!SHOULD_AUTHENTICATE) {
    return next()
  }

  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing authentication header' })
  }

  const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':')
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid credentials' })
  }

  // Attach the user object to the request for future use
  req.user = user

  next()
}

/**
 * Add a URL to the JSON database file.
 * @param {string} incomingURL - The URL to add to the database.
 */
async function addUrlToJSONDatabase (incomingURL) {
  console.log(`Adding ${incomingURL} to the database`)

  const currentLocalURLs = await fs.readFile(URLS_JSON_PATH, 'utf-8')
  const updatedLocalURLsSet = new Set(JSON.parse(currentLocalURLs))

  // Check if the URL already exists
  if (updatedLocalURLsSet.has(incomingURL)) {
    return // URL already exists
  }

  updatedLocalURLsSet.add(incomingURL)

  const updatedLocalURLsArr = Array.from(updatedLocalURLsSet)
  await fs.writeFile(URLS_JSON_PATH, JSON.stringify(updatedLocalURLsArr, null, 2))
}

module.exports = {
  authenticateUser,
  addUrlToJSONDatabase
}