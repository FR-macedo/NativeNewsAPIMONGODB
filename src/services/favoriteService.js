const Favorite = require('../models/Favorite');

class FavoriteService {
  async createFavorite(data) {
    return await Favorite.create(data);
  }

  async getAllFavorites(userId) {
    return await Favorite.find({ user_id: userId });
  }

  async getFavoritesByCategory(userId, category) {
    return await Favorite.find({ user_id: userId, category });
  }

  async getFavoritesByTitle(userId, title) {
    return await Favorite.find({
      user_id: userId,
      title: { $regex: title, $options: 'i' },
    });
  }

  async getPaginatedFavorites(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await Favorite.find({ user_id: userId })
      .skip(skip)
      .limit(limit);
  }

  async updateFavorite(id, updateData) {
    return await Favorite.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  async deleteFavorite(id) {
    return await Favorite.findByIdAndDelete(id);
  }
}

module.exports = new FavoriteService();
