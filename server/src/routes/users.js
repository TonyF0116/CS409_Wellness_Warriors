const express = require("express");
const bcrypt = require("bcrypt");

function createUsersRouter(store) {
  const router = express.Router();

  // Signup route
  router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }
    const existingUser = await store.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await store.createUser(username, hashedPassword);
    res.set("x-user-id", user.id);
    res
      .status(201)
      .json({ message: "User created successfully.", userId: user.id });
  });

  // Login route
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }
    const user = await store.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    res.set("x-user-id", user.id);
    res.json({ message: "Login successful.", userId: user.id });
  });

  return router;
}

module.exports = createUsersRouter;
