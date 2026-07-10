const mongoose = require("mongoose");

const connectDB = async () => {
  // First try the configured MONGO_URI (local MongoDB)
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("✅ MongoDB connected successfully (local)");
    return;
  } catch (error) {
    console.log("⚠️  Local MongoDB not found, starting in-memory database...");
  }

  // Fallback: use mongodb-memory-server (zero config, works offline)
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log("✅ MongoDB Memory Server started (development mode)");
    console.log("   ℹ️  Data is temporary and resets on server restart.");
    console.log("   ℹ️  Install MongoDB for persistent storage.");
  } catch (memErr) {
    console.error("❌ Failed to start any MongoDB:", memErr.message);
    process.exit(1);
  }
};

module.exports = connectDB;
