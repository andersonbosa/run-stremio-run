const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

const {
  PORT,
  PUBLIC_PATH,
} = require('./constants')

const app = express()

app.use(express.static(PUBLIC_PATH))
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.set('views', path.join(PUBLIC_PATH, 'views'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const stremioLocalURL = 'https://web.stremio.com/?streamingServer=http%3A%2F%2Flocalhost%3A11470#/'
  return res.render('index', { stremioLocalURL })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
