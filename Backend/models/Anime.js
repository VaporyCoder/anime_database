const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  episodes: { type: Number, required: true },
  genre: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Anime', animeSchema);