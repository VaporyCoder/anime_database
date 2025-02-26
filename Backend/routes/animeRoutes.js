const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

// Anime routes
router.get('/', animeController.getAllAnime);
router.get('/:id', animeController.getAnimeById); // Add this line
router.post('/', animeController.addAnime);
router.patch('/:id', animeController.updateAnime);
router.delete('/:id', animeController.deleteAnime);

module.exports = router;