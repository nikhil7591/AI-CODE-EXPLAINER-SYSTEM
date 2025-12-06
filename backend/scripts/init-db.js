// MongoDB Database Initialization Script
// This script creates the database structure and clears existing data

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function initializeDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("code-explainer");
    const users = database.collection("users");

    // Clear existing users for clean start
    const deleteResult = await users.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing users`);

    // Create indexes for better performance
    await users.createIndex({ email: 1 }, { unique: true });
    console.log("Created unique index on email field");

    console.log("Database initialization complete!");
    console.log("Database is ready for dynamic user creation");
    console.log("Users will be stored when they sign up");

  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
