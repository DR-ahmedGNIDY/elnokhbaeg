import mongoose from "mongoose";
import { env } from "./env";

/**
 * Cached Mongoose connection for the Next.js serverless/Node runtime.
 * In dev, hot-reload would otherwise open a new connection on every change.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cache;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured.");
    }
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
