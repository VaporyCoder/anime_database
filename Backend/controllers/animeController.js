const Anime = require('../models/Anime');

// Get all anime
exports.getAllAnime = async (req, res) => {
  try {
    const anime = await Anime.find();
    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single anime by ID
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new anime
exports.addAnime = async (req, res) => {
  const anime = new Anime({
    title: req.body.title,
    description: req.body.description,
    episodes: req.body.episodes,
    genre: req.body.genre,
    image: req.body.image,
  });

  try {
    const newAnime = await anime.save();
    res.status(201).json(newAnime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an anime
exports.updateAnime = async (req, res) => {
  const { id } = req.params; // Get the anime ID from the URL
  const updates = req.body; // Get the updates from the request body

  try {
    const updatedAnime = await Anime.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAnime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(updatedAnime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an anime
exports.deleteAnime = async (req, res) => {
  const { id } = req.params; // Get the anime ID from the URL

  try {
    const deletedAnime = await Anime.findByIdAndDelete(id);
    if (!deletedAnime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json({ message: 'Anime deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};