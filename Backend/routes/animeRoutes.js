const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

// Existing CRUD routes
router.get('/', animeController.getAllAnime);
router.post('/', animeController.addAnime);

// Section routes
router.get('/sections/trending', animeController.getTrendingAnime);
router.get('/sections/top-rated', animeController.getTopRatedAnime);
router.get('/sections/currently-airing', animeController.getCurrentlyAiringAnime);
router.get('/sections/upcoming', animeController.getUpcomingAnime);
router.get('/sections/movies', animeController.getAnimeMovies);
router.get('/genres', animeController.getAnimeGenres);

// Search route
router.get('/search', animeController.searchAnime);

// Single anime routes
router.get('/:id', animeController.getAnimeById);
router.patch('/:id', animeController.updateAnime);
router.delete('/:id', animeController.deleteAnime);

module.exports = router;