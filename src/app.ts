import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.API_PORT || 3000

app.use(express.json())

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
})
app.get('/healthcheck', (req, res) => {
  res.send('<h1>Hello</h1>')
})
