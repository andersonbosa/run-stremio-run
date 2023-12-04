const express = require('express')
const path = require('path')
const fs = require('fs').promises
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const PORT = 8080
const PUBLIC_PATH = path.join(__dirname, '..', 'public')
const URLS_JSON_PATH = path.join(PUBLIC_PATH, 'urls.json')
app.use(express.static(PUBLIC_PATH))
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, 'index.html'))
})

app.post('/api/v1/url/add/:url?', async (req, res) => {
  try {
    let incommingURL = req.body.url || req.params.url

    if (!incommingURL) {
      return res
        .status(400)
        .json({ success: false, message: 'URL is required in the request body or as a parameter' })
    }

    const currentLocalURLs = await fs.readFile(URLS_JSON_PATH, 'utf-8')
    const updatedLocalURLsSet = new Set(JSON.parse(currentLocalURLs))

    updatedLocalURLsSet.add(incommingURL)
    console.log(updatedLocalURLsSet)

    const updatedLocalURLsArr = Array.from(updatedLocalURLsSet)
    await fs.writeFile(URLS_JSON_PATH, JSON.stringify(updatedLocalURLsArr, null, 2))

    return res
      .json({ success: true, message: 'URL added successfully' })

  } catch (error) {
    console.error('Error adding URL:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
