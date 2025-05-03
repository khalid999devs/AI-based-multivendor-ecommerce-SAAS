import express from "express";
import cors from "cors";
import { errorMiddleWare } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger_output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API welcome to the site" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// routes
app.use("/api", router);

app.use(errorMiddleWare);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});

server.on("error", (err) => {
  console.log(`Server Error:`, err);
});
