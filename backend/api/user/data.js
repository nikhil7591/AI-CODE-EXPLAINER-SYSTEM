const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = {
  get: async (req, res) => {
    try {
      const { email } = req.query;

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

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({ data: userWithoutPassword.data || { analyses: [], favorites: [], history: [] } });

    } catch (error) {
      console.error("Get user data error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    } finally {
      await client.close();
    }
  },

  put: async (req, res) => {
    try {
      const { email, data } = req.body;

      if (!email || !data) {
        return res.status(400).json({ error: "Email and data are required" });
      }

      await client.connect();
      const database = client.db("code-explainer");
      const users = database.collection("users");

      const result = await users.updateOne(
        { email },
        { $set: { data, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ success: true });

    } catch (error) {
      console.error("Update user data error:", error);
      res.status(500).json({ error: "Failed to update user data" });
    } finally {
      await client.close();
    }
  }
};
