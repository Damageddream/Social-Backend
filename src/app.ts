import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler";
import notFound from "./middleware/notFound";
import connectToDb from "./middleware/database";
import dotenv from "dotenv";

dotenv.config();
// create app
const app: Express = express();
const port = process.env.PORT || 3000;

// add middlewares from libraries
app.use(helmet());
app.use(connectToDb);
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

// add body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(json());

// add error handiling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running at at http://localhost:${port}`);
});
