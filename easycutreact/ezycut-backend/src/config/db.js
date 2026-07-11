const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // force IPv4 — avoids WSL2 IPv6 (64:ff9b::) timeout issues
      serverSelectionTimeoutMS: 15000, // give Atlas more time before failing
    });

    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database Host : ${conn.connection.host}`);
    console.log(`🗄️ Database Name : ${conn.connection.name}`);
    console.log("====================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Error Message:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;