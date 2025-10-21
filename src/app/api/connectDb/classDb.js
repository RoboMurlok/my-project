import mongoose from "mongoose";

const connections = {}; // кеш соединений для классов

export function normalizeClassName(name) {
  
  const map = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e" };
  return (
    "class_" +
    name
      .toLowerCase()
      .split("")
      .map((ch) => map[ch] || ch)
      .join("")
  );
}

export async function classDb(className) {
  const dbName = normalizeClassName(className);

  if (connections[dbName]) return connections[dbName];

  const MONGODB_URI = `mongodb+srv://sonin1997:OyGxVSP5SJAMiy4c@school.etjplan.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=school`;

  const conn = await mongoose.createConnection(MONGODB_URI).asPromise();

  conn.on("connected", () => console.log(`✅ MongoDB подключено: ${dbName}`));
  conn.on("error", (err) =>
    console.error(`❌ Ошибка подключения к ${dbName}:`, err)
  );

  connections[dbName] = conn;
  return conn;
}
