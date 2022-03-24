import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { deserializeUser } from '../middleware/deserializeUser'
const corsOptions = {
  origin: 'http://localhost:3000',
}
dotenv.config()
import routes from '../routes'
function createServer() {
  const app = express()
  app.use(express.json())
  app.use(cors(corsOptions))
  /**
   * * Check if the user provides valid token
   * ? If not
   * ! routes are blocked
   * * by the next middleware which expects user in res.locals
   * ? If valid
   * * user is assigned to res.locals
   */
  app.use(deserializeUser)
  routes(app)
  return app
}

export default createServer
