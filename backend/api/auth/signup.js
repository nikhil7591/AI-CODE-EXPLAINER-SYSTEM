const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    await client.connect();
    const database = client.db("code-explainer");
    const users = database.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Create new user
    const newUser = {
      name,
      email,
      password, // In production, you should hash this
      createdAt: new Date(),
      data: {
        analyses: [],
        favorites: [],
        history: []
      }
    };

    await users.insertOne(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(200).json({ 
      success: true, 
      user: {
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  } finally {
    await client.close();
  }
};
