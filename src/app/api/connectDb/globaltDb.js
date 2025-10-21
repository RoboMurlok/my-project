import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://sonin1997:OyGxVSP5SJAMiy4c@school.etjplan.mongodb.net/?retryWrites=true&w=majority&appName=school";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "teacher" })
      .then((mongoose) => {
        console.log("✅ MongoDB подключено:", mongoose.connection.name);
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ Ошибка подключения к MongoDB:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


