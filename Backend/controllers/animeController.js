const mongoose = require('mongoose');
const Anime = require('../models/Anime');

// Get all anime
const getAllAnime = async (req, res) => {
  try {
    const animeList = await Anime.find();
    res.status(200).json(animeList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching anime', error });
  }
};

// Get anime by ID
const getAnimeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid anime ID' });
    }

    const anime = await Anime.findById(id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.status(200).json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching anime', error });
  }
};

// Add a new anime
const addAnime = async (req, res) => {
  try {
    const {
      mal_id,
      title,
      title_english,
      title_japanese,
      title_synonyms,
      type,
      source,
      episodes,
      status,
      aired,
      duration,
      rating,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      season,
      year,
      broadcast,
      producers,
      licensors,
      studios,
      genres,
      themes,
      demographics,
      trailer,
      images,
    } = req.body;

    // Check if anime already exists (by mal_id)
    const existingAnime = await Anime.findOne({ mal_id });
    if (existingAnime) {
      return res.status(400).json({ message: 'Anime already exists' });
    }

    const newAnime = new Anime({
      mal_id,
      title,
      title_english,
      title_japanese,
      title_synonyms,
      type,
      source,
      episodes,
      status,
      aired,
      duration,
      rating,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      season,
      year,
      broadcast,
      producers,
      licensors,
      studios,
      genres,
      themes,
      demographics,
      trailer,
      images,
    });

    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ message: 'Error adding anime', error });
  }
};

// Update an anime
const updateAnime = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid anime ID' });
    }

    const {
      title,
      title_english,
      title_japanese,
      title_synonyms,
      type,
      source,
      episodes,
      status,
      aired,
      duration,
      rating,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      season,
      year,
      broadcast,
      producers,
      licensors,
      studios,
      genres,
      themes,
      demographics,
      trailer,
      images,
    } = req.body;

    const updatedAnime = await Anime.findByIdAndUpdate(
      id,
      {
        title,
        title_english,
        title_japanese,
        title_synonyms,
        type,
        source,
        episodes,
        status,
        aired,
        duration,
        rating,
        score,
        scored_by,
        rank,
        popularity,
        members,
        favorites,
        synopsis,
        background,
        season,
        year,
        broadcast,
        producers,
        licensors,
        studios,
        genres,
        themes,
        demographics,
        trailer,
        images,
        updated_at: Date.now(), // Update the timestamp
      },
      { new: true } // Return the updated document
    );

    if (!updatedAnime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.status(200).json(updatedAnime);
  } catch (error) {
    res.status(500).json({ message: 'Error updating anime', error });
  }
};

// Delete an anime
const deleteAnime = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid anime ID' });
    }

    const deletedAnime = await Anime.findByIdAndDelete(id);
    if (!deletedAnime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.status(200).json({ message: 'Anime deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting anime', error });
  }
};

// Get top-rated anime (sorted by score)
const getTopRatedAnime = async (req, res) => {
  try {
    const topRatedAnime = await Anime.find().sort({ score: -1 }).limit(10);
    res.status(200).json(topRatedAnime);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-rated anime', error });
  }
};

// Get currently airing anime (sorted by rank)
const getCurrentlyAiringAnime = async (req, res) => {
  try {
    const currentlyAiringAnime = await Anime.find({
      status: "Currently Airing",
      type: "TV", // Only TV series
      rating: { 
        $nin: [ // Exclude mature ratings
          'R+ - Mild Nudity',
          'Rx - Hentai'
        ]
      }
    })
    .sort({ popularity: 1 }) // Sort by popularity ascending (lower numbers are more popular)
    .limit(10);

    res.status(200).json(currentlyAiringAnime);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching currently airing anime', error });
  }
};

// Search anime by title
const searchAnime = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await Anime.find({
      title_english: { $regex: query, $options: 'i' }, // Case-insensitive search
    }).limit(10); // Limit results to 10
    res.json(results);
  } catch (error) {
    console.error('Error searching anime:', error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
};

module.exports = {
  getAllAnime,
  getAnimeById,
  addAnime,
  updateAnime,
  deleteAnime,
  getTopRatedAnime,
  getCurrentlyAiringAnime,
  searchAnime,
};