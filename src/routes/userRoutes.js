const express = require('express');
const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rotas protegidas
router.get('/', AuthMiddleware.authenticate, UserController.getAll);
router.put('/:id', AuthMiddleware.authenticate, UserController.update);
router.delete('/:id', AuthMiddleware.authenticate, UserController.delete);
router.put('/preferences', AuthMiddleware.authenticate, UserController.updatePreferences);

module.exports = router;
