const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  newsUrl: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50, // Defina um comprimento máximo adequado
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
