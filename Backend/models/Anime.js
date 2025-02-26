const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true }, // MyAnimeList ID
  title: { type: String, required: true },
  title_english: { type: String, required: false },
  type: { type: String, required: false},
  description: { type: String, required: true },
  episodes: { type: Number, required: false },
  genre: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  rank: { type: Number, required: false },
  image: { type: String, required: true },
  season: { type: String, required: false },
  status: { type: String }, // e.g., "Currently Airing", "Finished Airing"
  aired: {
    from: { type: Date }, // Start date
    to: { type: Date }, // End date
  },
  score: { type: Number }, // MyAnimeList score
  created_at: { type: Date, default: Date.now }, // When this record was added
  updated_at: { type: Date, default: Date.now }, // When this record was last updated
});

module.exports = mongoose.model('Anime', animeSchema);