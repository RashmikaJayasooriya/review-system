import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseGlobal | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI, { dbName: 'miv-review-db' })
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
