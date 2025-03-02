const mongoose = require('mongoose');
const Manga = require('../models/Manga');

// Get all manga
const getAllManga = async (req, res) => {
  try {
    const mangaList = await Manga.find();
    res.status(200).json(mangaList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching manga', error });
  }
};

// Get manga by ID
const getMangaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid manga ID' });
    }

    const manga = await Manga.findById(id);
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }
    res.status(200).json(manga);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching manga', error });
  }
};

// Add a new manga
const addManga = async (req, res) => {
  try {
    const {
      mal_id,
      title,
      title_english,
      title_japanese,
      type,
      chapters,
      volumes,
      status,
      published,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      authors,
      serializations,
      genres,
      themes,
      demographics,
      images,
    } = req.body;

    const existingManga = await Manga.findOne({ mal_id });
    if (existingManga) {
      return res.status(400).json({ message: 'Manga already exists' });
    }

    const newManga = new Manga({
      mal_id,
      title,
      title_english,
      title_japanese,
      type,
      chapters,
      volumes,
      status,
      published,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      authors,
      serializations,
      genres,
      themes,
      demographics,
      images,
    });

    await newManga.save();
    res.status(201).json(newManga);
  } catch (error) {
    res.status(500).json({ message: 'Error adding manga', error });
  }
};

// Update a manga
const updateManga = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid manga ID' });
    }

    const {
      title,
      title_english,
      title_japanese,
      type,
      chapters,
      volumes,
      status,
      published,
      score,
      scored_by,
      rank,
      popularity,
      members,
      favorites,
      synopsis,
      background,
      authors,
      serializations,
      genres,
      themes,
      demographics,
      images,
    } = req.body;

    const updatedManga = await Manga.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedManga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    res.status(200).json(updatedManga);
  } catch (error) {
    res.status(500).json({ message: 'Error updating manga', error });
  }
};

// Delete a manga
const deleteManga = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid manga ID' });
    }

    const deletedManga = await Manga.findByIdAndDelete(id);
    if (!deletedManga) {
      return res.status(404).json({ message: 'Manga not found' });
    }
    res.status(200).json({ message: 'Manga deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting manga', error });
  }
};

// Get top-rated manga
const getTopRatedManga = async (req, res) => {
  try {
    const topRatedManga = await Manga.find()
      .sort({ score: -1 })
      .limit(10);
    res.status(200).json(topRatedManga);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-rated manga', error });
  }
};

// Get currently publishing manga
const getCurrentlyPublishingManga = async (req, res) => {
  try {
    const currentlyPublishing = await Manga.find({
      status: "Publishing",
      type: "Manga",
      demographics: {
        $nin: ["Hentai", "Adult"] // Exclude mature demographics
      }
    })
    .sort({ popularity: 1 })
    .limit(10);

    res.status(200).json(currentlyPublishing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching publishing manga', error });
  }
};

// Search manga by title
const searchManga = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await Manga.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { title_english: { $regex: query, $options: 'i' } },
        { title_japanese: { $regex: query, $options: 'i' } }
      ]
    }).sort({
      score: -1, // Higher scored items first
      popularity: 1 // More popular items first
    }).limit(10);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
};

module.exports = {
  getAllManga,
  getMangaById,
  addManga,
  updateManga,
  deleteManga,
  getTopRatedManga,
  getCurrentlyPublishingManga,
  searchManga,
};