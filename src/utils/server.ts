import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { deserializeUser } from '../middleware/deserializeUser'
dotenv.config()
const corsOptions = {
  origin: 'http://localhost:3000',
}
import routes from '../routes'
function createServer() {
  const app = express()
  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(helmet())
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
