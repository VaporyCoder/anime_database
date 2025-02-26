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
    const { mal_id, title, title_english, description, episodes, genre, rating, image, status, aired } = req.body;

    // Check if anime already exists (by mal_id)
    const existingAnime = await Anime.findOne({ mal_id });
    if (existingAnime) {
      return res.status(400).json({ message: 'Anime already exists' });
    }

    const newAnime = new Anime({
      mal_id,
      title,
      title_english,
      description,
      episodes,
      genre,
      rating,
      image,
      status,
      aired,
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

    const { title, title_english, description, episodes, genre, rating, image, status, aired, season, type, rank } = req.body;

    const updatedAnime = await Anime.findByIdAndUpdate(
      id,
      {
        title,
        title_english,
        description,
        episodes,
        genre,
        rating,
        image,
        status,
        aired,
        season,
        type,
        rank,
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

module.exports = {
  getAllAnime,
  getAnimeById,
  addAnime,
  updateAnime,
  deleteAnime,
};