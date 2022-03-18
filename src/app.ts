<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import logger from "./utils/logger";
import { deserializeUser } from "./middleware/deserializeUser";
dotenv.config();
=======
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
>>>>>>> main

const app = express()
const port = process.env.API_PORT || 3000

<<<<<<< HEAD
app.use(express.json());
app.use(deserializeUser);

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`);
  routes(app);
});
=======
app.use(express.json())

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
})
app.get('/healthcheck', (req, res) => {
  res.send('<h1>Hello</h1>')
})
>>>>>>> main
