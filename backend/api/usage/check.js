const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const FREE_LIMIT = 3; // 3 free analyses per day

module.exports = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await client.connect();
    const database = client.db("code-explainer");
    const users = database.collection("users");

    let user = await users.findOne({ email });
    
    // Create user if not found
    if (!user) {
      const newUser = {
        email,
        createdAt: new Date(),
        usage: [],
        totalAnalyses: 0,
        subscription: 'free'
      };
      await users.insertOne(newUser);
      user = newUser;
    }

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const usageHistory = user.usageHistory || [];
    const todayUsage = usageHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= today && recordDate < tomorrow;
    });

    const usageCount = todayUsage.length;
    const remaining = FREE_LIMIT - usageCount;

    res.status(200).json({
      limit: FREE_LIMIT,
      used: usageCount,
      remaining: Math.max(0, remaining),
      resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error("Usage check error:", error);
    
    // Fallback response when MongoDB is not available
    res.status(200).json({
      limit: FREE_LIMIT,
      used: 0,
      remaining: FREE_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      fallback: true // Indicate this is fallback data
    });
  } finally {
    try {
      await client.close();
    } catch (closeError) {
      console.error("Error closing MongoDB connection:", closeError);
    }
  }
};
