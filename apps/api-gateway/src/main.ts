// connecting using proxy server

import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
// import swaggerUi from "swagger-ui-express";
// import axios from "axios";
import cookieParser from "cookie-parser";
import { checkPrismaConnection } from "../../../packages/libs/prisma";
import initializeSiteConfig from "./libs/initializeSiteConfig";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:6001",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip,
});
app.use(limiter);

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

app.use("/product", proxy("http://localhost:6002", { limit: "100mb" }));
app.use("/", proxy("http://localhost:6001"));

const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  try {
    checkPrismaConnection();
    initializeSiteConfig();
    console.log("✅ Site configuration initialized successfully!");
  } catch (error) {
    console.error("Error during site config:", error);
  }
});
server.on("error", console.error);
