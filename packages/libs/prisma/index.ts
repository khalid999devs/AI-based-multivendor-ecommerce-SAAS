import { PrismaClient } from "@prisma/client";
require("dotenv").config();

declare global {
  namespace globalThis {
    var prismadb: PrismaClient;
  }
}

const prisma = new PrismaClient();

export async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Primary Database connected successfully!");
  } catch (error) {
    console.error("❌ Primary Database connection failed:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === "production") global.prismadb = prisma;

export default prisma;
