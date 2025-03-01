const express = require('express');
const mangaController = require('../controllers/mangaController');

const router = express.Router();

// Manga CRUD routes
router.get('/', mangaController.getAllManga);
router.post('/', mangaController.addManga);

// Home page sections for manga
router.get('/sections/top-rated', mangaController.getTopRatedManga);
router.get('/sections/currently-publishing', mangaController.getCurrentlyPublishingManga);

// Search route (must come before /:id)
router.get('/search', mangaController.searchManga);

// Individual manga routes
router.get('/:id', mangaController.getMangaById);
router.patch('/:id', mangaController.updateManga);
router.delete('/:id', mangaController.deleteManga);

module.exports = router;