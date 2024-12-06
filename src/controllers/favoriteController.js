const FavoriteService = require('../services/favoriteService');
const FavoriteValidation = require('../validations/favoriteValidation');
const mongoose = require("mongoose")

class FavoriteController {
  async createFavorite(req, res) {
    const { error } = FavoriteValidation.createValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const favorite = await FavoriteService.createFavorite({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(favorite);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao adicionar favorito', error: err.message });
    }
  }

  async getAllFavorites(req, res) {
    try {
      const favorites = await FavoriteService.getAllFavorites(req.user.id);
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar favoritos', error: err.message });
    }
  }

  async getFavoritesByTitle(req, res) {
    try {
      const { title } = req.query;
      const favorites = await FavoriteService.getFavoritesByTitle(req.user.id, title);
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar favoritos por título', error: err.message });
    }
  }

  async getPaginatedFavorites(req, res) {
    try {
      const { page, limit } = req.query;
      const favorites = await FavoriteService.getPaginatedFavorites(req.user.id, page, limit);
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar favoritos paginados', error: err.message });
    }
  }

  async updateFavorite(req, res) {
    // Validar se o ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de favorito inválido' });
    }
  
    const { error } = FavoriteValidation.updateValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    try {
      const favorite = await FavoriteService.updateFavorite(req.params.id, req.body);
      if (!favorite) return res.status(404).json({ message: 'Favorito não encontrado' });
      res.json(favorite);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao atualizar favorito', error: err.message });
    }
  }

  async deleteFavorite(req, res) {
    try {
      const favorite = await FavoriteService.deleteFavorite(req.params.id);
      if (!favorite) return res.status(404).json({ message: 'Favorito não encontrado' });
      res.json({ message: 'Favorito deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao deletar favorito', error: err.message });
    }
  }
}

module.exports = new FavoriteController();
