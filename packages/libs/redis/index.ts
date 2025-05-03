import Redis from "ioredis";
import { DatabaseError } from "../../error-handler";
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis Connected`);
    return process.env.REDIS_URL;
  }
  throw new Error("Redis Connection Failed");
};
let redis: Redis;
try {
  redis = new Redis(redisClient());
} catch (error) {
  console.log(error);
  throw new DatabaseError("Redis Connection Failed ", error);
}

export default redis;
