import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Auth Service API",
    description:
      "API documentation for the Auth Service (Automatically generated swagger documentation)",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
  basePath: "/api",
};

const outputFile = "./swagger_output.json";
const endPointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen(outputFile, endPointsFiles, doc);
