const express = require('express');
const AuthMiddleware = require('../middleware/authMiddleware');
const UserService = require('../services/userService');
const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await AuthMiddleware.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserService.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    const newUser = await UserService.createUser({ name, email, password });
    const token = AuthMiddleware.generateToken(newUser);

    res.status(201).json({
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
});

module.exports = router;
