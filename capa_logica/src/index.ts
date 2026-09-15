import express from "express";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
const morgan = require("morgan");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rutas // 


export default app;