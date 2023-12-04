const express = require('express')
const path = require('path')
const fs = require('fs').promises
const cors = require('cors')
const morgan = require('morgan')
const ip = require('ip')

const {
  PORT,
  STREMIO_SERVER_PORT,
  PUBLIC_PATH,
  URLS_JSON_PATH,
} = require('./constants')

const {
  authenticateUser,
  addUrlToJSONDatabase
} = require('./utils')

const app = express()

app.use(express.static(PUBLIC_PATH))
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.set('views', path.join(PUBLIC_PATH, 'views'))
app.set('view engine', 'ejs')

/**
 * Handle the root route and add the host IP to the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', async (req, res) => {
  const localIP = 'localhost' //ip.address()
  const stremioLocalURL = `http://${localIP}:${STREMIO_SERVER_PORT}`
  addUrlToJSONDatabase(stremioLocalURL)

  return res.render('index', { stremioLocalURL })
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
