import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

// Don't throw error during build time
if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // Return early if no MONGODB_URI is configured
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured")
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
