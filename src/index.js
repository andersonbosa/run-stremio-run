const express = require('express')
const path = require('path')
const fs = require('fs').promises
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const PORT = 8080
const STREMIO_SERVER_PORT = 11470
const SHOULD_AUTHENTICATE = true

const PUBLIC_PATH = path.join(__dirname, '..', 'public')
const URLS_JSON_PATH = path.join(PUBLIC_PATH, 'data.json')

app.use(express.static(PUBLIC_PATH))
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

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

/**
 * Handle the root route and add the host IP to the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', async (req, res) => {
  const hostIP = req.ip
  await addUrlToJSONDatabase(`http://${hostIP}:${STREMIO_SERVER_PORT}`)
  return res.sendFile(path.join(PUBLIC_PATH, 'index.html', { hostIP }))
})

/**
 * Handle the route for adding URLs.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/api/v1/url/add/:url?', authenticateUser, async (req, res) => {
  try {
    let incomingURL = req.body.url || req.params.url

    if (!incomingURL) {
      return res.status(400).json({ success: false, message: 'URL is required in the request body or as a parameter' })
    }

    await addUrlToJSONDatabase(incomingURL)

    return res.json({ success: true, message: 'URL added successfully' })
  } catch (error) {
    console.error('Error adding URL:', error)
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
})

/**
 * Handle the route for resetting URLs.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/api/v1/url/reset', authenticateUser, async (req, res) => {
  try {
    // Reset the URLs to an empty array
    const emptyUrls = []
    await fs.writeFile(URLS_JSON_PATH, JSON.stringify(emptyUrls, null, 2))

    return res.json({ success: true, message: 'URLs reset successfully' })
  } catch (error) {
    console.error('Error resetting URLs:', error)
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
  }
})

/**
 * Start the server and listen on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
