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
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(connectToDb);
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running at at http://localhost:${port}`);
});
