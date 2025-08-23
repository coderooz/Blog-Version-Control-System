import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as unknown as { _mongoose?: Cached };
const cached: Cached = globalWithMongoose._mongoose ?? { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: 'blogvcs'
    });
    globalWithMongoose._mongoose = cached;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
