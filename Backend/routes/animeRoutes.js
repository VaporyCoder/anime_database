const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

// Existing CRUD routes
router.get('/', animeController.getAllAnime);
router.post('/', animeController.addAnime);

// New routes for home page sections
router.get('/sections/top-rated', animeController.getTopRatedAnime);
router.get('/sections/currently-airing', animeController.getCurrentlyAiringAnime);

// New route for searching anime (MUST COME BEFORE /:id)
router.get('/search', animeController.searchAnime);

// Route for getting anime by ID (MUST COME AFTER /search)
router.get('/:id', animeController.getAnimeById);
router.patch('/:id', animeController.updateAnime);
router.delete('/:id', animeController.deleteAnime);

module.exports = router;