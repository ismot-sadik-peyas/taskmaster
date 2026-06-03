const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await UserModel.create(username, email, password);
    const token = UserModel.generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const user = UserModel.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await UserModel.validatePassword(user, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = UserModel.generateToken(user);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  const user = UserModel.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

module.exports = router;
