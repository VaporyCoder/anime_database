const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true }, // MyAnimeList ID
  title: { type: String, required: true }, // Main title
  title_english: { type: String, required: false }, // English title
  title_japanese: { type: String, required: false }, // Japanese title
  title_synonyms: { type: [String], required: false }, // Alternative titles
  type: { type: String, required: false }, // e.g., "TV", "Movie", "OVA"
  source: { type: String, required: false }, // e.g., "Manga", "Original"
  episodes: { type: Number, required: false }, // Total episodes
  status: { type: String, required: false }, // e.g., "Currently Airing", "Finished Airing"
  aired: {
    from: { type: Date }, // Start date
    to: { type: Date }, // End date
  },
  duration: { type: String, required: false }, // Episode duration (e.g., "24 min per ep")
  rating: { type: String, required: false }, // e.g., "PG-13", "R"
  score: { type: Number, required: false }, // MAL score
  scored_by: { type: Number, required: false }, // Number of users who scored
  rank: { type: Number, required: false }, // MAL rank
  popularity: { type: Number, required: false }, // MAL popularity
  members: { type: Number, required: false }, // Number of members who added to their list
  favorites: { type: Number, required: false }, // Number of users who favorited
  synopsis: { type: String, required: false }, // Detailed description
  background: { type: String, required: false }, // Background information
  season: { type: String, required: false }, // e.g., "Summer 2023"
  year: { type: Number, required: false }, // Release year
  broadcast: {
    day: { type: String }, // e.g., "Mondays"
    time: { type: String }, // e.g., "23:00"
    timezone: { type: String }, // e.g., "Asia/Tokyo"
    string: { type: String }, // e.g., "Mondays at 23:00 (JST)"
  },
  producers: { type: [String], required: false }, // List of producers
  licensors: { type: [String], required: false }, // List of licensors
  studios: { type: [String], required: false }, // List of studios
  genres: { type: [String], required: true }, // List of genres
  themes: { type: [String], required: false }, // List of themes
  demographics: { type: [String], required: false }, // List of demographics
  trailer: {
    youtube_id: { type: String }, // YouTube video ID
    url: { type: String }, // Trailer URL
    embed_url: { type: String }, // Embed URL
    images: {
      small: { type: String }, // Small thumbnail
      medium: { type: String }, // Medium thumbnail
      large: { type: String }, // Large thumbnail
      maximum: { type: String }, // Maximum resolution thumbnail
    },
  },
  images: {
    jpg: {
      image_url: { type: String }, // Default image URL
      small_image_url: { type: String }, // Small image URL
      large_image_url: { type: String }, // Large image URL
    },
    webp: {
      image_url: { type: String }, // WebP image URL
      small_image_url: { type: String }, // Small WebP image URL
      large_image_url: { type: String }, // Large WebP image URL
    },
  },
  created_at: { type: Date, default: Date.now }, // Timestamp when the document was created
  updated_at: { type: Date, default: Date.now }, // Timestamp when the document was last updated
});

module.exports = mongoose.model('Anime', animeSchema);