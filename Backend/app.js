require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const animeRoutes = require('./routes/animeRoutes'); // Import routes
const mangaRoutes = require('./routes/mangaRoutes'); // Import routes
const userRoutes = require('./routes/userRoutes'); // Import routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/anime', animeRoutes); // Use animeRoutes
app.use('/api/manga', mangaRoutes); // Use mangaRoutes
app.use('/api/users', userRoutes); // Use userRoutes

// Database connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;