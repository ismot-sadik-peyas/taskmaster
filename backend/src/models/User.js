const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'taskmaster-secret-2024';

let users = [];

// Seed admin
(async () => {
  users.push({
    id: 'user-admin',
    username: 'admin',
    email: 'admin@taskmaster.com',
    passwordHash: await bcrypt.hash('Admin123!', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  });
})();

class UserModel {
  static findByUsername(username) {
    return users.find(u => u.username === username) || null;
  }

  static findByEmail(email) {
    return users.find(u => u.email === email) || null;
  }

  static findById(id) {
    return users.find(u => u.id === id) || null;
  }

  static async create(username, email, password) {
    if (!username || !email || !password) throw new Error('All fields required');
    if (password.length < 8) throw new Error('Password must be at least 8 characters');
    if (this.findByUsername(username)) throw new Error('Username already taken');
    if (this.findByEmail(email)) throw new Error('Email already registered');

    const user = {
      id: uuidv4(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  static reset() {
    users = [];
  }
}

module.exports = UserModel;
