const express = require('express');
const FavoriteController = require('../controllers/favoriteController');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', AuthMiddleware.authenticate, FavoriteController.createFavorite);
router.get('/', AuthMiddleware.authenticate, FavoriteController.getAllFavorites);
router.get('/search', AuthMiddleware.authenticate, FavoriteController.getFavoritesByTitle);
router.get('/paginated', AuthMiddleware.authenticate, FavoriteController.getPaginatedFavorites);
router.put('/:id', AuthMiddleware.authenticate, FavoriteController.updateFavorite);
router.delete('/:id', AuthMiddleware.authenticate, FavoriteController.deleteFavorite);

module.exports = router;
