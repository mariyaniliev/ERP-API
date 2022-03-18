import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import logger from "./utils/logger";
import { deserializeUser } from "./middleware/deserializeUser";
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(deserializeUser);

app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`);
  routes(app);
});
