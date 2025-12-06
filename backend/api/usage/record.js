const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await client.connect();
    const database = client.db("code-explainer");
    const users = database.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add usage record
    const usageRecord = {
      timestamp: new Date(),
      type: "ai_analysis"
    };

    await users.updateOne(
      { email },
      { 
        $push: { usageHistory: usageRecord },
        $set: { lastUsage: new Date() }
      }
    );

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Usage record error:", error);
    res.status(500).json({ error: "Failed to record usage" });
  } finally {
    await client.close();
  }
};
