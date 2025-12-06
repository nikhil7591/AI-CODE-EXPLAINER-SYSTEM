const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    await client.connect();
    const database = client.db("code-explainer");
    const users = database.collection("users");

    const user = await users.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ 
      success: true, 
      user: {
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  } finally {
    await client.close();
  }
};
