import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

// Global cache for MongoDB connection (prevents multiple connections in Vercel)
// @ts-expect-error: Mongoose is not defined
const cached = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI)
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

// Store cache globally (Vercel-specific optimization)
// @ts-expect-error: Mongoose is not defined
global.mongoose = cached;

export default connectDB;
