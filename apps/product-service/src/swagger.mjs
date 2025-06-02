import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Product Service API",
    description:
      "API documentation for the Product Service (Automatically generated swagger documentation)",
    version: "1.0.0",
  },
  host: "localhost:6002",
  schemes: ["http"],
  basePath: "/api",
};

const outputFile = "./swagger_output.json";
const endPointsFiles = ["./routes/product.route.ts"];

swaggerAutogen(outputFile, endPointsFiles, doc);
